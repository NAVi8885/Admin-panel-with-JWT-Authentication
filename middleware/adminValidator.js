const { check, validationResult } = require('express-validator');

const validateAdmin = [
    check('name')
    .notEmpty()
    .isLength({min:3, max: 15}),

    check('password')
    .isLength({min: 3}),
    
    (req, res, next) => {
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.render('adminLogin', { userExist: true, pswd: false, message: 'something wrong with length'});
    }
        next()
    }
];

module.exports = { validateAdmin };
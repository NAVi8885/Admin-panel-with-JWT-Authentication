const {check, validationResult} = require('express-validator');

const validateUser = [
    
    check('name')
    .notEmpty()
    .isLength({min:3, max: 15}).withMessage('name not valid'),

    check('email')
    .isEmail().withMessage('email not valid'),

    check('password')
    .isLength({min: 3}).withMessage('password not valid'),

    check('confirmPassword')
    .isLength({min:3}),
    // check('otp') 
    // .isLength({min: 6, max: 6}),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', { errors: errors.array()});
        }
       next()
    }

];

const loginValidator = [
    check('email')
    .isEmail().withMessage('Email not valid'),

    check('password')
    .notEmpty().withMessage('Please enter password'),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('login', { errors: errors.array()})
        }
        next()
    }
]



module.exports = {
    validateUser,
    loginValidator
};
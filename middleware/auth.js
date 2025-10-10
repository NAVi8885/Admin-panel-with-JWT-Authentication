const jwt = require('jsonwebtoken');
const user = require('../models/user')
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.render('login',{userExist: false, pswd: true, message: 'Authorisation failed'})
    }

    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await user.findById(data.userId).select("-password");
    
    next();
}

module.exports = verifyToken;
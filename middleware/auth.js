const jwt = require('jsonwebtoken');
const user = require('../models/user');
const expressAsyncHandler = require('express-async-handler');

const verifyToken = expressAsyncHandler ( async (req, res, next) => {
    console.log("working");
    
    const token = req.cookies.token;
    console.log(token);
    
    if(!token){
        return res.render('login',{userExist: false, pswd: true, message: 'Authorisation failed'})
    }

    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await user.findById(data.userId).select("-password");
    if(!user){
        return res.redirect('/login');
    }

    req.user = user

    next();
})

module.exports = verifyToken;
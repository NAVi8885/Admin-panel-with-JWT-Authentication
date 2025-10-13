const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const verifyAdmin =asyncHandler (async (req, res, next)=> {
    const token = req.cookies.adminToken;
    if(!token) {
        return res.status(403).render('login',{userExist: false, pswd: true, message: 'authorisation denied'});
    }

    // verifing token
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user =await User.findById(data.adminId).select("-password");

    next();
})

module.exports = verifyAdmin;
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const verifyAdmin = asyncHandler (async (req, res, next)=> {
    const token = req.cookies.adminToken;
     
    if(!token) {
        return res.render('adminLogin',{userExist: false, pswd: true, message: 'Please log in again'});
    }
    
    // verifing token
    const data = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.admin = await Admin.findById(data.id);
    if(!req.admin){
        return res.redirect('/admin/login');
    }

    next();
})

module.exports = verifyAdmin;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const expressAsyncHandler = require('express-async-handler');

const verifyToken = expressAsyncHandler ( async (req, res, next) => {

    
    const token = req.cookies.token;
    console.log(token);
    
    if(!token){
        return res.redirect('login');
    }

    const data = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(data.id);
    if(!req.user){
        return res.redirect('/login');
    }

    next();
})

module.exports = verifyToken;
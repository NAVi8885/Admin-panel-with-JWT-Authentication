const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// REGISTER

const register = async (req, res) => {
    const {name , email , password , confirmPassword} = req.body
    const isUser = await User.findOne({email:email});

    if(isUser){
        return res.render('register', {errors: [{msg:'Email alresady exists',path:"name"}]})
    }
    if(password != confirmPassword){
        return res.render('register', {errors: [{msg:'Password does not match',path:"name"}]})
    }

    const hashedPass =await bcrypt.hash(password,10);

    const user = await User.create({name, email, password : hashedPass})

    if(user){
        return res.render('login',{errors:[]});
    } 
}

// LOGIN

const login = async (req, res) => {
    const {email , password} = req.body
    const isUser = await User.findOne({email})
    if(!isUser){
        return res.render('login', {errors : [{msg:'User not found', path:'name'}]})
    }
    const isPassword = await bcrypt.compare(password,isUser.password)
    if(!isPassword){
        return res.render('login', {errors: [{msg:'Password incorrect',path:'name'}]})
    }

    const token = jwt.sign({id:isUser._id, email: isUser.email},process.env.JWT_SECRET_KEY,{expiresIn: '1d'})
    res.cookie('token', token,{
        httpOnly: true,
        maxAge:24*60*60*1000
    })

       return res.render(`dashboard`,{user: email})
}

// LOG OUT

const logoutUser = async (req, res) => {
    res.clearCookie('token',  { httpOnly: true, sameSite: "strict" });
    res.redirect('/login');
}

// FORGOT PASSWORD

const forgotPassword = async (req, res) => {
    const {email} = req.body
    let emails = email;
    console.log('1', emails)
    const user = await User.findOne
}


module.exports =
{
    register,
    login,
    logoutUser,
    forgotPassword
}
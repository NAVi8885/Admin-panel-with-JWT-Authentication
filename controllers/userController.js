const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    console.log("hey")
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
        return res.render('login');
    } 
}

// LOGIN

const login = async (req, res) => {
    const {email , password} = req.body
    const isUser = await User.findOne({email})
    if(!isUser){
        return res.render('login', {errors : [{msg:'User not found', path:'email'}]})
    }
    const isPassword = await bcrypt.compare(password,isUser.password)
    if(!isPassword){
        return res.render('login', {errors: [{msg:'Password incorrect',path:'password'}]})
    }

    const token = jwt.sign({id:isUser._id, email: isUser.email},process.env.JWT_SECRET_KEY,{expiresIn: '1d'})
    res.cookie('token', token,{
        httpOnly: true,
        maxAge:24*60*60*1000
    })
    
    return res.render('dashboard',{user : isUser.email, errors: [{msg:'Password incorrect',path:'password'}]})

    // return res.redirect('')

}

module.exports =
{
    register,
    login
}
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer-otp')
const { sendOtpEmail  } = require("../otpApp");
const expressAsyncHandler = require("express-async-handler");


// REGISTER

const register = expressAsyncHandler ( async (req, res) => {
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
})

// LOGIN

const login = expressAsyncHandler ( async (req, res) => {
    const { email , password } = req.body
    const isUser = await User.findOne({email})
    if(isUser.isBlock === true){
        return res.render('login', {errors : [{msg:'user is blocked', path:'name'}]})
    }

    if(!isUser){
        return res.render('login', {errors : [{msg:'User not found', path:'name'}]})
    }
    const isPassword = await bcrypt.compare(password,isUser.password)
    if(!isPassword){
        return res.render('login', {errors: [{msg:'Password incorrect',path:'password'}]})
    }
    const token = jwt.sign({id:isUser._id},process.env.JWT_SECRET_KEY,{expiresIn: '1d'})

    res.cookie('token', token,{
        maxAge:24*60*60*1000
    })

    // req.session.user = isUser;
    return res.redirect(`/dashboard`)
})

// LOG OUT

const logoutUser = expressAsyncHandler ( async (req, res) => {
    res.clearCookie('token',  { httpOnly: true, sameSite: "strict" });
    return res.redirect('/login');
})

// FORGOT PASSWORD

const forgotPassword = expressAsyncHandler ( async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    // console.log(email,user)
    
    if(!user){
        return res.render('forgotPassword', {message: 'User not found', userExist: false})
    }
    
    const otp = await sendOtpEmail(email);
    await User.findOneAndUpdate({ email },
        {
            otp,
            otpExpiry: new Date(Date.now() + 2 * 60 * 1000) // 1 mint
        }
    );
    // return res.render('verifyOtp', {email})
    return res.redirect(`/verifyOtp?email=${email}`);
})

// VERIFY OTP

const verifyOtp = expressAsyncHandler (async (req, res) => {
    const { otp, email } = req.body;

// const email = req.query;
    // console.log("Email in verifyOtp:", email);

    const user = await User.findOne({ email })
    if (!user) {
    return res.render('verifyOtp', { message: 'User not found', email });
    }
    if(!otp){
        return res.render('verifyOtp', { otpExist: false, message: 'Please enter the otp'});
    }
    // otp should be entered before 1 mint
    if(user.otpExpiry < new Date()){
        return res.render('verifyOtp', {otpExist: false, message: 'OTP Expired'});
    }
    if(otp != user.otp) {
        return res.render('verifyOtp', {otpExist: false, message: 'Invalid otp'});
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.redirect(`/resetPassword?email=${email}`);
})

// RESET PASSWORD

const resetPassword = expressAsyncHandler ( async (req, res) => {
   // const { email } = req.query; 
    
    const { email, password, confirmPassword } = req.body;
    
    // console.log('Restpassword = ', email);
    const errors = [];

    
    if (!password) errors.push({ msg: 'Enter the password', path: 'password' });
    if (!confirmPassword) errors.push({ msg: 'Confirm the password', path: 'confirmPassword' });
    if (password && confirmPassword && password !== confirmPassword) {
    errors.push({ msg: 'Passwords do not match', path: 'confirmPassword' });
    }

    if (errors.length) {
        return res.render('resetPassword', { email, errors, message: null });
    }

    await User.findOneAndUpdate({ email }, { $set: {password: await bcrypt.hash(req.body.password, 10)} },{new : true});

    return res.redirect('/login');
})

module.exports =
{
    register,
    login,
    logoutUser,
    forgotPassword,
    verifyOtp,
    resetPassword
} 
const Nodemailer = require('nodemailer-otp');

const helper = new Nodemailer(process.env.EMAIL_USER, process.env.EMAIL_PASS);

// Creating and sending otp through email
async function sendOtpEmail(email){
    const otp = helper.generateOtp(4);

    await 

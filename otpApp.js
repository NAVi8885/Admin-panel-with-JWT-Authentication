const expressAsyncHandler = require('express-async-handler');
const NodemailerHelper = require('nodemailer-otp');

const helper = new NodemailerHelper(process.env.EMAIL_ID, process.env.EMAIL_PASS);

// Creating and sending otp through email
async function sendOtpEmail(email){
    const otp = helper.generateOtp(4);

    await helper.sendEmail(
        email,
        'OTP  verification',
        "verify your account using this otp ",
        otp
    );
    console.log("Otp created and sent:", otp);
    return otp;
}

module.exports = {sendOtpEmail};
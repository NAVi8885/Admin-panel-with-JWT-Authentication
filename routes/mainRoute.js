const express = require("express");
const { register, login, forgotPassword, logoutUser, verifyOtp, resetPassword } = require("../controllers/userController");
const { validateUser, loginValidator, otpValidator } = require("../middleware/userValidator");
const verifyToken = require("../middleware/auth");
const { adminLogin, displayUser, addUser, updateUser, editUser, blockUser, deleteUser, logoutAdmin } = require("../controllers/adminController");
const verifyAdmin = require("../middleware/adminAuth");
const { validateAdmin } = require("../middleware/adminValidator");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main');
})

// REGISTER

router.get("/register",  (req, res) => {
    res.render('register', {errors: []})
})

router.post("/register", validateUser, register)

// LOGIN

router.get('/login', (req, res) => {
    res.render('login',{errors: []})
});

router.post('/login', loginValidator, login)

// DASHBOARD 

router.get('/dashboard', verifyToken, (req, res) => {
    if(!res.cookie || !req.cookies.token) return res.redirect('/login')
    res.render('dashboard', {user: req.session.user});
})

router.post('/logout', logoutUser)

// FORGOT PASSWORD

router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword',{userExist: true, message: null}) 
})

router.post('/forgotPassword', forgotPassword)

// VERIFY OTP

router.get('/verifyOtp', (req, res) => {
    const { email } = req.query;
    res.render('verifyOtp', { email });
})

router.post('/verifyOtp', otpValidator,  verifyOtp)

// RESET PASSWORD

router.get('/resetPassword', (req, res) => {
    const { email } = req.query;
    res.render('resetPassword', { email })
})

router.post('/resetPassword', resetPassword)


////// ADMIN ROUTES \\\\\\

// ADMIN LOGIN

router.get('/admin', (req, res) => {
    res.render('adminLogin'),{}
})

router.post('/adminLogin', validateAdmin, adminLogin);

router.get('/adminDash',verifyAdmin, displayUser);

////// ADMIN CONTROLS \\\\\\

// ADD

router.get('/admin/user/add', (req, res) => {
    res.render('adminUserForm', {userExist: true, pswd: true, message:null})
});

router.post('/admin/user/add', validateAdmin, addUser);

// EDIT
router.post('/admin/user/edit/:id',validateAdmin, updateUser);

router.get('/admin/user/edit/:id', editUser);

// BLOCK

router.get('/admin/user/block/:id', blockUser);
router.get('/admin/user/delete/:id', deleteUser);


router.post('/logoutadmin', logoutAdmin);


module.exports = router;
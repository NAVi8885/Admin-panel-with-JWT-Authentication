const express = require("express");
const { register, login, forgotPassword } = require("../controllers/userController");
const { validateUser, loginValidator } = require("../middleware/userValidator");
const verifyToken = require("../middleware/auth");
const router = express.Router();


router.get('/', (req, res) => {
    res.render('main');
})

router.get("/register",  (req, res) => {
    res.render('register', {errors: []})
})

router.post("/register",validateUser,register)

router.get('/login', (req, res) => {
    res.render('login',{errors: []})
});

router.post('/login',loginValidator,login)

router.get('/dashboard',verifyToken, (req, res) => {
    res.render('dashboard', {user: req.user.name});
})

router.post('/forgotPassword',forgotPassword)

router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword',{}) 
})



module.exports = router 
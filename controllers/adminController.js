const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { otpSender } = require('../otpApp')
const expressAsyncHandler = require('express-async-handler')
const User = require('../models/user')

// ADMIN LOGIN

const adminLogin = expressAsyncHandler(async (req, res) => {
   const { email, password } = req.body;

   const admin = await Admin.findOne({ email });
   if (!admin) {
      return res.render('adminLogin', { errors: [{ msg: 'Admin not found', path: 'email' }] });
   }

   const isPassword = await bcrypt.compare(password, admin.password);
   if (!isPassword) {
      return res.render('adminLogin', { errors: [{ msg: 'Password incorrect', path: 'password' }] });
   }

   const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
   );

   res.cookie('adminToken', token, { maxAge: 24 * 60 * 60 * 1000 });
   req.session.admin = admin;

   return res.redirect('/admindashboard');
});

// USER LIST

const displayUser = expressAsyncHandler(async (req, res) => {
   const users = await User.find().sort({ createdAt: -1 });
   return res.render('adminDash', { users, errors: [] });
});

// ADD USER

const addUser = expressAsyncHandler(async (req, res) => {
   const { name, email, password, confirmPassword } = req.body;

   const existing = await User.findOne({ email });
   if (existing) {
      return res.render('addUser', { errors: [{ msg: 'Email already exists', path: 'email' }] });
   }

   if (password !== confirmPassword) {
      return res.render('addUser', { errors: [{ msg: 'Password does not match', path: 'password' }] });
   }

   const hashedPass = await bcrypt.hash(password, 10);
   await User.create({ name, email, password: hashedPass, isBlocked: false });

   return res.redirect('/admin/users');
});

// EDIT USER 

const editUser = expressAsyncHandler(async (req, res) => {
   const { id } = req.params;
   const user = await User.findById(id);

   return res.render('adminUpdateForm', { user, errors: [] });
});

// UPDATE USER 

const updateUser = expressAsyncHandler(async (req, res) => {
   const { id } = req.params;
   const { name, email, password, confirmPassword } = req.body;

   const update = { name, email };

   if (password || confirmPassword) {
      if (password !== confirmPassword) {
         const user = await User.findById(id);
         return res.render('editUser', { user, errors: [{ msg: 'Password does not match', path: 'password' }] });
      }
      update.password = await bcrypt.hash(password, 10);
  }

   await User.findByIdAndUpdate(id, update);
   return res.redirect('/admin/users');
});

// BLOCK OR UNBLOCK USER 

const blockUser = expressAsyncHandler(async (req, res) => {
   const { id } = req.params;
   const user = await User.findById(id);

   if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
   }

   return res.redirect('/admin/users');
});

// DELETE USER

const deleteUser = expressAsyncHandler(async (req, res) => {
   const { id } = req.params;
   await User.deleteOne({ _id: id });
   return res.redirect('/admin/users');
});

// LOG OUT ADMIN

const logoutAdmin = expressAsyncHandler(async (req, res) => {
   res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
   req.session.admin = null;
   return res.redirect('/admin/login');
});

module.exports = {
  adminLogin,
  displayUser,
  addUser,
  editUser,
  updateUser,
  blockUser,
  deleteUser,
  logoutAdmin,
};
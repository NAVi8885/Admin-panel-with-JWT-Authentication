const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');

// ADMIN LOGIN

const adminLogin = expressAsyncHandler(async (req, res) => {
   const { name, password } = req.body;

   const admin = await Admin.findOne({ name });
    
   if ( !admin ) {
      return res.render('adminLogin', { pswd: true, userExist: false, message: 'Admin not found' });
   }

   if ( password !== admin.password ) {
      return res.render('adminLogin', { pswd: false, userExist: true, message: 'Password incorrect' });
   }

   const token = await jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
   );
   res.cookie('adminToken', token, { maxAge: 24 * 60 * 60 * 1000 });
   return res.redirect('/admindashboard');
});

// USER LIST

const displayUser = expressAsyncHandler(async (req, res) => {
  
   const users = await User.find().sort({ createdAt: -1 });
   return res.render('adminDash', { users, errors: [] });
});

// ADD USER

const addUser = expressAsyncHandler(async (req, res) => {
   const { name, email, password} = req.body;

   const existing = await User.findOne({ email });

   if(!name || !email || !password) {
      return res.render('adminUserForm', { userExist: true, pswd: true, message: 'All fields are required' });
   }

   if(existing) {
      return res.render('adminUserForm', { userExist: false, pswd: true, message: 'Email already exists' });
   }

   const hashedPass = await bcrypt.hash(password, 10);
   await User.create({ name, email, password: hashedPass, isBlocked: false });

   return res.redirect('/admindashboard');
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
   const { name, email, password} = req.body;

   if(!name || !email) {
      const user = await User.findById(id);
   return res.render('adminUpdateForm', { user, errors: [{ msg: 'Name and email are required' }] 
   });
}


      if(password) {
         const salt = bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, parseInt(salt));

         await User.findByIdAndUpdate(id, {name,  email, password: hashedPassword})
      }
      res.redirect('/admindashboard');
})

// BLOCK OR UNBLOCK USER 

const blockUser = expressAsyncHandler(async (req, res) => {
   const { id } = req.params;
   const user = await User.findById(id);

   if (user) {
      user.isBlock = !user.isBlock;
      console.log('blocked =', user.isBlock)
      await user.save();
   }

   return res.redirect('/admindashboard');
});

// DELETE USER

const deleteUser = expressAsyncHandler(async (req, res) => {
   const { id } = req.params;
   await User.deleteOne({ _id: id });
   return res.redirect('/admindashboard');
});

// LOG OUT ADMIN

const logoutAdmin = expressAsyncHandler(async (req, res) => {
   console.log("logoutAdmin - ")
   res.clearCookie('adminToken');
   req.session = null;
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
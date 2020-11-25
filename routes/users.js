const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const users = require("../users")


//Homepage
router.get('/',async(req,res) => {
  return res.render('users/homepage');
});



//create account page
router.get('/createAccount', async (req,res)=>{
     return res.render('users/createAccount')
});


router.post('/createAccount', async (req,res)=>{
      //Info that users input into here will be logged into the database
});



//login page
router.get('/login',async(req,res)=>{
      return res.render('users/login')
});

router.post('/login', async (req, res) => {
//this will check the database and login the user if that user is found

});


//logout route when users want to log out
router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/')
});

module.exports = router;

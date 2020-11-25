const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const users = require("../users")




//post on the forum
router.get('/post', async (req,res)=>{
	return res.render('users/post')
});



router.post('/post', async (req,res)=>{
	//This will upload to website database and update the homepage of what users can see.
});


//update Journal page
router.get('/logfish', async (req,res)=>{
	return res.render('users/logfish')
});

router.post('/logfish', async (req,res)=>{
	//This will update a users journal
});





module.exports = router;

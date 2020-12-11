const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');
//const sessionData = require(__dirname+"/../data/sessions");

const data = require('../data');

const sessionData = data.sessions;
const tideData = data.tides;
const fishData = data.fishTypes;
const userData = data.users;
const postData = data.posts;
const commentData = data.comments;


//Homepage
router.get('/', async (req,res) => {
  if(req.session.error){
  res.status(401).render('users/index',{error: req.session.error }); 
  delete req.session.error;
  return;
  } 
  return res.render('users/index');
});



router.post('/createAccount', async (req,res)=>{
  try{
      if(req.body.password != req.body.repass) throw "Passwords do not match"
     // hashed = await bcrypt.hash(req.body.password, 12);
      const newUser = await userData.register(req.body.username, req.body.password, req.body.repass)

      req.session.user = {  id: newUser._id, username: req.body.username };
      return res.redirect("/dashboard")
    }catch(e){
    res.status(401).render('users/index',{error: e });
    }
});


router.post('/login', async (req, res) => {
	try{

    const login = await userData.login(req.body.username,req.body.password)


    if(!login)throw "username or password is incorrect"
    const user = await userData.getUserByName(req.body.username)


    req.session.user = {  id: user._id, username: user.username};
    return res.redirect("/dashboard")
    }catch(e){
        res.status(401).render('users/index',{error: e });
    }

});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/')
});

router.get('/mysessions', async (req, res) => {
  const sessions = await sessionData.getForUser(req.session.userId);
  res.status(200).render('users/sessions', {sessions});
});

router.get('/sessions', async (req, res) => {
  const sessions = await sessionData.getAll();
  res.status(200).render('sessions', {sessions})
});

module.exports = router;

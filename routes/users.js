const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sessionData = require(__dirname+"/../data/sessions");
//const users = require("../database")

async function findUser(username) {
  // for(x in users){
  //     if (users[x]["username"].toLowerCase() == username.toLowerCase()){
  //       return users[x]
  //     }
  // }

  return 0;
}


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
      hashed = await bcrypt.hash(req.body.password, 12);
      //log account into database


      //Temporary user info for session
      req.session.user = {  id: 1, username: req.body.username };
      return res.redirect("/dashboard")
    }catch(e){
    res.status(401).render('users/index',{error: e });
    }
});


router.post('/login', async (req, res) => {
	try{

  let foundUser = await findUser(req.body.username)
  if(foundUser == 0)throw "Username or password is incorrect";
  let match = await bcrypt.compare(req.body.password, foundUser['hashedPassword'])
 
  if(match){
    req.session.user = {  id: foundUser["_id"], username: foundUser["username"]};
    return res.redirect("/dashboard")
  }

  else throw "Username or password is incorrect";

    }catch(e){
        res.status(401).render('users/index',{error: "Username or password is incorrect" });
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

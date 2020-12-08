const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');
//const users = require("../database")


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

module.exports = router;

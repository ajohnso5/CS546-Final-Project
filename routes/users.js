const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');
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
      console.log(req.body.username)
      console.log(req.body.password)
      console.log(req.body.repass)
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

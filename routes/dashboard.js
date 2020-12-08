const express = require('express');
const router = express.Router();

router.get('/', async(req,res) =>{
	return res.render("users/dashboard")
});


router.get('/journal', async(req,res) =>{
	return res.render("users/journal")

});


router.get('/data', async(req,res) =>{
	return res.render("users/data")

})

router.get('/findfish', async(req,res) =>{
	return res.render("users/dashboard")

})

router.get('/log', async(req,res) =>{
	return res.render("users/log")

})

router.get('/forum', async(req,res) =>{
	return res.render("users/forum")

})

//This will add all data to the forum posts database
router.post('/forum', async(req,res) =>{
	console.log(req.body)
})


module.exports = router;
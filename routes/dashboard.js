const express = require('express');
const router = express.Router();
const postData = require(__dirname+"/../data/posts");
const commentData = require(__dirname+"/../data/comments");

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
	const posts = await postData.getAll();
	for (let i=0; i<posts.length; i++) {
		posts[i].comments = commentData.getCommentsForPostId(posts[i].id);
	}
	return res.render("users/forum", {posts});
})

module.exports = router;
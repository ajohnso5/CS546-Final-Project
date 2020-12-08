const express = require('express');
const router = express.Router();
const commentData = require(__dirname+"/../data/comments");
const sessionData = require(__dirname+"/../data/session");
const postData = require(__dirname+"/../data/posts");
const multer = require('multer');
const upload = multer({dest: '/public/images/'});

// Use client-side js to dynamically load posted content after post

//post on the forum
router.get('/post', async (req,res)=>{
	return res.render('users/post')
});



router.post('/post', upload.single('postImage'), async (req,res)=>{
	//This will upload to website database and update the homepage of what users can see.
	const userId = req.session.userId;
	const postImage = req.file;
	const {postTitle, postBody} = req.body;
	const createdPost = await postData.create(postTitle, userId, postBody, postImage);
	res.status(200).json({post: createdPost});
});


router.get('/session', async (req,res)=>{
	return res.render('users/session')
});

router.post('/session', async (req,res)=>{
	//This will upload to website database and update the homepage of what users can see.
	const userId = req.session.userId;
	const {isPublic, lat, long, dateTime, note, durationHours, lures, fishTypeId, avgLength, avgWeight, maxLength, maxWeight, notableCatches, quantity, tideId} = req.body;
	const createdSession = await sessionData.create(uesrId, isPublic, lat, long, dateTime, note, durationHours, lures, fishTypeId, avgLength, avgWeight, maxLength, maxWeight, notableCatches, quantity, tideId);
	res.status(200).json({session: createdSession});
});


router.post('/comment', async (req,res)=>{
	//This will upload to website database and update the homepage of what users can see.
	const userId = req.session.userId;
	const {postId, body} = req.body;
	const createdComment = await commentData.create(postId, userId, body);
	res.status(200).json({comment: createdComment});
});


//update Journal page
router.get('/logfish', async (req,res)=>{
	return res.render('users/logfish')
});

router.post('/logfish', async (req,res)=>{
	//This will update a users journal
});





module.exports = router;

const express = require("express");
const session = require("express-session");
const router = express.Router();
const commentData = require(__dirname + "/../data/comments");
const sessionData = require(__dirname + "/../data/sessions");
const postData = require(__dirname + "/../data/posts");
const multer = require("multer");
const upload = multer({ dest: "../public/images/" });

// Use client-side js to dynamically load posted content after post

//post on the forum
// router.get('/post', async (req,res)=>{
// 	return res.render('users/forum')
// });

// router.post('/post', upload.single('postImage'), async (req,res)=>{
// 	//This will upload to website database and update the homepage of what users can see.
// 	const userId = req.session.userId;
// 	const postImage = req.file;
// 	const {postTitle, postBody} = req.body;
// 	const createdPost = await postData.create(postTitle, userId, postBody, postImage);
// 	res.status(200).json({post: createdPost});
// });

router.get("/session", async (req, res) => {
  return res.render("users/session");
});

router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const removal = await sessionData.remove(id);
  return res.status(200).redirect("../../dashboard/journal");
});

router.post("/session", async (req, res) => {
  //This will upload to website database and update the homepage of what users can see.
  const userId = req.session.user.userId;
  const {
    isPublic,
    loc,
    date,
    note,
    durationHours,
    lures,
    fishTypeId,
    avgLength,
    avgWeight,
    maxLength,
    maxWeight,
    notableCatches,
    quantity,
    tide,
    waveheight,
  } = req.body;
  const createdSession = await sessionData.create(
    userId,
    isPublic,
    loc,
    date,
    note,
    durationHours,
    lures,
    fishTypeId,
    avgLength,
    avgWeight,
    maxLength,
    maxWeight,
    notableCatches,
    quantity,
    tide,
    waveheight
  );
  if (createdSession == "[object Object]")
    return res
      .status(200)
      .render("users/log", { session: createdSession, created: true });
  return res
    .status(500)
    .render("users/log", { session: createdSession, error: createdSession });
});

router.post("/comment", async (req, res) => {
  //This will upload to website database and update the homepage of what users can see.
  const userId = req.session.userId;
  const { postId, body } = req.body;
  const createdComment = await commentData.create(postId, userId, body);
  res.status(200).json({ comment: createdComment });
});

module.exports = router;

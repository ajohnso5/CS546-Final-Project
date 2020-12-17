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
  try{
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
  if(!loc.replace(/\s/g, '').length) throw "Town and State can not be empty"
  if(!date.replace(/\s/g, '').length) throw "Date can not be empty"
  if(!durationHours.replace(/\s/g, '').length) throw "Hours Spent can not be empty"
  if(!waveheight.replace(/\s/g, '').length) throw "Wave height can not be empty"
  if(!fishTypeId.replace(/\s/g, '').length) throw "Fish type can not be empty"
  if(!lures.replace(/\s/g, '').length) throw "Lures can not be empty"
  if(!quantity.replace(/\s/g, '').length) throw "Quantity can not be empty"
  if(!avgLength.replace(/\s/g, '').length) throw "avgLength can not be empty"
  if(!maxLength.replace(/\s/g, '').length) throw "Longest catch can not be empty"
  if(!avgWeight.replace(/\s/g, '').length) throw "Average weight can not be empty"
  if(!maxWeight.replace(/\s/g, '').length) throw "Max weight can not be empty"
  if(!notableCatches.replace(/\s/g, '').length) throw "Notable catches can not be empty"
  if(!note.replace(/\s/g, '').length) throw "Notes can not be empty"
    
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
  }catch(e){
    return res.status(500).render("users/log", { error: e });
  }
});

router.post("/comment", async (req, res) => {
  //This will upload to website database and update the homepage of what users can see.
  try{
  const userId = req.session.user.userId;
  const { postId, body } = req.body;
  if(!body.replace(/\s/g, '').length) throw "Must enter comment"
  const createdComment = await commentData.create(postId, userId, body);
  res.status(200).json({ comment: createdComment });
  }catch(e){
    return res.render("users/forum", { error: e });
  }
});

router.post("/add/like", async (req, res) => {
  await postData.addLike(req.body.postId, req.session.user.userId);
  res.status(200).json({ message: "Added like successfully" });
});


router.post("/add/dislike", async (req, res) => {
  await postData.addDislike(req.body.postId, req.session.user.userId);
  res.status(200).json({ message: "Added dislike successfully" });
});

router.post("/add/report", async (req, res) => {
  await postData.addReport(req.body.postId, req.session.user.userId);
  res.status(200).json({ message: "Added report successfully" });
});


router.post("/remove/like", async (req, res) => {
  await postData.removeLike(req.body.postId, req.session.user.userId);
  res.status(200).json({ message: "Removed like successfully" });
});


router.post("/remove/dislike", async (req, res) => {
  await postData.removeDislike(req.body.postId, req.session.user.userId);
  res.status(200).json({ message: "Removed dislike successfully" });
});

router.post("/remove/report", async (req, res) => {
  await postData.removeReport(req.body.postId, req.session.user.userId);
  res.status(200).json({ message: "Removed report successfully" });
});

router.get("/comments/:id", async (req, res) => {
  const postId = req.params.id;
  const foundComments = await commentData.getCommentsForPostId(postId, req.session.user.userId);
  res.status(200).json({comments: foundComments});
});

router.post("/addComment/like", async (req, res) => {
  await commentData.addLike(req.body.commentId, req.session.user.userId);
  res.status(200).json({ message: "Added like successfully" });
});


router.post("/addComment/dislike", async (req, res) => {
  await commentData.addDislike(req.body.commentId, req.session.user.userId);
  res.status(200).json({ message: "Added dislike successfully" });
});

router.post("/addComment/report", async (req, res) => {
  await commentData.addReport(req.body.commentId, req.session.user.userId);
  res.status(200).json({ message: "Added report successfully" });
});


router.post("/removeComment/like", async (req, res) => {
  await commentData.removeLike(req.body.commentId, req.session.user.userId);
  res.status(200).json({ message: "Removed like successfully" });
});


router.post("/removeComment/dislike", async (req, res) => {
  await commentData.removeDislike(req.body.commentId, req.session.user.userId);
  res.status(200).json({ message: "Removed dislike successfully" });
});

router.post("/removeComment/report", async (req, res) => {
  await commentData.removeReport(req.body.commentId, req.session.user.userId);
  res.status(200).json({ message: "Removed report successfully" });
});

router.delete("/comment/:id", async (req, res) => {
  await commentData.removeUsersComment(req.params.id, req.session.user.userId);
  res.status(200).json({ message: "Deleted successfully" });
});

module.exports = router;

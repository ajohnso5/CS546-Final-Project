const express = require("express");
const router = express.Router();

const data = require("../data");
const sessionData = require("../data/sessions");
const tideData = data.tides;
const fishData = data.fishTypes;
const userData = require("../data/users");
//const postData = data.posts;
const postData = require("../data/posts");

const commentData = data.comments;
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  return res.render("users/dashboard");
});

router.get("/journal", async (req, res) => {
  const d = await sessionData.getForUser(req.session.user.userId);
  console.log(d);
  return res.render("users/journal", { sessions: d.reverse() });
});

// get all the posts for forum
router.get("/posts", async (req, res) => {
	const posts = await postData.getAllNonLazy();
	return res.status(200).json(posts);
});


router.get("/findfish", async (req, res) => {
  return res.render("users/dashboard");
});

router.get("/log", async (req, res) => {
  return res.render("users/log");
});

router.get("/forum", async (req, res) => {
  return res.render("users/forum");
});

router.post("/forum", async (req, res) => {
  //this creates the post and adds it to the post collection
  const {title, caption} = req.body;
  const post = await postData.create(
    title,
    req.session.user.userId,
    caption,
    null
  );

  //this gets the current username of the person who postes
  const user = await userData.getById(req.session.user.userId);
  return res.json({ username: user.username, post }); // returns object of data
});

router.post("/posts", async (req, res) => {
  //this gets all posts in the database
  const posts = await postData.getAll();

  //this loop gets all names in the database for each user
  arrayNames = [];
  for (let x in posts) {
    let user = await userData.getById(posts[x].userId);
    arrayNames.push(user.username);
  }

  return res.json({ usernames: arrayNames, allPosts: posts }); //returns object of data
});

router.post("/allcomments", async (req, res) => {
  const post = await postData.getById(req.body.postId);
  const commentArray = post.commentsArray;
  dataArray = [];

  for (let x in commentArray) {
    let data = {};
    const oneComment = await commentData.getById(commentArray[x]);
    const user = await userData.getById(oneComment.userId);
    data.username = user.username;
    data.comment = oneComment.body;
    dataArray.push(data);
  }
  //returns list of data including the name and post
  return res.json(dataArray);
});

router.post("/comments", async (req, res) => {
  //this creates the comment and adds it to the comment collection
  const comment = await commentData.create(
    req.body.postId,
    req.session.user.id,
    req.body.comment
  );

  //gets username of the comment
  const user = await userData.getById(req.session.user.id);
  return res.json({ username: user.username, commentInfo: comment }); //returns object of data
});

module.exports = router;

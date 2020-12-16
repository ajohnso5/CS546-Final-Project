const express = require("express");
const router = express.Router();

const data = require("../data");
const sessionData = require("../data/sessions");
const userData = require("../data/users");
const postData = require("../data/posts");

const commentData = data.comments;
const { ObjectId } = require("mongodb");
const session = require("express-session");
const xss = require('xss');

router.get("/", async (req, res) => {
  return res.render("users/dashboard");
});

router.get("/journal", async (req, res) => {
  const d = await sessionData.getForUser(req.session.user.userId);
  const u = await userData.getById(req.session.user.userId);
  const username = u.username;
  return res.render("users/journal", { sessions: d.reverse(), name: username });
});

router.get("/journal/:id", async (req, res) => {
  const id = req.params.id;
  let checkForPub = true;
  if (req.session.user.userId == id) {
    checkForPub = false;
  }
  const d = await sessionData.getForUser(id);
  const u = await userData.getById(id);
  const username = u.username;
  const newd = [];
  d.forEach(function (item) {
    if (item.isPublic == true) newd.push(item);
  });
  if (checkForPub)
    return res.render("users/journal", {
      sessions: newd.reverse(),
      name: username,
    });
  else
    return res.render("users/journal", {
      sessions: d.reverse(),
      name: username,
    });
});

// get all the posts for forum
router.get("/posts", async (req, res) => {
  const posts = await postData.getAllNonLazy();
  return res.status(200).json(posts);
});

router.get("/findfish", async (req, res) => {
  return res.render("users/dashboard");
});

router.post("/findfish", async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const {
      temp,
      windspeed,
      weatherCondition,
      tide,
      waveHeight,
      targetFish,
    } = req.body;
    const sessions = await sessionData.getForUser(userId);
    let bestSession = {};
    let highestScore = -1;
    sessions.forEach(function (x) {
      let score = 0;
      if (x.water_conditions.tide.toUpperCase() == tide.toUpperCase()) score = score + 5;
      if (x.fish.fishTypeId.toUpperCase().includes(targetFish.toUpperCase())) score = score + 10;
      if (x.weather.condition.toUpperCase() == weatherCondition.toUpperCase()) score = score + 2;
      if ((Math.abs(x.weather.wind_speed - windspeed) < 8)) score = score + 3;
      if ((Math.abs(x.water_conditions.waveheight - waveHeight) < 3)) score = score + 2;
      if (score > highestScore) {
        highestScore = score;
        bestSession = x;
      }
      score = 0;
    });
    return res.render("users/dashboard", { session: bestSession });
  } catch (e) {
    return res.render("users/dashboard", { error: e });
  }
});

router.get("/log", async (req, res) => {
  return res.render("users/log");
});

router.get("/forum", async (req, res) => {
  return res.render("users/forum");
});

router.post("/forum", async (req, res) => {
  //this creates the post and adds it to the post collection
  const { title, caption } = req.body;
  const post = await postData.create(
    xss(title),
    xss(req.session.user.userId),
    xss(caption),
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

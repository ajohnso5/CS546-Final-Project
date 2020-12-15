const postData = require('./posts');
const userData = require('./users');
const fishData = require('./fishTypes');
const sessionData = require('./sessions');
const commentData = require('./comments');
const tideData = require('./tides');

module.exports = {
  users: userData,
  posts: postData,
  fishTypes: fishData,
  sessions: sessionData,
  comments: commentData,
  tides: tideData
};
const utils = require('./_utils');
const helper = require('./_helper');
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const posts = mongoCollections.posts;

async function create(postId, userId, body) {
    utils.checkParams(utils.checkStringIsObjectId, {postId, userId});
    utils.checkParams(utils.checkString, {body});
    utils.checkExist(users, {_id: utils.toObjectId(userId)}, "User");
    utils.checkExist(posts, {_id: utils.toObjectId(postId)}, "Post");
    const comment = await helper.create(comments, {postId, userId, body}, "Comment")
    const postsCollection = await posts();
    const updated = await postsCollection.updateOne({_id: utils.toObjectId(postId)},{$addToSet:{commentsArray: comment._id}})
    return comment;
}

async function remove(id) {
    return await helper.remove(comments, id, "Comment");
}

async function getById(id) {
    return await helper.getById(comments, id, "Comment");
}

async function getAll() {
    return await helper.getAll(comments);
}

async function getCommentsForPostId(postId) {
    const post = await helper.getById(posts, postId, "Post");
    const commentCollection = await comments();
    const comments = await commentCollection.findMany({postId: post._id});
    return utils.stringifyObject(comments)
}

async function update(id, model) {
    await getById(id);
    if (model == null || Object.keys(model).length === 0) throw "No fields to update";
    const updates = {};
    if (model.body != null) {
        utils.checkParams(utils.checkString, {body: model.body});
        updates.body = model.body;
    }
    if (model.userId != null) {
        utils.checkParams(utils.checkStringIsObjectId, {userId: model.userId});
        updates.userId = model.userId;
    }
    if (model.postId != null) {
        utils.checkParams(utils.checkStringIsObjectId, {postId: model.postId});
        updates.postId = model.postId;
    }
    return await helper.update(comments, id, updates, "Comment");
}

module.exports = {
    create,
    remove, 
    getById,
    getAll,
    update,
    getCommentsForPostId
}
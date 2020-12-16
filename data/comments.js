const utils = require('./_utils');
const helper = require('./_helper');
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const posts = mongoCollections.posts;
const userData = require("./users");

async function create(postId, userId, body) {
    utils.checkParams(utils.checkStringIsObjectId, {postId, userId});
    utils.checkParams(utils.checkString, {body});
    utils.checkExist(users, {_id: utils.toObjectId(userId)}, "User");
    utils.checkExist(posts, {_id: utils.toObjectId(postId)}, "Post");
    const newComment = {
        postId: postId,
        userId: userId,
        body: body
    }
    const comment = await helper.create(comments, newComment, "Comment");
    const postsCollection = await posts();
    const updated = await postsCollection.updateOne({_id: utils.toObjectId(postId)},{$addToSet:{commentsArray: comment._id}});
    return comment;
}

async function remove(id) {
    return await helper.remove(comments, id, "Comment");
}

async function getById(id) {
    return await helper.getById(comments, id, "Comment");
}

async function getAll() {
    const allComments = await helper.getAll(comments);
    return utils.sortByDate(allComments);
}

async function getCommentsForPostId(postId, curUserId) {
    const post = await helper.getById(posts, postId, "Post");
    const commentCollection = await comments();
    const foundComments = await commentCollection.find({postId: postId}).toArray();
    for (let i=0; i<foundComments.length; i++) {
        foundComments[i].user = await userData.getById(foundComments[i].userId);
        foundComments[i].currentUser = curUserId == foundComments[i].userId;
    }
    return utils.sortByDate(foundComments);
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



async function addAction(id, obj) {
    console.log("Add", obj);
    const commentCollection = await comments();
    await commentCollection.updateOne({_id: utils.toObjectId(id)}, {$addToSet: obj});
}

async function removeAction(id, obj) {
    console.log("Remove", obj);
    const commentCollection = await comments();
    await commentCollection.updateOne({_id: utils.toObjectId(id)}, {$pull: obj});
}


async function addLike(id, userId) {
    utils.checkParams(utils.checkStringIsObjectId, {id, userId});
    await Promise.all([addAction(id, {likes: userId}), removeAction(id, {dislikes: userId})]);
}

async function addDislike(id, userId) {
    utils.checkParams(utils.checkStringIsObjectId, {id, userId});
    await Promise.all([addAction(id, {dislikes: userId}), removeAction(id, {likes: userId})]);
}

async function addReport(id, userId) {
    utils.checkParams(utils.checkStringIsObjectId, {id, userId});
    await addAction(id, {reports: userId});
}

async function removeLike(id, userId) {
    utils.checkParams(utils.checkStringIsObjectId, {id, userId});
    await removeAction(id, {likes: userId});
}

async function removeDislike(id, userId) {
    utils.checkParams(utils.checkStringIsObjectId, {id, userId});
    await removeAction(id, {dislikes: userId});
}

async function removeReport(id, userId) {
    utils.checkParams(utils.checkStringIsObjectId, {id, userId});
    await removeAction(id, {reports: userId});
}

async function removeUsersComment(id, userId) {
    utils.checkParams(utils.checkStringIsObjectId, {id, userId});
    const comment = await getById(id);
    if (comment.userId.toString() !== userId) throw "User does not have permission to delete this comment";
    await remove(id);
}


module.exports = {
    create,
    remove, 
    getById,
    getAll,
    update,
    getCommentsForPostId,
    addLike,
    addDislike,
    addReport,
    removeLike,
    removeDislike,
    removeReport,
    removeUsersComment
}
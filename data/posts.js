const utils = require('./_utils');
const helper = require('./_helper');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const posts = mongoCollections.posts;
const commentData = require("./comments");
const userData = require("./users");
const fs = require("fs");


async function create(title, userId, body) {
    await utils.checkParams(utils.checkStringIsObjectId, {userId});
    await utils.checkParams(utils.checkString, {title, body});
    await utils.checkExist(users, {_id: utils.toObjectId(userId)}, "User");

    // const imageFile = `/public/images/${title}_${userId}_${Date.now()}`;
    // fs.writeFileSync(imagePath, imageFile);
    commentsArray = []
    const newPost = {
        title: title,
        userId: userId,
        body: body,
        imagePath: imagePath,
        commentsArray: commentsArray
    }


    const myPost = await helper.create(posts, newPost, "Post");
    const usersCollection = await users();
    usersCollection.updateOne({_id: utils.toObjectId(userId)},{$addToSet:{postsArray: myPost._id}})
    return myPost;

}

async function remove(id) {
    return await helper.remove(posts, id, "Post");
}

async function getById(id) {
    return await helper.getById(posts, id, "Post");
}

async function getAll() {
    allPosts = await helper.getAll(posts);
    return utils.sortByDate(allPosts);
}

async function getAllNonLazy() {
    const allPosts = await helper.getAll(posts);
    if(allPosts.length == 0) return allPosts;
    for (let i=0; i<allPosts.length; i++) {
        const userId = allPosts[i].userId;
        if(userId == null) continue;
        allPosts[i].user = await userData.getById(userId);
        allPosts[i].comments = await commentData.getCommentsForPostId(allPosts[i]._id.toString());
    }
    return allPosts.reverse();
}


async function update(id, model) {
    await getById(id);
    if (model == null || Object.keys(model).length === 0) throw "No fields to update";
    const updates = {};
    if (model.body != null) {
        utils.checkParams(utils.checkString, {body: model.body});
        updates.body = model.body;
    }
    if (model.title != null) {
        utils.checkParams(utils.checkStringIsObjectId, {title: model.title});
        updates.title = model.title;
    }
    return await helper.update(posts, id, updates, "Post");
}

async function addAction(id, obj) {
    const postCollection = await posts();
    await postCollection.updateOne({_id: utils.toObjectId(id)}, {$addToSet: obj});
}

async function removeAction(id, obj) {
    const postCollection = await posts();
    await postCollection.updateOne({_id: utils.toObjectId(id)}, {$pull: obj});
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


module.exports = {
    create,
    remove, 
    getById,
    getAll,
    update,
    getAllNonLazy,
    addLike,
    addDislike,
    addReport,
    removeLike,
    removeDislike,
    removeReport
}
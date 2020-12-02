const utils = require('./_utils');
const helper = require('./_helper');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const posts = mongoCollections.posts;
const fs = require("fs");


async function create(title, userId, body, imageFile) {
    utils.checkParams(utils.checkStringIsObjectId, {userId});
    utils.checkParams(utils.checkString, {title, body});
    utils.checkExist(users, {_id: utils.toObjectId(userId)}, "User");
    const imagePath = `/public/images/${title}_${userId}_${Date.now()}`;
    fs.writeFileSync(imagePath, imageFile);
    return await helper.create(posts, {title, userId, body, imagePath}, "Post");
}

async function remove(id) {
    return await helper.remove(posts, id, "Post");
}

async function getById(id) {
    return await helper.getById(posts, id, "Post");
}

async function getAll() {
    return await helper.getAll(posts);
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

model.exports = {
    create,
    remove, 
    getById,
    getAll,
    update
}
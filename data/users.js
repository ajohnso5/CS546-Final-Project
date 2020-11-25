const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/NotFoundError');
const utils = require('./_utils');
const mongoCollections = require('../config/mongoCollections');
const { get } = require('../../../Labs/10/routes/login');
const users = mongoCollections.users;




async function login(username, password) {
    const user = getUserByName(username);
    if (user == null) return NotFoundError("User not found for given username");
    return await bcrypt.compare(password, user.passwordHash);
}

async function register(username, password) {
    utils.checkParams(utils.checkString, {username, password});
    checkUserNameNotExist(username);
    checkPassword(password);
    const usersCollection = await users();
    const result = await usersCollection.insertOne({
        isAuthorized: false,
        username: username,
        passwordHash: await hashpw(password)
    });
    if (result.insertedCount === 0) throw "Could not register new user";
    return get(result.insertedId.toString())
}



async function create(username, password, isAuthorized) {
    utils.checkParams(utils.checkString, {username, password});
    utils.checkParams(utils.checkBool, {isAuthorized});
    checkUserNameNotExist(username);
    checkPassword(password);
    const usersCollection = await users();
    const result = await usersCollection.insertOne({
        isAuthorized: isAuthorized,
        username: username,
        passwordHash: await hashpw(password)
    });
    if (result.insertedCount === 0) throw "Could not register new user";
    return get(result.insertedId.toString())
}

async function remove(id) {
    utils.checkParams(utils.checkStringIsObjectId, {id});
    const usersCollection = await users();
    const result = await usersCollection.deleteOne({_id: utils.toObjectId(id)});
    if (result.deletedCount === 0) throw "Could not delete user";
    return id;
}

async function getById(id) {
    utils.checkParams(utils.checkStringIsObjectId, {id});
    const usersCollection = await users();
    const result = await usersCollection.findOne({_id: utils.toObjectId(id)});
    if (result == null) throw new NotFoundError("No user found for given id");
    return utils.stringifyObject(result);
}

async function getAll() {
    const usersCollection = await users();
    return await usersCollection.find({});
}

async function update(id, model) {
    await getById(id);
    if (model == null || Object.keys(model).length === 0) throw "No fields to update";
    const updates = {};
    if (model.isAuthorized != null) {
        utils.checkParams(utils.checkBool, {isAuthorized: model.isAuthorized});
        updates.isAuthorized = model.isAuthorized;
    }
    if (model.username != null) {
        utils.checkParams(utils.checkString, {username: model.username});
        updates.username = model.username;
    }
    if (model.password != null) {
        utils.checkParams(utils.checkString, {password: model.password});
        checkPassword(model.password);
        updates.passwordHash = await hashpw(model.password);
    }
}




async function checkUserNameNotExist(username) {
    const user = getUserByName(username);
    if (user != null) throw "User already exists";
}

async function checkPassword(password) {
    const minLength = 8;
    if (password.length < minLength) throw `Password must be at least ${minLength} characters long`;
    if (!password.match(/.*[a-z].*/)) throw "Password must contain a lower-case letter";
    if (!password.match(/.*[A-Z].*/)) throw "Password must contain an upper-case letter";
    if (!password.match(/.*[0-9].*/)) throw "Password must contain a number";
}

async function getUserByName(username) {
    const usersCollection = await users();
    return await usersCollection.Find({username});
}

async function hashpw(password) {
    return await bcrypt.hash(password, bcrypt.genSalt(10))
}


module.exports = {
    login,
    register,
    create,
    remove,
    getById,
    getAll,
    update
}
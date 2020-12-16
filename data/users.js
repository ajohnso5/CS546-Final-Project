const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const utils = require('./_utils');
const mongoCollections = require('../config/mongoCollections');
const helper = require('./_helper');
const users = mongoCollections.users;




async function login(username, password) {
    const user = await getUserByName(username);
    if (user == null) throw ("User name or password is incorrect");
    return await bcrypt.compare(password, user.passwordHash);
}

async function register(username, password, repass) {
    utils.checkParams(utils.checkString, {username, password, repass});
    if (repass !== password) throw "Passwords do not match";
    await checkUserNameNotExist(username);
    await checkPassword(password);
    const usersCollection = await users();

    const result = await usersCollection.insertOne({
        isAuthorized: false,
        username: username,
        passwordHash: await hashpw(password),
        postsArray: [],
        sessionArray: []
    });
    // console.log(result);
    // console.log(utils.stringifyObject(result));

    if (result.insertedCount === 0) throw "Could not register new user";
    // console.log(result.insertedId);
    // const test = await getById(result.insertedId);
    // console.log(JSON.stringify(test));
    return await getById(result.insertedId);
}



async function create(username, password, isAuthorized) {
    utils.checkParams(utils.checkString, {username, password});
    utils.checkParams(utils.checkBool, {isAuthorized});
    await checkUserNameNotExist(username);
    await checkPassword(password);
    const pwHash = await hashpw(password);
    return await helper.create(users, {isAuthorized, username, password: pwHash}, "User");
}

async function remove(id) {
    return await helper.remove(users, id, "User");
}

async function getById(id) {
    return await helper.getById(users, id, "User");
}

// lecture code that when swapped in that makes getById() not return null
// async function getUserById(id) {
//     const userCollection = await users();
//     const user = await userCollection.findOne({ _id: id });
//     if (!user) throw 'User not found';
//     return user;
//   }

async function getAll() {
    return await helper.getAll(users);
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
    return await helper.update(users, id, updates, "User");
}




async function checkUserNameNotExist(username) {
    const user = await getUserByName(username);
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
    return await usersCollection.findOne({username: username});
}

async function hashpw(password) {
    return await bcrypt.hash(password, 10)
}


module.exports = {
    login,
    register,
    create,
    remove,
    getById,
    getAll,
    update,
    getUserByName
}
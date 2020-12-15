const utils = require('./_utils');
const helper = require('./_helper');
const mongoCollections = require('../config/mongoCollections');
const fishTypes = mongoCollections.fishTypes;

async function create(name) {
    utils.checkParams(utils.checkString, {name});
    utils.checkNotExist(fishTypes, {name}, "FishType");
    return await helper.create(fishTypes, {name}, "FishType");
}

async function remove(id) {
    return await helper.remove(fishTypes, id, "FishType");
}

async function getById(id) {
    return await helper.getById(fishTypes, id, "FishType");
}

async function getAll() {
    return await helper.getAll(fishTypes);
}

async function update(id, model) {
    await getById(id);
    if (model == null || Object.keys(model).length === 0) throw "No fields to update";
    const updates = {};
    if (model.name != null) {
        utils.checkParams(utils.checkString, {name: model.name});
        updates.name = model.name;
    }
    return await helper.update(fishTypes, id, updates, "FishType");
}

module.exports = {
    create,
    remove, 
    getById,
    getAll,
    update
}
const utils = require('./_utils');
const mongoCollections = require('../config/mongoCollections');
const tides = mongoCollections.tides;
const helper = require('./_helper');

async function create(name) {
    utils.checkParams(utils.checkString, {name});
    utils.checkNotExist(tides, {name}, "Tide");
    return await helper.create(tides, {name}, "Tide");
}

async function remove(id) {
    return await helper.remove(tides, id, "Tide");
}

async function getById(id) {
    return await helper.getById(tides, id, "Tide");
}

async function getAll() {
    return await helper.getAll(tides);
}

async function update(id, model) {
    await getById(id);
    if (model == null || Object.keys(model).length === 0) throw "No fields to update";
    const updates = {};
    if (model.name != null) {
        utils.checkParams(utils.checkString, {name: model.name});
        updates.name = model.name;
    }
    return await helper.update(tides, id, updates, "Tide");
}

module.exports = {
    create,
    remove, 
    getById,
    getAll,
    update
}
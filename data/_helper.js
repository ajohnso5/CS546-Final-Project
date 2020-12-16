const utils = require('./_utils');

// Schema:
// collection: collection function being passed into this general helper function
// newObj: object initialized in the outer function passed into helper function
// objName: name of instances in collection being added to
// Returns: newly added object
async function create(collection, newObj, objName) {
    const col = await collection();
    const result = await col.insertOne(newObj);
    if (result.insertedCount === 0) throw `Could not create new ${objName}`;
    return await getById(collection, result.insertedId, objName); 
}

async function remove(collection, id, objName) {
    utils.checkParams(utils.checkStringIsObjectId, {id});
    const col = await collection();
    const result = await col.deleteOne({_id: utils.toObjectId(id)});
    if (result.deletedCount === 0) throw `Could not delete ${objName}`;
    return id;
}

async function getById(collection, id, objName) {
    utils.checkParams(utils.checkStringIsObjectId, {id});
    const col = await collection();
    const result = await col.findOne({_id: utils.toObjectId(id)});
    if (result == null) throw `No ${objName} found for given id`;
    return result;
}

// NOT CURRENTLY FUNCTIONAL
async function getAll(collection) {
    const col = await collection();
    return await col.find({}).toArray();
}

async function update(collection, id, params, objName) {
    utils.checkParams(utils.checkStringIsObjectId, {id});
    const col = await collection();
    const result = col.updateOne({_id: id}, {$set: params});
    if (result.modifiedCount === 0) throw `Could not updated ${objName}`;
    return await getById(collection, id, objName);
}



module.exports = {
    create,
    remove,
    getById,
    getAll,
    update,
}
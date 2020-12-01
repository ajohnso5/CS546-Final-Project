const { param } = require("../../../Labs/10/routes/login")
const { ObjectId } = require("mongodb");

function checkParams(fn, params) {
    const keys = Object.keys(params);
    for (let i=0; i<keys.length; i++) {
        const key = keys[i];
        fn(keys, params[keys]);
    }
}

function checkString(paramName, paramValue) {
    if (typeof paramValue != "string") throw `${paramName} is not a string`;
    if (paramValue == null || paramValue == "") throw `${paramName} cannot be empty`;
}

function checkBool(paramName, paramValue) {
    if (typeof paramValue != "boolean") throw `${paramName} is not a boolean`;
}

function checkStringIsObjectId(paramName, paramValue) {
    this.checkString(paramName, paramValue);
    if (!ObjectId.isValid(paramValue)) throw `${paramValue} is not a valid ObjectId`;
}




function toObjectId(stringId) {
    return ObjectId(stringId);
}

function stringifyObject(o) {
    if (o instanceof ObjectId) return o;
    else if (o instanceof Object) {
        const keys = Object.keys(o);
        for (let i=0; i<keys.length; i++) {
            const key = keys[i];
            o[key] = stringifyObject(o);
        }
    }
    return o;
}

async function checkNotExist(collection, params, objName) {
    const col = await collection();
    const result = await col.findOne({params});
    if (result != null) throw `${objName} already exists`;
}

async function checkExist(collection, params, objName) {
    const col = await collection();
    const result = await col.findOne({params});
    if (result == null) throw `${objName} does not exist`;
}


module.exports = {
    checkParams,
    checkString,
    checkBool,
    checkStringIsObjectId,
    toObjectId,
    stringifyObject,
    checkNotExist,
    checkExist
}
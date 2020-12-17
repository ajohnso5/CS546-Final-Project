const { ObjectId } = require("mongodb");

function getDate() {
    const current = new Date();
    const day = current.getDate();
    const month = current.getMonth() + 1;
    const year = current.getFullYear();
    const hour = current.getHours();
    const min = current.getMinutes();
    const sec = current.getSeconds();
    const ms = current.getMilliseconds();
    return `${year}-${month}-${day}::${hour}:${min}:${sec}:${ms}`;
}

function compareDates(a, b) {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
}

function sortByDate(array) {
    return array.sort(compareDates);
}


function checkParams(fn, params) {
    const keys = Object.keys(params);
    for (let i=0; i<keys.length; i++) {
        const key = keys[i];
        fn(keys[i], params[key]);
    }
}

function checkString(paramName, paramValue) {
   // if (typeof paramValue != "string") throw `${paramName} is not a string`;
    if (paramValue == null || paramValue == "") throw `${paramName} cannot be empty`;
}

function checkStringArray(paramName, paramValue) {
    if (!Array.isArray(paramValue)) throw `${paramName} is not an array`;
    for (let i=0; i<paramValue.length; i++) {
        checkString(`${paramName}[${i}]`, paramValue[i]);
    }
}

function checkBool(paramName, paramValue) {
    if (typeof paramValue != "boolean") throw `${paramName} is not a boolean`;
}

function checkStringIsObjectId(paramName, paramValue) {
    checkString(paramName, paramValue);
    if (!ObjectId.isValid(paramValue)) throw `${paramValue} is not a valid ObjectId`;
}

function checkFloat(paramName, paramValue) {
    if ((typeof (parseInt(paramValue)) != 'number')) throw `${paramName} is not a number`;
}

function checkDateTime(paramName, paramValue) {
    if (isNaN(Date.parse(paramValue))) throw `${paramName} is not a valid datetime object`;
}




function toObjectId(stringId) {
    return ObjectId(stringId);
}

function stringifyObject(o) {
    if (Array.isArray(o)) return o.map(x => stringifyObject(x));
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
    const result = await col.find({params});
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
    checkExist,
    checkStringArray,
    checkFloat,
    checkDateTime,
    getDate,
    sortByDate
}
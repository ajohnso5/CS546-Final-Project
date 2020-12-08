const utils = require('./_utils');
const helper = require('./_helper');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const sessions = mongoCollections.posts;
const fishTypes = mongoCollections.fishTypes;
const tides = mongoCollections.tides;
const settings = require(__dirname + "/../config/settings");
const axios = require('axios');

async function getWeather(year, month, day, hour, lat, long) {
    const apiUrl = settings.weatherApi.url+"history.json?";
    const key = "key="+settings.weatherApi.key;
    const query = `q=${lat},${long}&dt=${year}-${month}-${day}&hour=${hour}`;
    const result = await axios.get(apiUrl+key+query);
    const forecast = result.forecast.forecastday.hour;
    return {
        temp: forecast.temp_f,
        condition: forecast.condition.text,
        wind_speed: forecast.wind_mph
    }
}

async function getForUser(userId) {
    utils.checkParams(utils.checkStringIsObjectId, {userId});
    const sessionsData = await sessions();
    const userSessions = await sessionsData.findMany({userId: utils.toObjectId(userId)});
    return utils.stringifyObject(userSessions);
}

async function create(userId, isPublic, lat, long, dateTime, note, durationHours, lures, 
    fishTypeId, avgLength, avgWeight, maxLength, maxWeight, notableCatches, quantity, tideId) {
    utils.checkParams(utils.checkStringIsObjectId, {userId, fishTypeId, tideId});
    utils.checkParams(utils.checkString, {note, notableCatches});
    utils.checkParams(utils.checkStringArray, {lures});
    utils.checkParams(utils.checkFloat, {quantity, durationHours, avgLength, avgWeight, maxLength, maxWeight, lat, long});
    utils.checkParams(utils.checkDateTime, {dateTime});
    utils.checkParams(utils.checkBool, {isPublic});
    utils.checkExist(users, {_id: utils.toObjectId(userId)}, "User");
    utils.checkExist(fishTypes, {_id: utils.toObjectId(fishTypeId)}, "FishType");
    utils.checkExist(tides, {_id: utils.toObjectId(tideId)}, "Tide");
    const date = Date.parse(dateTime);
    const month = date.getMonth().toString().length === 1 ? `0${date.getMonth()}` : date.getMonth();
    const day = date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    const weatherData = await getWeather(date.getFullYear(), month, day, date.getHours(), lat, long);
    const session = {
        userId,
        isPublic,
        location: { lat, long },
        note,
        durationHours,
        dateTime: Date.parse(dateTime),
        fish: {
            fishTypeId,
            lures,
            quantity: parseInt(quantity),
            avgLength: parseFloat(avgLength),
            avgWeight: parseFloat(avgWeight),
            maxLength: parseFloat(maxLength),
            maxWeight: parseFloat(maxWeight)
        },
        weather: weatherData,
        water_conditions: {
            tideId
        },
        noteableCatches
    }
    return await helper.create(sessions, session, "Session");
}

async function remove(id) {
    return await helper.remove(sessions, id, "Session");
}

async function getById(id) {
    return await helper.getById(sessions, id, "Session");
}

async function getAll() {
    return await helper.getAll(sessions);
}

async function update(id, model) {
    await getById(id);
    if (model == null || Object.keys(model).length === 0) throw "No fields to update";
    const updates = {};
    if (model.durationHours != null) {
        utils.checkParams(utils.checkFloat, {durationHours: model.durationHours});
        updates.durationHours = model.durationHours;
    }
    if (model.isPublic != null) {
        utils.checkParams(utils.checkBool, {isPublic: model.isPublic});
        updates.isPublic = model.isPublic;
    }
    if (model.note != null) {
        utils.checkParams(utils.checkString, {note: model.note});
        updates.note = model.note;
    }
    if (model.lures != null) {
        utils.checkParams(utils.checkStringArray, {lures: model.lures});
        updates.fish.lures = model.lures;
    }
    if (model.fishTypeId != null) {
        utils.checkParams(utils.checkStringIsObjectId, {fishTypeId: model.fishTypeId});
        utils.checkExist(fishTypes, {_id: utils.toObjectId(fishTypeId)}, "FishType");
        updates.fish.fishTypeId = model.fishTypeId;
    }
    if (model.avgLength != null) {
        utils.checkParams(utils.checkFloat, {avgLength: model.avgLength});
        updates.fish.avgLength = model.avgLength;
    }
    if (model.avgWeight != null) {
        utils.checkParams(utils.checkFloat, {avgWeight: model.avgWeight});
        updates.fish.avgWeight = model.avgWeight;
    }
    if (model.maxLength != null) {
        utils.checkParams(utils.checkFloat, {maxLength: model.maxLength});
        updates.fish.maxLength = model.maxLength;
    }
    if (model.maxWeight != null) {
        utils.checkParams(utils.checkFloat, {maxWeight: model.maxWeight});
        updates.fish.maxWeight = model.maxWeight;
    }
    if (model.notableCatches != null) {
        utils.checkParams(utils.checkString, {notableCatches: model.notableCatches});
        updates.notableCatches = model.notableCatches;
    }
    if (model.quantity != null) {
        utils.checkParams(utils.checkFloat, {quantity: model.quantity});
        updates.fish.quantity = model.quantity;
    }
    return await helper.update(sessions, id, updates, "Session");
}

model.exports = {
    create,
    remove, 
    getById,
    getAll,
    update,
    getForUser
}
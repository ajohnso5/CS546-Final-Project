const utils = require("./_utils");
const helper = require("./_helper");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const sessions = mongoCollections.sessions;
const fishTypes = mongoCollections.fishTypes;
const tides = mongoCollections.tides;
const settings = require(__dirname + "/../config/settings");
const axios = require("axios");

async function getWeather(date, loc) {
  const apiUrl = settings.weatherApi.url + "history.json?";
  const key = "key=" + settings.weatherApi.key;
  const query = `&q=${loc}&dt=${date}`;
  const { data } = await axios.get(apiUrl + key + query);
  const forecast = data.forecast.forecastday[0].day;
  return {
    temp: forecast.maxtemp_f,
    condition: forecast.condition.text,
    wind_speed: forecast.maxwind_mph,
  };
}

async function getForUser(userId) {
  utils.checkParams(utils.checkStringIsObjectId, { userId });
  const d = await getAll();
  console.log(d);
  const sessionsData = await sessions();
  const userSessions = await sessionsData.find({
    userId: userId,
  }).toArray();
  return userSessions;
}

async function create(
  userId,
  isPublic,
  loc,
  date,
  note,
  durationHours,
  lures,
  fishTypeId,
  avgLength,
  avgWeight,
  maxLength,
  maxWeight,
  notableCatches,
  quantity,
  tide,
  waveHeight
) {
  try {
    utils.checkParams(utils.checkString, {
      loc,
      lures,
      userId,
      fishTypeId,
      tide,
      note,
      notableCatches,
    });
    utils.checkParams(utils.checkFloat, {
      quantity,
      durationHours,
      avgLength,
      avgWeight,
      maxLength,
      maxWeight,
      waveHeight,
    });
    if (isPublic == "on") isPublic = true;
    else isPublic = false;
    utils.checkParams(utils.checkBool, { isPublic });
    utils.checkExist(users, { _id: userId }, "User");
    const weatherData = await getWeather(date, loc);
    const session = {
      userId,
      isPublic,
      location: loc,
      note,
      durationHours,
      dateTime: date,
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
        tide,
        waveHeight
      },
      notableCatches
    };
    console.log(session);
    return await helper.create(sessions, session, "Session");
  } catch (e) {
    return e;
  }
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
  if (model == null || Object.keys(model).length === 0)
    throw "No fields to update";
  const updates = {};
  if (model.durationHours != null) {
    utils.checkParams(utils.checkFloat, { durationHours: model.durationHours });
    updates.durationHours = model.durationHours;
  }
  if (model.isPublic != null) {
    utils.checkParams(utils.checkBool, { isPublic: model.isPublic });
    updates.isPublic = model.isPublic;
  }
  if (model.note != null) {
    utils.checkParams(utils.checkString, { note: model.note });
    updates.note = model.note;
  }
  if (model.lures != null) {
    utils.checkParams(utils.checkStringArray, { lures: model.lures });
    updates.fish.lures = model.lures;
  }
  if (model.fishTypeId != null) {
    utils.checkParams(utils.checkString, {
      fishTypeId: model.fishTypeId,
    });
    utils.checkExist(
      fishTypes,
      { _name: fishTypeId },
      "FishType"
    );
    updates.fish.fishTypeId = model.fishTypeId;
  }
  if (model.avgLength != null) {
    utils.checkParams(utils.checkFloat, { avgLength: model.avgLength });
    updates.fish.avgLength = model.avgLength;
  }
  if (model.avgWeight != null) {
    utils.checkParams(utils.checkFloat, { avgWeight: model.avgWeight });
    updates.fish.avgWeight = model.avgWeight;
  }
  if (model.maxLength != null) {
    utils.checkParams(utils.checkFloat, { maxLength: model.maxLength });
    updates.fish.maxLength = model.maxLength;
  }
  if (model.maxWeight != null) {
    utils.checkParams(utils.checkFloat, { maxWeight: model.maxWeight });
    updates.fish.maxWeight = model.maxWeight;
  }
  if (model.notableCatches != null) {
    utils.checkParams(utils.checkString, {
      notableCatches: model.notableCatches,
    });
    updates.notableCatches = model.notableCatches;
  }
  if (model.quantity != null) {
    utils.checkParams(utils.checkFloat, { quantity: model.quantity });
    updates.fish.quantity = model.quantity;
  }
  return await helper.update(sessions, id, updates, "Session");
}

module.exports = {
  create,
  remove,
  getById,
  getAll,
  update,
  getForUser,
};

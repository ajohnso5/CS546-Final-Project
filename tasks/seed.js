const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const { stringifyObject } = require("../data/_utils");
const users = data.users;
const posts = data.posts;
const fishTypes = data.fishTypes;
const comments = data.comments;
const sessions = data.sessions;
const tides = data.tides;

// Based off of the seed document from Lecture 5. We have Users and Posts in our app as well, so some of the code is repurposed and modified.

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  // Begin seeding users
  console.log("seeding users...");

  const matthew = await users.create("MDrehobl", "LeakyStove#3", true);
  const chris = await users.register("CCousillas", "BigFish75", "BigFish75");
  const alex = await users.create("AJohnson", "FishFanatic354", true);
  const ryan = await users.register("RByrne", "BigDripp&7", "BigDripp&7");

  console.log(`Matthew ID: ${matthew}`);
  console.log(`Chris ID: ${chris._id}`);
  // Begin seeding posts
  console.log("seeding posts...");

  const firstPost = await posts.create(
    "Caught a big one",
    matthew._id,
    "The weather outside was beautiful, had a really nice day out by the lake!\nDefinitely wish I could have had some friends here with me, but it's not really possible right now.",
    "https://fyrnelake.com/uploads/3/4/8/0/34804321/published/wil_2.jpg?1559850795"
  );

  const secondPost = await posts.create(
    "No luck today",
    alex._id,
    "Spent 4 hours out here, was some great weather but I never got any bites. Better luck next time!",
    "https://fyrnelake.com/uploads/3/4/8/0/34804321/published/wil_2.jpg?1559850795"
  );

  // Begin seeding comments
  console.log("seeding comments...");

  const firstComment = await comments.create(
    firstPost._id,
    chris._id,
    "Looks like a great time!"
  );

  const secondComment = await comments.create(
    firstPost._id,
    ryan._id,
    "wish i could have been there"
  );

  // Populate supported fish types into the database
  console.log("seeding fish types...");

  const fishArr = [
    "Bass",
    "Mackerel",
    "Blue Fish",
    "Tog",
    "Winter Flouder",
    "Fluke",
    "Sunfish",
    "Ray",
    "Shark",
  ];

  for (let i = 0; i < 9; i++) {
    fishTypes.create(fishArr[i]);
  }
  console.log(fishArr);

  // Populate supported tides into the database
  console.log("seeding tides...");

  await tides.create("high");
  await tides.create("low");
  await tides.create("medium");

  // Seed sessions into the database
  console.log("seeding sessions...");

  // NOTES: Should make form for selecting fishTypes simply be a dropdown that lets users select from all fishTypes, and returns the id of those fishTypes
  // NOTES pt 2: Tides are accepting string even though tides are stored in an object like fishTypes. Different implementation of similar concept.

  const firstDate = "2020-12-12";
  const firstLoc = "Belmar NJ";
  const session1 = await sessions.create(
    matthew._id.toString(),
    "on",
    firstLoc,
    firstDate,
    "new rod?",
    "3",
    "minnow",
    "bass",
    "7",
    "8",
    "5",
    "6",
    "none",
    "10",
    "high",
    "3"
  );

  console.log(session1);

  const firstDate2 = "2020-12-13";
  const firstLoc2 = "Hoboken NJ";
  // NEED TO FIGURE OUT LOCATION OBJECT TO PASS INTO WEATHER API.
  // USAGE IS getWeather(date, loc), need to make sure location object is the right type.
  // Date object should be correct.
  const session2 = await sessions.create(
    matthew._id.toString(),
    "on",
    firstLoc2,
    firstDate2,
    "none",
    "7",
    "metal",
    "bluefish",
    "11",
    "15",
    "8",
    "11",
    "none",
    "10",
    "high",
    "3"
  );

  console.log(session2);

  const firstDate3 = "2020-12-14";
  const firstLoc3 = "Asbury NJ";
  const session3 = await sessions.create(
    alex._id.toString(),
    "on",
    firstLoc3,
    firstDate3,
    "fat phish",
    "11",
    "jig",
    "bass",
    "13",
    "18",
    "8",
    "14",
    "none",
    "10",
    "slack",
    "3"
  );

  console.log(session3);


  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);

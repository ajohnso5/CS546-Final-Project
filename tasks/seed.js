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

  const post1 = await posts.create(
    "Caught a big one",
    matthew._id,
    "The weather outside was beautiful, had a really nice day out by the lake!\nDefinitely wish I could have had some friends here with me, but it's not really possible right now."
  );

  const post2 = await posts.create(
    "No luck today",
    alex._id,
    "Spent 4 hours out here, was some great weather but I never got any bites. Better luck next time!"
  );

  const post3 = await posts.create(
    "Fishing is the best",
    ryan._id,
    "Nothin like a sunny day and a cooler full of fish"
  )


  // Begin seeding comments
  console.log("seeding comments...");

  const comment1 = await comments.create(
    post1._id.toString(),
    chris._id,
    "Looks like a great time!"
  );

  const comment2 = await comments.create(
    post1._id.toString(),
    ryan._id,
    "wish i could have been there"
  );

  const comment3 = await comments.create(
    post3._id.toString(),
    chris._id,
    "It sure is!"
  )


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
  await tides.create("slack");

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

  const date4 = "2020-11-28"
  const loc4 = "Mahwah NJ";
  const session4 = await sessions.create(
    chris._id.toString(),
    "on",
    loc4,
    date4,
    "forgot my sandals",
    "4",
    "spinner",
    "Mackerel",
    "2.5",
    "2.6",
    "5",
    "4.5",
    "big sunny",
    "10",
    "low",
    "2"
  )

  const date5 = "2020-12-04"
  const loc5 = "Edgewater NJ";
  const session5 = await sessions.create(
    alex._id.toString(),
    "on",
    loc5,
    date5,
    "secret spot",
    "6",
    "plug",
    "Bass",
    "10",
    "12",
    "15",
    "18",
    "none",
    "3",
    "low",
    "4"
  )

  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);
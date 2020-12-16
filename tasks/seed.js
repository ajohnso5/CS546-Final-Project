const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const { stringifyObject } = require('../data/_utils');
const users = data.users;
const posts = data.posts;
const utils = data._utils;
const fishTypes = data.fishTypes;
const comments = data.comments;
const sessions = data.sessions;
const tides = data.tides;

// Based off of the seed document from Lecture 5. We have Users and Posts in our app as well, so some of the code is repurposed and modified.

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  // Begin seeding users 
  console.log('seeding users...');

  const matthew = await users.create('MDrehobl', 'LeakyStove#3', true);
  const chris = await users.register('CCousillas', 'BigFish75', 'BigFish75');
  const alex = await users.create('AJohnson', 'FishFanatic354', true);
  const ryan = await users.register('RByrne', 'BigDripp&7', 'BigDripp&7');

  // currently, matthew._id is null. matthew is null. the users.create() and users.register() functions return null.
  // this is why posts.create() will throw that the id is not valid

  // Begin seeding posts
  console.log('seeding posts...');

  const firstPost = await posts.create(
    'Caught a big one',
    matthew._id,
    'The weather outside was beautiful, had a really nice day out by the lake!\nDefinitely wish I could have had some friends here with me, but it\'s not really possible right now.',
    'https://fyrnelake.com/uploads/3/4/8/0/34804321/published/wil_2.jpg?1559850795'
  );

  const secondPost = await posts.create(
    'No luck today',
    alex._id,
    'Spent 4 hours out here, was some great weather but I never got any bites. Better luck next time!',
    'https://fyrnelake.com/uploads/3/4/8/0/34804321/published/wil_2.jpg?1559850795'
  )


  // Begin seeding comments
  console.log('seeding comments...');

  const firstComment = await comments.create(
    firstPost._id,
    chris._id,
    'Looks like a great time!'
  );

  const secondComment = await comments.create(
    firstPost._id,
    ryan._id,
    'wish i could have been there'
  )

  // Populate supported fish types into the database
  console.log('seeding fish types...');

  const fishArr = ['Bass', 'Mackerel', 'Blue Fish', 'Tog', 'Winter Flouder', 'Fluke', 'Sunfish', 'Ray', 'Shark'];
  const fishIds = [];
  for (let i = 0; i < 9; i++) {
    fishIds.push(fishTypes.create(fishArr[i]));
  }

  console.log(fishArr);
  console.log(fishIds);
  
  // Populate supported tides into the database
  console.log('seeding tides...');

  tides.create('high');
  tides.create('low');
  tides.create('medium');


  // Seed sessions into the database
  console.log('seeding sessions...');

  // NOTES: Should make form for selecting fishTypes simply be a dropdown that lets users select from all fishTypes, and returns the id of those fishTypes
  // NOTES pt 2: Tides are accepting string even though tides are stored in an object like fishTypes. Different implementation of similar concept.

  // new Date(Year, month-1, day, hours)
  // Nov 24, 2020, 1pm
  const firstDate = new Date(2020, 10, 24, 13);

  const firstLoc;
  // NEED TO FIGURE OUT LOCATION OBJECT TO PASS INTO WEATHER API.
  // USAGE IS getWeather(date, loc), need to make sure location object is the right type.
  // Date object should be correct.
  const firstSession = await sessions.create(
    matthew._id,
    true,
    firstLoc,
    firstDate,
    'new rod?',
    3.0,
    'none',
    fishIds[0],
    7.8,
    2.6,
    10.5,
    3.5,
    'none',
    10,
    'high',
    3.5
  );

  // Dec 5, 2020, 9am
  const secondDate = new Date(2020, 11, 05, 09);
  const secondLoc = ;
  // private session 
  const secondSession = await sessions.create(
    chris._id,
    false,
    secondLoc,
    secondDate,
    'caught nothin',
    5.0,
    'none',
    fishIds[4],
    0.0,
    0.0,
    0.0,
    0.0,
    'none',
    0.0,
    'low',
    2.0
  );



  console.log('Done seeding database');
  await db.serverConfig.close();
};

main().catch(console.log);
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const posts = data.posts;

// Based off of the seed document from Lecture 5. We have Users and Posts in our app as well, so some of the code is repurposed and modified.

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  // Begin seeding users 
  const matthew = await users.create('MatthewDrehobl', 'LeakyStove#3', true);
  // const chris = await users.register('ChristopherCousillas', 'BigFish75', 'BigFish75');
  
  // const firstPost = await posts.addPost(
  //   'Caught a big one',
  //   matthew,
  //   'The weather outside was beautiful, had a really nice day out by the lake!\nDefinitely wish I could have had some friends here with me, but it\'s not really possible right now.',
  //   'https://fyrnelake.com/uploads/3/4/8/0/34804321/published/wil_2.jpg?1559850795'
  // );


  console.log('Done seeding database');
  await db.serverConfig.close();
};

main().catch(console.log);

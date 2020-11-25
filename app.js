const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const bcrypt = require('bcrypt');
app.use(express.json());


const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
app.use(express.json());
app.use('/public', static);
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthCookie',
    secret: "Secret",
    saveUninitialized: true,
    resave: false
  })
);



//middleware here

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
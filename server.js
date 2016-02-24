/* jslint node: true */

'use strict';

var express = require('express');
var app = express();
var routes = require('./routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Require our configs from .env
require('dotenv').load();
var port = process.env.PORT || 8080;

// Connect to the DB
mongoose.connect(process.env.MONGO_URI);

// Configure Passport
require('./config/passport.js')(passport);
// pass passport for configuration

// Set up Express app
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth / session)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

app.use('/views', express.static(process.cwd() + '/views'));
// direct client routes

// For Passport
app.use(session({
  secret: 'getOutTheVote',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
routes(app, passport);

// Launch
app.listen(port, function() {
  console.log('Listening on port ' + port + '...');
});

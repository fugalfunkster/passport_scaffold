'use strict';

var express = require('express'),
    app = express(),
    routes = require('./routes/index.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

// Require our configs from .env
require('dotenv').load();
var port = process.env.PORT || 8080;

// Connect to the DB
mongoose.connect(process.env.MONGO_URI);

// Configure Passport
require('./config/passport.js')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth / session)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// For Passport
app.use(session({
    secret:'getOutTheVote',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 

// Routes
routes(app, passport);

// Launch 
app.listen(port, function () {
    console.log('Listening on port ' + port + '...');
});
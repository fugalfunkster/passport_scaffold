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

require('dotenv').load();
var port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI);

require('./config/passport.js')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use('/views', express.static(process.cwd() + '/views'));

app.use(session({
  secret: 'speakfriendandenter',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

routes(app, passport);

app.listen(port, function() {
  console.log('Listening on port ' + port + '...');
});

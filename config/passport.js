/* jslint node : true */

'use strict';

var LocalStrategy   = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var configAuth = require('./oauth');

var User = require('../models/users');

module.exports = function(passport) {

  // To restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // LOCAL SIGNUP STRATEGY  ===================================================

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({'local.email': email}, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('signupMessage',
                                             'That email is already taken.'));
        } else {
          var newUser            = new User();
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            // console.log(user);
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // LOCAL LOGIN STRATEGY ====================================================

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({'local.email':  email}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash('loginMessage',
                                           'No user found.'));
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage',
                                           'Oops! Wrong password.'));
      }
      // console.log(user);
      return done(null, user);
    });
  }));

  // GITHUB STRATEGY

  passport.use(new GitHubStrategy({
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({'github.id': profile.id}, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          console.log(profile);
          return done(null, user);
        } else {
          var newUser = new User();
          console.log(profile);
          newUser.github.id = profile.id;
          newUser.github.username = profile.username;
          newUser.github.displayName = profile.displayName;
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

};

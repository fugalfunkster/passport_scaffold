'use strict';

var path = process.cwd();

module.exports = function (app, passport) {
    
    function isLoggedIn (req, res, next){
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/signup');
        }
    }
    
    app.route('/')
        .get(isLoggedIn, function (req, res) {
            res.sendFile(path + '/views/index.html');
        });
        
    app.route('/login')
        .get(function (req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') }); 
        })
        .post(passport.authenticate('local-login', { 
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        
    app.route('/signup')
        .get(function (req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        })
        .post(passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        
    app.route('/logout')
        .get(function (req, res) {
            req.logout();
            res.redirect('/login');
        });
    
    app.route('/profile')
        .get(isLoggedIn, function (req, res) {
            res.sendFile(path + '/views/profile.html');
        });
    
    app.route('/oauth/github')
        .get(passport.authenticate('github'));
        
    app.route('/oauth/github/callback')
        .get(passport.authenticate('github', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));
    
};
'use strict';

var logger = require('winston');
const config = require('./config');

var BnetStrategy = require('passport-bnet').Strategy;
var passport = require('passport');

// database
var db_User = require('../models/user');

passport.use(new BnetStrategy({
    clientID: config.bnet_key,
    clientSecret: config.bnet_secret,
    callbackURL: config.bnet_callback,
    region: 'us'
}, function(accessToken, refreshToken, profile, done){
    return done(null, profile);
}));

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){

  db_User.findOne({battletag: user.battletag}, function(err, User){
    if(err) done(err);

    if(!User){
      var newUser = db_User({
        battletag: user.battletag
      });
      newUser.save(function(err){
        if(err) console.log('[AUTH] user creation error: ' + err.message);
      })
      user.profile = {
        doubloons: 0,
        replaysUploaded: 0
      }
    } else {
      user.profile = {
        doubloons: User.doubloons,
        replaysUploaded: User.replaysUploaded
      }
    }

    var separated = user.battletag.split('#');

    user.profile.separated = {
      username: separated[0],
      battletag: separated[1]
    };
    done(null, user);
  });
});

module.exports = passport;

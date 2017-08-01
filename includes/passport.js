var logger = require('winston');
const config = require('./config');

var BnetStrategy = require('passport-bnet').Strategy;
var passport = require('passport');

// database
var db_User = require('../models/user');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb_key);

passport.use(new BnetStrategy({
    clientID: config.bnet_key,
    clientSecret: config.bnet_secret,
    callbackURL: config.bnet_callback,
    region: 'us'
}, function(accessToken, refreshToken, profile, done){
    return profile ? done(null, profile) : done(1);
}));

passport.serializeUser(function(user, done){

  // separate battletag into name and number
  var separated = user.battletag.split('#');
  var username = separated[0];
  var battletag = separated[1];

  // create user if does not exist in database, update user if already exists
  db_User.findOne({battletag: battletag}, {username}, function(err, user){
    if(!user){
      var newUser = db_User({
        battletag: battletag,
        username: username
      });
      newUser.save(function(err){
        if(err) console.log('[AUTH] user creation error: ' + err.message);
      })
    } else {
      if(user.username !== username)
        db_User.update({battletag: battletag}, {username: username}, function(err){
          if(err) console.log('[AUTH] user update error: ' + err.message);
        });
    }
  });

  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

module.exports = passport;

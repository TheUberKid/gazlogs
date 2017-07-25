var logger = require('winston');
const config = require('./config');

var BnetStrategy = require('passport-bnet').Strategy;
var passport = require('passport');

// database
var db_User = require('../models/user');
var db_Replay = require('../models/replay');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb_key);

passport.use(new BnetStrategy({
    clientID: config.bnet_key,
    clientSecret: config.bnet_secret,
    callbackURL: config.bnet_callback,
    region: 'us'
}, function(accessToken, refreshToken, profile, done){
    return done(null, profile);
}));

passport.serializeUser(function(user, done){

  // separate battletag into name and number
  console.log(user);
  var separated = user.battletag.split('#');
  var username = separated[0];
  var battletag = separated[1];

  // create user if does not exist in database, update user if already exists
  db_User.findOneAndUpdate({
    battletag: battletag
  }, {
    battletag: battletag,
    username: username,
    settings: {}
  }, {
    upsert: true
  }, function(err, user){
    if(err) logger.log('info', '[AUTH] user update error: ' + err.message);
  });

  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

module.exports = passport;

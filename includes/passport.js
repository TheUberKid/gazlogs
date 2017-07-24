var logger = require('winston');
const config = require('./config');

var BnetStrategy = require('passport-bnet').Strategy;
var passport = require('passport');

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
  done(null, user);
});

module.exports = passport;

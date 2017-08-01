var db_User = require('../models/user');
var passport = require('./passport')

// redirect non-secure users to https
function forceHTTPS(req, res, next){
  if(req.headers['x-forwarded-proto'] != 'https'){
    res.redirect(301, 'https://gazlogs.com'+req.url);
  } else {
    next();
  }
}
module.exports.forceHTTPS = forceHTTPS;

// add authenticated profile headers to a request
function addProfileHeaders(req, res, next){
  if(req.isAuthenticated()){
    var battletag = req.user.battletag.split('#')[1];

    db_User.findOne({battletag: battletag}, function(err, user){
      if(err) next();
      req.auth = {
        battletag: user.battletag,
        username: user.username,
        doubloons: user.doubloons
      }
      next();
    });

  } else {
    next();
  }
}
module.exports.addProfileHeaders = addProfileHeaders;

// authenticate a user using a custom authentication route
function authenticate(req, res, next){
  passport.authenticate('bnet', function(err, user, info){
    if(err || !user){
      res.redirect('/auth/login');
    } else {
      req.login(user, err => {
        if(err){
          res.redirect('/auth/login');
        } else {
          var callback = req.session.callback;
          if(callback){
            req.session.callback = null;
            res.redirect(callback);
          } else {
            res.redirect('/profile');
          }
        }
      });
    }
  })(req, res, next);
}
module.exports.authenticate = authenticate;

// redirect if user is not authenticated
function requireAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect('/auth/login?callback='+req.originalUrl);
  }
}
module.exports.requireAuth = requireAuth;

// redirect if user is already authenticated
function noAuth(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/profile');
  } else {
    next();
  }
}
module.exports.noAuth = noAuth;

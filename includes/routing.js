var logger = require('winston');
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

// authenticate a user using a custom authentication route
function authenticate(req, res, next){
  passport.authenticate('bnet', function(err, user, info){
    if(err || !user)
      return res.redirect('/auth/login');

    req.logIn(user, function(err){
      if(err)
        return res.redirect('/auth/login');

      var callback = req.session.callback;
      if(callback){
        req.session.callback = null;
        return res.redirect(callback);
      }
      return res.redirect('/profile');
    });
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

// render a page
function render(view, title, nav, params){
  var callback = function(req, res, next){
    res.render(view, {'title': title, 'nav': nav, 'profile': req.user ? req.user.profile : null, 'params': params});
  }
  return callback;
}
module.exports.render = render;

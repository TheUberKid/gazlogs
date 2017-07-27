var db_User = require('../models/user');

// redirect non-secure users to https
function forceHTTPS(req, res, next){
  if(req.headers['x-forwarded-proto'] != 'https'){
    res.redirect(301, 'https://gazlogs.com'+req.url);
  } else {
    next();
  }
}

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

// redirect if user is not authenticated
function requireAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect('/auth/login');
  }
}

// redirect if user is already authenticated
function noAuth(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/profile');
  } else {
    next();
  }
}

module.exports = {
  forceHTTPS: forceHTTPS,
  addProfileHeaders: addProfileHeaders,
  requireAuth: requireAuth,
  noAuth: noAuth
}

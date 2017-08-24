'use strict';

var logger = require('winston');
const config = require('./includes/config');

// database
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongodb_key, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});
var db_User = require('./models/user');

// authentication
var passport = require('./includes/passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// express middleware
var compression = require('compression');
var minify = require('express-minify');
var favicon = require('serve-favicon');
var routing = require('./includes/routing');
var queries = require('./includes/queries');
var dict = require('./includes/dictionary');

// server
var express = require('express'),
    app = express(),
    serv;

// configure view engine
app.set('views', __dirname + '/public');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// redirect to https
if(!config.debug){
  app.get('*', routing.forceHTTPS);
  serv = require('http').Server(app);
} else {
  // https server created in this way only on localhost testing (debug mode)
  serv = require('https').createServer({
    key: config.ssl_key,
    cert: config.ssl_cert,
    requestCert: false,
    rejectUnauthorized: false
  }, app);
}

// start receiving requests
app.use(compression());
if(!config.debug) app.use(minify());
app.use(favicon(__dirname + '/public/img/favicon.png'))
    .use(cookieParser(config.session_secret))
    .use(session({secret: config.session_secret, resave: true, saveUninitialized: true}))
    .use(passport.initialize())
    .use(passport.session())
    .use('/css', express.static('public/css'))
    .use('/js', express.static('public/js'))
    .use('/img', express.static('public/img'))
    .get('/', routing.render('index', false, false))
    .get('/statistics', function(req, res){
      req.query.build = parseInt(req.query.build);
      req.query.gametype = parseInt(req.query.gametype);
      routing.render('statistics', 'HotS Statistics', 'statistics', {
        BuildList: dict.builds,
        Build: (req.query.build != null && dict.builds.indexOf(req.query.build) > -1) ? req.query.build : dict.builds[0],
        GameType: (req.query.gametype != null && req.query.gametype >= 6 && req.query.gametype <= 9) ? req.query.gametype : 8
      })(req, res);
    })
    .get('/statistics/hero/*', function(req, res, next){
      var hero = routing.getPath(req.url).toLowerCase();
      var h = dict.lowerCaseNames[hero];
      if(h != null){
        req.query.build = parseInt(req.query.build);
        req.query.gametype = parseInt(req.query.gametype);
        routing.render('hero', h.PrimaryName + ' (Hero)', 'statistics', {
          Hero: h.AttributeName,
          BuildList: dict.builds,
          Build: (req.query.build != null && dict.builds.indexOf(req.query.build) > -1) ? req.query.build : dict.builds[0],
          GameType: (req.query.gametype != null && req.query.gametype >= 6 && req.query.gametype <= 9) ? req.query.gametype : 8
        })(req, res);
      } else {
        next();
      }
    })
    .get('/leaderboard', routing.render('leaderboard', 'Leaderboard', 'leaderboard'))
    .get('/exchange', routing.render('exchange', 'Doubloon Exchange', 'exchange'))
    .get('/upload', function(req, res){
      routing.render('upload', 'Upload Replays', 'upload', {
        loggedIn: req.isAuthenticated(),
        ultoken: req.user ? req.user.battletag : ''
      })(req, res);
    })
    .get('/profile', routing.requireAuth, function(req, res){
      queries.countReplaysWithUser(req.user.battletag, function(n){
        if(n > 0){
          queries.getReplaysByUser(req.user.battletag, null, function(replays){
            routing.render('profile', req.user.profile.separated.username + '\'s Profile', 'user', {
              profile: req.user.profile,
              replaysIn: n,
              replays: replays
            })(req, res);
          });
        } else {
          routing.render('profile', req.user.profile.separated.username + '\'s Profile', 'user', {
            profile: req.user.profile,
            replaysIn: 0,
            replays: []
          })(req, res);
        }
      })
    })
    .get('/replay/*', function(req, res){
      queries.getReplay(routing.getPath(req.url), function(replay){
        if(replay){
          routing.render('replay', 'Replay Viewer', 'statistics', replay)(req, res);
        } else {
          routing.render('replayMissing', 'Replay Not Found', 'statistics')(req, res);
        }
      });
    })
    .get('/api/statistics', function(req, res){
      req.query.build = parseInt(req.query.build);
      req.query.gametype = parseInt(req.query.gametype);
      queries.getSitewideStatistics(
      (req.query.build != null && dict.builds.indexOf(req.query.build) > -1) ? req.query.build : dict.builds[0],
      (req.query.gametype != null && req.query.gametype >= 6 && req.query.gametype <= 9) ? req.query.gametype : 8,
      function(stat){
        res.json(stat);
      });
    })
    .get('/auth', routing.noAuth, function(req, res){
      res.redirect('/auth/login');
    })
    .get('/auth/login', routing.noAuth, function(req, res){
      routing.render('login', 'Log In', 'user', req.user)(req, res);
    })
    .get('/auth/callback', routing.authenticate)
    .get('/auth/logout', function(req, res){
      req.logout();
      res.redirect('/auth/login');
    })
    .get('/auth/nydus', routing.noAuth, function(req, res, next){
      if(req.query.callback) req.session.callback = req.query.callback;
      next();
    }, passport.authenticate('bnet'))
    .get('/faq', routing.render('faq', 'Frequently Asked Questions', false))
    .get('*', function(req, res){
      res.status(404);
      routing.render('404', '404', false)(req, res);
    });

// start the server
serv.listen(config.port, function(){
  logger.log('info', 'starting server on port ' + config.port);
});

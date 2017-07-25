'use strict';

// includes
var logger = require('winston');
const config = require('./includes/config');

// rabbitMQ web/worker communication module
var amqp = require('./includes/amqp');
amqp.start(init)

// authentication
var passport = require('./includes/passport');

// express middleware
var compression = require('compression');
var minify = require('express-minify');
var favicon = require('serve-favicon');
var session = require('express-session');
var routing = require('./includes/routing');

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
function init(){
  app.use(compression());
  if(!config.debug) app.use(minify());
  app.use(favicon(__dirname + '/public/img/favicon.png'))
      .use(session({secret: config.session_secret, resave: true, saveUninitialized: true}))
      .use(passport.initialize())
      .use(passport.session())
      .use('/css', express.static('public/css'))
      .use('/js', express.static('public/js'))
      .use('/img', express.static('public/img'))
      .use('*', routing.addProfileHeaders)
      .get('/', function(req, res){
        res.render('partials/header', {title: false, nav: false, auth: req.auth});
      })
      .get('/statistics', function(req, res){
        res.render('statistics', {title: 'HotS Statistics', nav: 'statistics', auth: req.auth});
      })
      .get('/leaderboard', function(req, res){
        res.render('leaderboard', {title: 'Leaderboard', nav: 'leaderboard', auth: req.auth});
      })
      .get('/exchange', function(req, res){
        res.render('exchange', {title: 'Doubloon Exchange', nav: 'exchange', auth: req.auth});
      })
      .get('/upload', function(req, res){
        res.render('upload', {title: 'Upload Replays', nav: 'upload', auth: req.auth});
      })
      .get('/profile', routing.requireAuth, function(req, res){
        res.render('profile', {title: 'Profile', nav: 'user', auth: req.auth});
      })
      .get('/auth', routing.noAuth, function(req, res){
        res.redirect('/auth/login');
      })
      .get('/auth/login', routing.noAuth, function(req, res){
        res.render('login', {title: 'Log In', nav: 'user', auth: req.auth});
      })
      .get('/auth/callback', passport.authenticate('bnet', {failureRedirect: '/auth/login'}), function(req, res){
        res.redirect('/profile');
      })
      .get('/auth/logout', function(req, res){
        req.logout();
        res.redirect('/auth/login');
      })
      .get('/auth/nydus', routing.noAuth, passport.authenticate('bnet'))
      .get('*', function(req, res){
        res.status(404).render('404', {title: '404', nav: false});
      });

  // start the server
  serv.listen(config.port, function(){
    logger.log('info', 'starting server on port '+config.port);
  });
}

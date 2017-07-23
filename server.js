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

// server
var express = require('express'),
    app = express(),
    serv = require('http').Server(app);

// configure view engine
app.set('views', __dirname + '/public');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// redirect to https
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto'] != 'https'){
    res.redirect('https://gazlogs.com'+req.url);
  } else {
    next();
  }
});

// start receiving requests
function init(){
  app.use(compression());
  if(!config.debug) serv.use(minify());
  app.use(favicon(__dirname + '/public/img/favicon.png'))
      .use(session({secret: config.session_secret, resave: true, saveUninitialized: true}))
      .use(passport.initialize())
      .use(passport.session())
      .use('/css', express.static('public/css'))
      .use('/js', express.static('public/js'))
      .use('/img', express.static('public/img'))
      .get('/', function(req, res){
        if(req.isAuthenticated()) logger.log('info', 'cool beans!');
        res.render('index', {title: false, nav: false});
      })
      .get('/statistics', function(req, res){
        res.render('statistics', {title: 'HotS Statistics', nav: 'statistics'});
      })
      .get('/leaderboard', function(req, res){
        res.render('leaderboard', {title: 'Leaderboard', nav: 'leaderboard'});
      })
      .get('/exchange', function(req, res){
        res.render('exchange', {title: 'Doubloon Exchange', nav: 'exchange'});
      })
      .get('/upload', function(req, res){
        res.render('upload', {title: 'Upload Replays', nav: 'upload'});
      })
      .get('/auth', passport.authenticate('bnet'))
      .get('/auth/callback', passport.authenticate('bnet', {failureRedirect: '/'}), function(req, res){
        res.redirect('/');
      })
      .get('/auth/logout', function(req, res){
        req.logout();
        res.redirect('/');
      })
      .get('*', function(req, res){
        res.status(404).render('404', {title: '404', nav: false});
      });

  // start the server
  serv.listen(config.port, function(){
    logger.log('info', 'starting server on port '+config.port);
  });
}

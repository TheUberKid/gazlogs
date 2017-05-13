'use strict';

var logger = require('winston');
const config = require('./includes/config');
var amqp = require('./includes/amqp');
amqp.start();

// middleware
var compression = require('compression');
var minify = require('express-minify');
var favicon = require('serve-favicon');
var session = require('cookie-session');

var express = require('express');
var app = express();
app.set('views', __dirname + '/public');

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(compression());
if(!config.debug) app.use(minify());
app.use(favicon(__dirname + '/public/img/favicon.png'))
   .use(session({name: 'session', keys: config.cookie_keys, maxAge: config.cookie_max_age}))
   .use('/css', express.static('public/css'))
   .use('/js', express.static('public/js'))
   .use('/img', express.static('public/img'))
   .get('/', function(req, res){
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
     amqp.produce('replays', 'upload please lol');
   })
   .get('*', function(req, res){
     res.render('404', {title: false, nav: false});
   });

// start the server
app.listen(config.port, function(){
  logger.log('info', 'starting server on port '+config.port);
});

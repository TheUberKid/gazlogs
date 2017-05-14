'use strict';

const logger = require('winston');
const async = require('async');
const config = require('./includes/config');
var amqp = require('./includes/amqp');
amqp.start();

// middleware
const compression = require('compression');
const minify = require('express-minify');
const favicon = require('serve-favicon');
const session = require('cookie-session');

// file upload
const efu = require('express-fileupload');

var express = require('express');
var app = express();
app.set('views', __dirname + '/public');

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(compression());
if(!config.debug) app.use(minify());
app.use(favicon(__dirname + '/public/img/favicon.png'))
   .use(session({name: 'session', keys: config.cookie_keys, maxAge: config.cookie_max_age}))
   .use(efu({ limits: {fileSize: 5*1024*1024} }))
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
   })
   .post('/upload', function(req, res){
     for(var i in req.files){

       // check if proper filetype
       if(req.files[i].mimetype == 'application/octet-stream'){

         // generate a file number
         var fname = Math.floor(Math.random() * 100000000).toString();
         logger.log('info', '[FILE] received file: ' + req.files[i].name);

         // store the file
         req.files[i].mv(__dirname + '/filequeue/' + fname + '.StormReplay', function(err){
           if(err) return res.send('r');

           // add file to queue
           amqp.produce('replays', fname);
           res.send('s');
         });

       } else {
         logger.log('info', '[FILE] rejected file: ' + req.files[i].name + ' (incorrect filetype)');
         res.send('r');
       }

     }
   })
   .get('*', function(req, res){
     res.status(404).render('404', {title: false, nav: false});
   });

// start the server
app.listen(config.port, function(){
  logger.log('info', 'starting server on port '+config.port);
});

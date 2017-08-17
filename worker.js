'use strict';

// includes
var logger = require('winston');
const config = require('./includes/config');
var tasks = require('./includes/tasks');

// database
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongodb_key);
var db_Replay = require('./models/replay');

logger.log('info', 'starting worker');
db_Replay.find({}).then(function(replays){
  replays.forEach(function(x){
    console.log(typeof x.Build);
    db_Replay.update({Id: x.Id}, {
      Build: parseInt(x.Build)
    });
  });
});

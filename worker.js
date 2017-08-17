'use strict';

// includes
var logger = require('winston');
const config = require('./includes/config');
var tasks = require('./includes/tasks');

// database
var mongoose = require('mongoose');
mongoose.connect(config.mongodb_key);
mongoose.Promise = require('bluebird');
var db_Replay = require('./models/replay');

logger.log('info', 'starting worker');

setInterval(tasks.createHeroStatistics, 1000*60*60);

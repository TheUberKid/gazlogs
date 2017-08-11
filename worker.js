'use strict';

// includes
var logger = require('winston');
const config = require('./includes/config');
var tasks = require('./includes/tasks');

// database
var mongoose = require('mongoose');
mongoose.connect(config.mongodb_key);
var db_Replay = require('./models/user');

function init(){

  logger.log('info', 'starting worker');
  
}

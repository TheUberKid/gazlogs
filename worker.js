'use strict';

// includes
var logger = require('winston');
const config = require('./includes/config');
var tasks = require('./includes/tasks');

// rabbitMQ web/worker communication module
var amqp = require('./includes/amqp');
amqp.start(init);

// database
var mongoose = require('mongoose');
mongoose.connect(config.mongodb_key);
var db_Replay = require('./models/user');

function init(){

  logger.log('info', 'starting worker');

  /*
  amqp.ch.consume('replays', function(msg){

    var fname = msg.content.toString();
    logger.log('info', 'processing replay: ' + fname);

    // acknowledge completion
    amqp.ch.ack(msg);

  });
  */
}

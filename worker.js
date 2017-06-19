'use strict';

var logger = require('winston');
const config = require('./includes/config');
var amqp = require('./includes/amqp');
amqp.start(init);

function init(){

  logger.log('info', 'starting worker');

  amqp.ch.consume('replays', function(msg){

    var fname = msg.content.toString();
    logger.log('info', 'processing replay: '+ fname);

    // acknowledge completion
    amqp.ch.ack(msg);

  });
}

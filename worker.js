'use strict';

const logger = require('winston');
const config = require('./includes/config');
var amqp = require('./includes/amqp');

amqp.start(init);
logger.log('info', 'starting worker');

function init(){
  amqp.consume('replays', function(msg){
    logger.log('info', 'processing replay: '+msg.content.toString() + '.StormReplay');

    // acknowledge completion
    amqp.ack(msg);
  });
}

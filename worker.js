'use strict';

var logger = require('winston');
const config = require('./includes/config');
var amqp = require('./includes/amqp');

amqp.start(init);
logger.log('info', 'starting worker');

function init(){
  amqp.consume('replays', function(msg){
    logger.log('info', 'received message: '+msg.content.toString());
    amqp.ack(msg);
  });
}

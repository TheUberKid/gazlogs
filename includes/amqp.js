var logger = require('winston');
const config = require('./config');

var amqp = require('amqplib/callback_api');
var Amqp = {
  conn: null,
  ch: null,
  start: start
}

function start(callback){
  // connect to amqp
  amqp.connect(config.amqp_key, function(err, conn){
    if(err){
      logger.log('info', '[AMQP] '+err.message);
      return setTimeout(start, 1000);
    }
    conn.on('error', function(err){
      if(err.message !== 'Connection closing'){
        logger.log('info', '[AMQP] conn err '+err.message);
      }
    });
    conn.on('close', function() {
      logger.log('info', '[AMQP] reconnecting');
      return setTimeout(start, 1000);
    });

    Amqp.conn = conn;
    logger.log('info', '[AMQP] connected');

    createChannel(callback);
  });
}
function createChannel(callback){
  Amqp.conn.createChannel(function(err, ch){
    ch.on('error', function(err){
      logger.log('info', '[AMQP] channel error '+err.message);
    });
    ch.on('close', function(){
      logger.log('info', '[AMQP] channel closed, recreating');
      return setTimeout(createChannel, 1000);
    });

    Amqp.ch = ch;
    ch.assertQueue('replays', {durable: true});

    logger.log('info', '[AMQP] channel created');

    if(callback) callback();
  });
}

module.exports = Amqp;

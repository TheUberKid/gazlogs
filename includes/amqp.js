var logger = require('winston');
const config = require('./config');

var amqp = require('amqplib/callback_api');
var amqp_conn = null;
var amqp_ch = null;
var queues = [
  'replays'
];

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
    logger.log('info', '[AMQP] connected');

    amqp_conn = conn;

    conn.createChannel(function(err, ch){
      if(closeOnErr(err)) return;
      ch.on('error', function(err){
        logger.log('info', '[AMQP] channel error '+err.message);
      });
      ch.on('close', function(){
        logger.log('info', '[AMQP] channel closed');
      });

      amqp_ch = ch;

      // assert all queues
      queues.map(function(q){
        logger.log('info', '[AMQP] asserted queue: '+q);
        ch.assertQueue(q, {durable: true});
      });

      if(callback) callback();
    });
  });
}
function closeOnErr(err) {
  if (!err) return false;
  logger.log('info', '[AMQP] error '+err);
  amqp_conn.close();
  return true;
}

function produce(q, msg){
  amqp_ch.sendToQueue(q, new Buffer(msg), {persistent: true});
}
function consume(q, func){
  amqp_ch.consume(q, func);
}
function ack(msg){
  amqp_ch.ack(msg);
}

module.exports = {
  start: start,
  produce: produce,
  consume: consume,
  ack: ack
}

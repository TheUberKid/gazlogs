'use strict';

function moduleAvailable(name){
  try {
    require.resolve(name);
    return true;
  } catch(e){}
  return false;
}

// test for environment by checking existence of keys module (ignored by git) and load the relevant config
// hide secret keys in either local keys.js module or as heroku environment variables
var mongodb_key, amqp_key, cookie_keys, debug;
if(moduleAvailable('./keys')){
  const Keys = require('./keys');
  mongodb_key = Keys.mongodb_key;
  amqp_key = Keys.amqp_key;
  cookie_keys = Keys.cookie_keys;
  debug = true;
} else {
  mongodb_key = process.env.mongodb_key;
  amqp_key = process.env.amqp_key;
  cookie_keys = eval(process.env.cookie_keys);
  debug = false;
}

// non-secret keys can be shown here
const port = process.env.PORT || 5000;
const cookie_max_age = 7*24*60*60*1000;

module.exports = {
  'mongodb_key': mongodb_key,
  'amqp_key': amqp_key,
  'cookie_keys': cookie_keys,
  'cookie_max_age': cookie_max_age,
  'debug': debug,
  'port': port
}

'use strict';

function moduleAvailable(name){
  try {
    require.resolve(name);
    return true;
  } catch(e){}
  return false;
}

// test for environment by checking existence of keys module (ignored by git) and load the relevant config
// hide secret keys and certificates in either local keys.js module or as heroku environment variables
var Keys;
if(moduleAvailable('./keys')){
  Keys = require('./keys');
} else {
  Keys = process.env;
}

module.exports = {
  mongodb_key: Keys.mongodb_key,
  amqp_key: Keys.amqp_key,
  bnet_key: Keys.bnet_key,
  bnet_secret: Keys.bnet_secret,
  bnet_callback: Keys.bnet_callback,
  session_secret: Keys.session_secret,
  debug: moduleAvailable('./keys'),
  port: process.env.PORT || 5000
};

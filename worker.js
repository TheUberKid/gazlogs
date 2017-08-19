'use strict';

var logger = require('winston');
const config = require('./includes/config');

// database
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongodb_key, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});
var db_Replay = require('./models/replay');

// includes
var tasks = require('./includes/tasks');

logger.log('info', 'starting worker');

function SWStats(){
  db_Replay.distinct('Build').exec(function(err, builds){

    var gametypeIndex = 0;
    var buildIndex = 0;

    function generateStatistics(gametype, build){

      var prom = tasks.createHeroStatistics(builds[build], gametype + 5);

      prom.then(function(){
        if(gametypeIndex < 3){
          gametypeIndex++;
        } else {
          gametypeIndex = 0;
          buildIndex++;
        }
        if(buildIndex < builds.length) generateStatistics(gametypeIndex, buildIndex);
      }, function(){
        logger.log('info', 'promise rejected');
      })

    }

    generateStatistics(gametypeIndex, buildIndex);

  });
}

setInterval(SWStats, 1000 * 60 * 60 * 2);
SWStats();

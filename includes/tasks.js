'use strict';

// tasks for workers

var dict = require('./dictionary');
var logger = require('winston');

// database
var db_Replay = require('../models/replay');
var db_Stat = require('../models/stat');

var winLossObject = function(name){
  this.Name = name;
  this.Wins = 0;
  this.Losses = 0;
}

function createHeroStatistics(build, gametype){

  var Id = build * 10 + gametype;

  // structure of statistics object
  var stats = {
    Id: Id,
    Build: build,
    GameType: gametype,
    Time: Date.now(),
    SampleSize: 0,
    Heroes: {}
  };
  for(var i in dict.heroes){
    stats.Heroes[i] = {
      Hero: i,
      GamesPicked: 0,
      Wins: 0,
      Losses: 0,
      Maps: {},
      FriendlyMatchups: {},
      EnemyMatchups: {},
      Talents: [{}, {}, {}, {}, {}, {}, {}],
    }
    if(gametype !== 6) stats.Heroes[i].GamesBanned = 0;
    for(var j in dict.heroes){
      if(j !== i){
        stats.Heroes[i].FriendlyMatchups[j] = new winLossObject(j);
        stats.Heroes[i].EnemyMatchups[j] = new winLossObject(j);
      }
    }
    for(var j in dict.maps)
      stats.Heroes[i].Maps[j] = new winLossObject(j);
  }

  return new Promise(function(resolve, reject){

    // look through all replays of the relevant build
    db_Replay.find({Build: build, GameType: gametype}).exec(function(err, replays){
      if(err) return logger.log('info', err.message);

      for(var i = 0, j = replays.length; i < j; i++){ // i = replay index
        var r = replays[i];
        stats.SampleSize++;

        for(var k = 0, l = r.Players.length; k < l; k++){ // k = player index

          var p = r.Players[k];
          var h = stats.Heroes[p.Hero];
          var category = r.WinningTeam === p.Team ? 'Wins' : 'Losses';
          h.GamesPicked++;

          // increment matchups and check for mirror match
          var mirrorMatch = false;
          for(var m = 0; m < l; m++){ // m = player matchup index
            if(m !== k){
              var matchup = r.Players[m];
              if(matchup.Hero === p.Hero){
                mirrorMatch = true;
              } else {
                h[p.Team === matchup.Team ? 'FriendlyMatchups' : 'EnemyMatchups'][matchup.Hero][category]++;
              }
            }
          }

          if(!mirrorMatch){
            h[category]++;
            h.Maps[r.MapName][category]++;
            for(var m = 0; m < 7; m++){ // m = talent
              var t = p['Tier' + m + 'Talent'];
              var talentTier = h.Talents[m];
              if(!h.Talents[m][t]) h.Talents[m][t] = new winLossObject(t);
              h.Talents[m][t][category]++;
            }
          } else {
            h.GamesPicked -= 0.5; // when iterating over both players in mirror match, becomes -1 (prevents double counting)
          }
        }

        // add ban information
        if(gametype !== 6){
          if(r.Draft.Team0Ban1.length > 0) stats.Heroes[dict.heroByAttr(r.Draft.Team0Ban1)].GamesBanned++;
          if(r.Draft.Team0Ban2.length > 0) stats.Heroes[dict.heroByAttr(r.Draft.Team0Ban2)].GamesBanned++;
          if(r.Draft.Team1Ban1.length > 0) stats.Heroes[dict.heroByAttr(r.Draft.Team1Ban1)].GamesBanned++;
          if(r.Draft.Team1Ban2.length > 0) stats.Heroes[dict.heroByAttr(r.Draft.Team1Ban2)].GamesBanned++;
        }
      }

      // convert objects to arrays
      for(var i in stats.Heroes){
        var h = stats.Heroes[i];
        h.Maps = dict.objectToArray(h.Maps);
        h.EnemyMatchups = dict.objectToArray(h.EnemyMatchups);
        h.FriendlyMatchups = dict.objectToArray(h.FriendlyMatchups);
        for(var j = 0, k = h.Talents.length; j < k; j++){
          h.Talents[j] = dict.objectToArray(h.Talents[j]);
        }
      }
      stats.Heroes = dict.objectToArray(stats.Heroes);

      db_Stat.findOneAndUpdate({
        Id: Id,
      }, stats, {upsert: true}, function(err){
        if(err){
          logger.log('info', err.message);
          return reject();
        }
        logger.log('info', 'Finished generating statistics: Build ' + build + ' / GameType ' + gametype);
        resolve();
      });

    });

  });

}
module.exports.createHeroStatistics = createHeroStatistics;

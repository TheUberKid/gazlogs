'use strict';

var logger = require('winston');
var db_Replay = require('../models/replay');
var db_Statistic = require('../models/statistic');

// count number of replays a user has been in
function countReplaysWithUser(battletag, callback){

  db_Replay.count({
    Players: {
      $elemMatch: {
        BattleTag: battletag
      }
    }
  }).
  exec(function(err, n){
    if(err) logger.log('info', '[QUERY] error: ' + err);
    if(callback) callback(n);
  });
}
module.exports.countReplaysWithUser = countReplaysWithUser;

// load all replays a user has been in
function getReplaysByUser(battletag, page, callback){
  if(!page) page = 0;
  db_Replay.aggregate([{
    $match: {
      Players: {
        $elemMatch: {
          BattleTag: battletag
        }
      }
    }
  },{
    $project: {
      _id: 0,
      Id: 1,
      Build: 1,
      MapName: 1,
      GameType: 1,
      WinningTeam: 1,
      GameLength: 1,
      TimePlayed: 1,
      Players: {
        $map: {
          input: {
            $filter: {
              input: '$Players',
              as: 'c',
              cond: {
                $eq: [
                  '$$c.BattleTag', battletag
                ]
              }
            }
          },
          as: 'c',
          in: {
            Hero: '$$c.Hero',
            Team: '$$c.Team',
            MVP: '$$c.MVP'
          }
        }
      }
    }
  }]).
  sort({TimePlayed: -1}).
  limit(20).
  skip(page * 20).
  exec(function(err, replays){
    if(err) logger.log('info', '[QUERY] error: ' + err.message);
    if(callback) callback(replays);
  });
}
module.exports.getReplaysByUser = getReplaysByUser;

function getReplay(id, callback){
  db_Replay.findOne({
    Id: id.replace('n', '-')
  }).
  exec(function(err, replay){
    if(err) logger.log('info', '[QUERY] error: ' + err.message);
    if(callback) callback(replay);
  })
}
module.exports.getReplay = getReplay;

function getBuilds(callback){
  db_Statistic.distinct('Build').
  exec(function(err, builds){
    builds = builds.sort(function(a, b){return b - a});
    if(err) logger.log('info', '[QUERY] error: ' + err.message);
    if(callback) callback(builds);
  });
}
module.exports.getBuilds = getBuilds;

function getSitewideStatistics(build, gametype, callback){
  db_Statistic.findOne({
    Id: build * 10 + gametype
  }).
  select({
    '_id': 0,
    'Heroes._id': 0,
    'Heroes.Maps': 0,
    'Heroes.Talents': 0,
    'Heroes.FriendlyMatchups': 0,
    'Heroes.EnemyMatchups': 0
  }).
  exec(function(err, stat){
    if(err) callback(err);
    if(callback) callback(stat);
  });
}
module.exports.getSitewideStatistics = getSitewideStatistics;

function getHeroStatistics(build, gametype, hero, callback){
  db_Statistic.aggregate([{
    $match: {
      Build: build,
      GameType: gametype,
      Heroes: {
        $elemMatch: {
          Hero: hero
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      Time: 1,
      SampleSize: 1,
      Heroes: {
        $map: {
          input: {
            $filter: {
              input: '$Heroes',
              as: 'c',
              cond: {
                $eq: [
                  '$$c.Hero', hero
                ]
              }
            }
          },
          as: 'c',
          in: {
            Hero: '$$c.Hero',
            GamesPicked: '$$c.GamesPicked',
            GamesBanned: '$$c.GamesBanned',
            Wins: '$$c.Wins',
            Losses: '$$c.Losses',
            Maps: '$$c.Maps',
            Talents: '$$c.Talents',
            FriendlyMatchups: '$$c.FriendlyMatchups',
            EnemyMatchups: '$$c.EnemyMatchups'
          }
        }
      }
    }
  }]).exec(function(err, stat){
    if(err) callback(err);
    if(callback) callback(stat[0]);
  });
}
module.exports.getHeroStatistics = getHeroStatistics;

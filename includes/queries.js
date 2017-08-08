var logger = require('winston');
var db_Replay = require('../models/replay');

// count number of replays a user has been in
function countReplaysWithUser(auth, callback){
  db_Replay.count({
    Players: {
      $elemMatch: {
        Name: auth.username,
        BattleTag: auth.battletag
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
function getReplaysByUser(auth, page, callback){
  if(!page) page = 0;
  db_Replay.aggregate([
    {
      $match: {
        Players: {
          $elemMatch: {
            Name: auth.username,
            BattleTag: auth.battletag
          }
        }
      }
    },
    {
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
                    '$$c.BattleTag', auth.battletag
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
      if(err) logger.log('info', '[QUERY] error: ' + err);
      if(callback) callback(replays);
    });
}
module.exports.getReplaysByUser = getReplaysByUser;

function getReplay(id, callback){
  db_Replay.findOne({
    Id: id.replace('n', '-')
  }).
  exec(function(err, replay){
    if(err) logger.log('info', '[QUERY] error: ' + err);
    if(callback) callback(replay);
  })
}
module.exports.getReplay = getReplay;

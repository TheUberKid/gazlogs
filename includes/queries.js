var logger = require('winston');
var db_Replay = require('../models/replay');

// count number of replays a user has been in
function countReplaysWithUser(battletag, callback){
  db_Replay.count({'Players.BattleTag': battletag}).
  exec(function(err, n){
    if(err) logger.log('info', '[QUERY] error: ' + err);
    if(callback) callback(n);
  });
}
module.exports.countReplaysWithUser = countReplaysWithUser;

// load all replays a user has been in
function getReplaysByUser(battletag, page, callback){
  if(!page) page = 0;
  db_Replay.aggregate([
    {
      '$match': {
        'Players.BattleTag': battletag
      }
    },
    {
      '$project': {
        '_id': 0,
        'Build': 1,
        'MapName': 1,
        'GameType': 1,
        'WinningTeam': 1,
        'GameLength': 1,
        'TimePlayed': 1,
        'Players': {
          '$map': {
            'input': {
              '$filter': {
                'input': '$Players',
                'as': 'c',
                'cond': {
                  '$eq': [
                    '$$c.BattleTag', battletag
                  ]
                }
              }
            },
            'as': 'c',
            'in': {
              'Hero': '$$c.Hero',
              'Team': '$$c.Team',
              'MVP': '$$c.MVP'
            }
          }
        }
      }
    }]).
    sort({'TimePlayed': -1}).
    limit(20).
    skip(page * 20).
    exec(function(err, replays){
      if(err) logger.log('info', '[QUERY] error: ' + err);
      if(callback) callback(replays);
    });
}
module.exports.getReplaysByUser = getReplaysByUser;

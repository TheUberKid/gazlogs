var logger = require('winston');
var db_Replay = require('../models/replay');

// load all replays a user has been in
function getReplaysByUser(battletag, page){
  if(!page) page = 0;
  var res;
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
        'Team0Level': 1,
        'Team1Level': 1,
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
              'SoloKill': '$$c.SoloKill',
              'Assists': '$$c.Assists',
              'Deaths': '$$c.Deaths',
              'MVP': '$$c.MVP'
            }
          }
        }
      }
    }]).
    limit(20).
    skip(page * 20).
    sort('-TimePlayed').
    exec(function(err, replays){
      if(err) logger.log('info', '[QUERY] error: ' + err)
      res = replays;
    });
    return res;
}
module.exports.getReplaysByUser = getReplaysByUser;

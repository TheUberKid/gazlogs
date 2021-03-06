'use strict';

var recentReplaysList = document.getElementById('recent-replays-list');

var res = '';
for(var i = 0, j = params.replays.length; i < j; i++){
  var p = params.replays[i];
  var GameLength = Math.floor(p.GameLength / (16 * 60)) + ':' + (Math.round(p.GameLength / 16) % 60).pad(2);
  var TimePlayed = Math.floor((Date.now() - p.TimePlayed) / (1000 * 60 * 60 * 24));
  TimePlayed = TimePlayed === 0 ? 'Today' : TimePlayed + ' Day' + (TimePlayed > 1 ? 's' : '') + ' Ago';
  var Result = p.WinningTeam === p.Players[0].Team ? 'Victory' : 'Defeat';
  var Hero = p.Players[0].Hero;
  if(altNames[Hero]) Hero = altNames[Hero].PrimaryName;

  res += '<div class="row ' + Result + ' replay" data-replayid="' + p.Id.toString().replace('-', 'n') + '">';
  res += '<div class="item replayBuild">' + p.Build + '</div>';
  res += '<div class="item replayGameType">' + gameTypes[p.GameType] + '</div>';
  res += '<div class="item replayResult">' + Result + '</div>';
  res += '<div class="item replayMapName">' + p.MapName + '</div>';
  res += '<div class="item replayHero">' + Hero + '</div>';
  res += '<div class="item replayGameLength">' + GameLength + '</div>';
  res += '<div class="item replayTimePlayed">' + TimePlayed + '</div>';
  res += '</div>';
}
recentReplaysList.innerHTML = res;

var replays = document.getElementsByClassName('replay');
for(var i in replays)
  if(replays[i].children) replays[i].addEventListener('click', function(){
    window.location.href = '/replay/' + this.dataset.replayid;
  });

var mapBanner = document.getElementById('map-banner');
var map = document.getElementById('map');
var gametype = document.getElementById('gametype');
var date = document.getElementById('date');
var build = document.getElementById('build');
var region = document.getElementById('region');
var duration = document.getElementById('duration');
var team0level = document.getElementById('team0level');
var team1level = document.getElementById('team1level');
var team0bar = document.getElementById('level-blue');
var team1bar = document.getElementById('level-red');
var team0players = document.getElementById('team0players')
var team1players = document.getElementById('team1players')

var timePlayed = new Date(params.TimePlayed);

mapBanner.style.backgroundImage = ('url("/img/mapbanners/' + params.MapName + '.jpg")');
map.innerHTML = params.MapName;
gametype.innerHTML = fullGametypes[params.GameType];
date.innerHTML = timePlayed.getUTCDate() + ' ' + months[timePlayed.getMonth()] + ' ' + timePlayed.getFullYear();
build.innerHTML = params.Build;
region.innerHTML = regions[params.Region];
duration.innerHTML = Math.floor(params.GameLength / (16 * 60)) + ':' + (Math.round(params.GameLength / 16) % 60).pad(2);
team0level.innerHTML = params.Team0Level;
team1level.innerHTML = params.Team1Level;
team0bar.style.flexGrow = params.Team0Level - 5;
team1bar.style.flexGrow = params.Team1Level - 5;

// players
var resArr = ['', ''];
for(var i in params.Players){
  var res = '';
  var p = params.Players[i];

  var Hero = p.Hero;
  if(altNames[Hero]) Hero = altNames[Hero];
  var BattleTag = p.BattleTag.split('#')[0];

  res += '<div class="row team' + p.Team + ' player" data-battletag="' + p.BattleTag + '">';
  res += '<div class="item replayHero">' + Hero + '</div>';
  res += '<div class="item replayBattleTag">' + p.BattleTag.split('#')[0] + '</div>';
  if(p.MVP) res += '<div class="item replayMVP"> MVP </div>'
  res += '</div>';

  resArr[p.Team === 0 ? 0 : 1] += res;
}
team0players.innerHTML = resArr[0];
team1players.innerHTML = resArr[1];

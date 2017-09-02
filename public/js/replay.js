'use strict';

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
var draft = document.getElementById('replay-draft');
var team0ban1 = document.getElementById('team0ban1');
var team0ban2 = document.getElementById('team0ban2');
var team1ban1 = document.getElementById('team1ban1');
var team1ban2 = document.getElementById('team1ban2');
var team0players = document.getElementById('team0players');
var team1players = document.getElementById('team1players');
var playerDetailsList = document.getElementById('player-details-list');

mapBanner.style.backgroundImage = ('url("/img/mapbanners/' + params.MapName.toLowerCase() + '.jpg")');
map.innerHTML = params.MapName;
gametype.innerHTML = fullGameTypes[params.GameType];
date.innerHTML = getDate(params.timePlayed);
build.innerHTML = params.Build;
region.innerHTML = regions[params.Region];
duration.innerHTML = Math.floor(params.GameLength / (16 * 60)) + ':' + (Math.round(params.GameLength / 16) % 60).pad(2);
team0level.innerHTML = params.Team0Level;
team1level.innerHTML = params.Team1Level;
team0bar.style.flexGrow = params.Team0Level - 5;
team1bar.style.flexGrow = params.Team1Level - 5;

// draft
if(params.Draft){
  var d = params.Draft;
  draft.style.display = 'block';
  team0ban1.innerHTML = d.Team0Ban1.length > 0 ? altNames[heroByAttr(d.Team0Ban1)].PrimaryName : 'None';
  team0ban2.innerHTML = d.Team0Ban2.length > 0 ? altNames[heroByAttr(d.Team0Ban2)].PrimaryName : 'None';
  team1ban1.innerHTML = d.Team1Ban1.length > 0 ? altNames[heroByAttr(d.Team1Ban1)].PrimaryName : 'None';
  team1ban2.innerHTML = d.Team1Ban2.length > 0 ? altNames[heroByAttr(d.Team1Ban2)].PrimaryName : 'None';
}

function addReplayStat(label, value){
  return '<div class="stat"><span class="label">' + label + '</span><span class="value">' + value + '</span></div>';
}

// find top scores in each team (for MVP calculations);
var topStats = {
  HeroDamage: [0, 0, 0],
  SiegeDamage: [0, 0, 0],
  Healing: [0, 0, 0],
  ExperienceContribution: [0, 0, 0],
  DamageTaken: [0, 0, 0]
}
for(var i=0, j=params.Players.length; i<j; i++){
  var p = params.Players[i];
  for(var k in p)
    if(topStats[k] && p[k] > topStats[k][p.Team]){
      topStats[k][p.Team] = p[k];
      if(topStats[k] && p[k] > topStats[k][2])
        topStats[k][2] = p[k];
    }
}

function formatTalent(hero, name){
  if(name.length === 0) return 'None';
  name = name.replace(hero, '');
  for(var i = 0, j = universalKeywords.length; i < j; i++)
    name = name.replace(universalKeywords[i], '');
  var res = '';
  if(heroSpecificKeywords[hero])
    for(var i = 0, j = heroSpecificKeywords[hero].length; i < j; i++)
      name = name.replace(heroSpecificKeywords[hero][i], '');
  for(var i = 0, j = name.length; i < j; i++)
    res += (name.charCodeAt(i) < 97 ? ' ' : '') + name[i];
  return res;
}

// players
var resArr = ['', '', ''];
for(var i = 0, j = params.Players.length; i < j; i++){
  var res = '';
  var p = params.Players[i];

  var Hero = p.Hero;
  if(altNames[Hero]) Hero = altNames[Hero].PrimaryName;
  var BattleTag = p.BattleTag.split('#')[0];

  var MVPscore = p.SoloKill;
  MVPscore += p.Assists * ((p.Hero === 'LostVikings' || p.Hero === 'Abathur') ? 0.75 : 1);
  MVPscore += (p.TimeSpentDead / params.GameLength) * 100 * ((p.Hero === 'Murky' || p.Hero === 'Gall') ? -1 : p.Hero === 'Cho' ? -0.85 : -0.5);
  if(topStats.HeroDamage[p.Team] === p.HeroDamage) MVPscore += 1;
  if(topStats.HeroDamage[2] === p.HeroDamage) MVPscore += 1;
  if(topStats.SiegeDamage[p.Team] === p.SiegeDamage) MVPscore += 1;
  if(topStats.SiegeDamage[2] === p.SiegeDamage) MVPscore += 1;
  if(topStats.Healing[p.Team] === p.Healing && p.Healing === topStats.Healing[2]) MVPscore += 1;
  if(topStats.ExperienceContribution[p.Team] === p.ExperienceContribution) MVPscore += 1;
  if(topStats.ExperienceContribution[2] === p.ExperienceContribution) MVPscore += 1;
  if(altNames[p.Hero].Group === 'Warrior' && topStats.DamageTaken[p.Team] === p.DamageTaken) MVPscore += 0.5;
  if(altNames[p.Hero].Group === 'Warrior' && topStats.DamageTaken[2] === p.DamageTaken) MVPscore += 1;
  if(p.Team === params.WinningTeam) MVPscore += 2;
  if(topStats.SiegeDamage[0] !== topStats.SiegeDamage[1]) MVPscore += 2 * (p.SiegeDamage / topStats.SiegeDamage[2]);
  if(topStats.HeroDamage[0] !== topStats.HeroDamage[1]) MVPscore += 2 * (p.HeroDamage / topStats.HeroDamage[2]);
  MVPscore += 2 * (p.ExperienceContribution / topStats.ExperienceContribution[2]);
  if(altNames[p.Hero].Group === 'Support') MVPscore += (p.Healing / topStats.Healing[2]);
  if(altNames[p.Hero].Group === 'Warrior') MVPscore += (p.DamageTaken / topStats.DamageTaken[2]);

  res += '<div class="row team' + p.Team + ' player" data-battletag="' + p.BattleTag + '">';
  res += '<div class="item replayHero">' + Hero + '</div>';
  res += '<div class="item replayBattleTag">' + BattleTag + '</div>';
  if(p.MVP) res += '<div class="item replayMVP"> MVP </div>'
  res += '</div>';

  resArr[p.Team] += res;

  res = '';
  res += '<div class="playerDetails" id="details' + p.BattleTag + '">';
  res += '<div class="replay-player-heading team' + p.Team + '">' + BattleTag + ' / ' + Hero + '</div>';
  res += '<div class="stat-table">';
  res += addReplayStat('kills', p.SoloKill);
  res += addReplayStat('assists', p.Assists);
  res += addReplayStat('deaths', p.Deaths);
  res += '</div><div class="stat-table">';
  if(p.Healing > 0 || p.SelfHealing === 0) res += addReplayStat('healing', p.Healing);
  if(p.SelfHealing > 0) res += addReplayStat('self healing', p.SelfHealing);
  res += addReplayStat('exp contribution', p.ExperienceContribution);
  res += addReplayStat('mvp score', MVPscore.toFixed(2));
  res += '</div><div class="replay-player-subheading">Damage Breakdown</div><div class="stat-table">';
  res += addReplayStat('hero damage', p.HeroDamage);
  res += addReplayStat('total siege damage', p.SiegeDamage);
  res += addReplayStat('damage taken', p.DamageTaken);
  res += '</div><div class="stat-table">';
  res += addReplayStat('structure damage', p.StructureDamage);
  res += addReplayStat('minion damage', p.MinionDamage);
  res += addReplayStat('creep damage', p.CreepDamage);
  res += addReplayStat('summon damage', p.SummonDamage);
  res += '</div><div class="replay-player-subheading">Teamfight Statistics</div><div class="stat-table">';
  res += addReplayStat('tf hero damage', p.TeamfightHeroDamage);
  res += addReplayStat('tf damage taken', p.TeamfightDamageTaken);
  res += addReplayStat('tf healing', p.TeamfightHealingDone);
  res += '</div><div class="stat-table">';
  res += addReplayStat('tf escapes', p.TeamfightEscapesPerformed);
  res += addReplayStat('outnumbered deaths', p.OutnumberedDeaths);
  res += addReplayStat('highest kill streak', p.HighestKillStreak);
  res += '</div><div class="replay-player-subheading"> Talents </div><div class="stat-table">';
  res += addReplayStat('level 1', formatTalent(p.Hero, p.Tier1Talent));
  res += addReplayStat('level 4', formatTalent(p.Hero, p.Tier2Talent));
  res += addReplayStat('level 7', formatTalent(p.Hero, p.Tier3Talent));
  res += addReplayStat('level 10', formatTalent(p.Hero, p.Tier4Talent));
  res += addReplayStat('level 13', formatTalent(p.Hero, p.Tier5Talent));
  res += addReplayStat('level 16', formatTalent(p.Hero, p.Tier6Talent));
  res += addReplayStat('level 20', formatTalent(p.Hero, p.Tier7Talent));
  res += '</div><div class="replay-player-subheading">Other</div><div class="stat-table">';
  res += addReplayStat('time spent dead', p.TimeSpentDead + 's');
  res += addReplayStat('time silencing enemies', p.TimeSilencingEnemyHeroes + 's');
  res += addReplayStat('time rooting enemies', p.TimeRootingEnemyHeroes + 's');
  res += addReplayStat('time stunning enemies', p.TimeStunningEnemyHeroes + 's');
  res += '</div><div class="stat-table">';
  res += addReplayStat('clutch heals', p.ClutchHealsPerformed);
  res += addReplayStat('escaped deaths', p.EscapesPerformed);
  res += addReplayStat('vengeance kills', p.VengeancesPerformed);
  res += '</div></div>';

  resArr[2] += res;
}
team0players.innerHTML = resArr[0];
team1players.innerHTML = resArr[1];
playerDetailsList.innerHTML = resArr[2];

var players = document.getElementsByClassName('player');
var playerDetails = document.getElementsByClassName('playerDetails');

for(var i in players)
  if(players[i].children)
    players[i].addEventListener('click', function(e){
      for(var j in players)
        if(players[j].children)
          players[j].className = players[j].className.replace(' selected', '');
      this.className += ' selected';
      for(var j in playerDetails)
        if(playerDetails[j].nodeType > 0) playerDetails[j].className = 'playerDetails';
      document.getElementById('details' + this.dataset.battletag).className = 'playerDetails selected';
  });

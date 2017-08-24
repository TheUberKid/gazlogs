'use strict';

var date = document.getElementById('date');
var gametype = document.getElementById('gametype');
var build = document.getElementById('build');
var buildList = document.getElementById('build-list');
var updated = document.getElementById('updated');
var statisticsTable = document.getElementById('statistics-table');
var statistics = document.getElementById('statistics');
var fixedLabels = document.getElementById('fixed-labels');

date.innerHTML = getDate();

function checkScroll(){
  fixedLabels.style.display = document.body.scrollTop > 220 ? 'block' : 'none';
}
window.addEventListener('scroll', checkScroll);
checkScroll();

var buildListHTML = '';
for(var i = 0, j = 8; i < j; i++){
  var b = params.BuildList[i];
  if(b != null){
    buildListHTML += '<div class="item build" data-build=' + b + '>';
    buildListHTML += (i === 0 ? '(Latest) ' : '') + 'Build ' + b;
    buildListHTML += '</div>';
  }
}
buildList.innerHTML = buildListHTML;

var gametypeSelect = document.getElementsByClassName('gametype');
var buildSelect = document.getElementsByClassName('build');
for(var i in gametypeSelect)
  if(gametypeSelect[i].children) gametypeSelect[i].addEventListener('click', function(){
    params.GameType = this.dataset.gametype;
    statisticsTable.className = statisticsTable.className.replace(' complete', '');
    queryStatistics();
  });
for(var i in buildSelect)
  if(buildSelect[i].children) buildSelect[i].addEventListener('click', function(){
    params.Build = this.dataset.build;
    statisticsTable.className = statisticsTable.className.replace(' complete', '');
    queryStatistics();
  });

function queryStatistics(){
  gametype.innerHTML = fullGameTypes[params.GameType];
  build.innerHTML = params.Build;

  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if(req.readyState == XMLHttpRequest.DONE){
      showStatistics(JSON.parse(req.responseText));
    }
  }
  req.open('GET', '/api/statistics?gametype=' + params.GameType + '&build=' + params.Build, true);
  req.send();
}

queryStatistics();

function showStatistics(statRes){
  statRes.Heroes.sort(function(a, b){
    var aWR = a.GamesPicked === 0 ? -1 : (a.Wins / (a.Wins + a.Losses));
    var bWR = b.GamesPicked === 0 ? -1 : (b.Wins / (b.Wins + b.Losses));
    if(aWR === bWR){
      aWR = a.GamesPicked;
      bWR = b.GamesPicked;
    }
    return bWR - aWR;
  });

  var res = '';
  for(var i = 0, j = statRes.Heroes.length; i < j; i++){
    var p = statRes.Heroes[i];
    if(p.GamesBanned == null) p.GamesBanned = 0;

    var Hero = p.Hero;
    if(altNames[Hero]) Hero = altNames[Hero].PrimaryName;
    var PickRate = statRes.SampleSize === 0 ? 'no data' : (p.GamesPicked / statRes.SampleSize * 100).toFixed(1) + '%';
    var BanRate = statRes.SampleSize === 0 ? 'no data' : (p.GamesBanned / statRes.SampleSize * 100).toFixed(1) + '%';
    var WinRate = p.GamesPicked === 0 ? 'no data' : (p.Wins / (p.Wins + p.Losses) * 100).toFixed(1) + '%';

    res += '<div class="row hero" data-hero="' + p.Hero + '">';
    res += '<div class="item statHero">' + Hero + '</div>';
    res += '<div class="item statWinRate">' + WinRate + '</div>';
    res += '<div class="item statPickRate">' + PickRate + '</div>';
    res += '<div class="item statBanRate">' + BanRate + '</div>';
    res += '<div class="item statGamesWon">' + p.Wins + '</div>';
    res += '<div class="item statGamesPicked">' + p.GamesPicked + '</div>';
    res += '<div class="item statGamesBanned">' + p.GamesBanned + '</div>';
    res += '</div>';
  }
  statistics.innerHTML = res;
  statisticsTable.className += ' complete';
  updated.innerHTML = getTimeSince(statRes.Time) + ' ago';

  var hero = document.getElementsByClassName('hero');
  for(var i in hero)
    if(hero[i].children) hero[i].addEventListener('click', function(){
      window.location.href = '/statistics/hero/' + this.dataset.hero + '?gametype=' + params.GameType + '&build=' + params.Build;
    });
}

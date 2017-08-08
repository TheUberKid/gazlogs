var gametype = document.getElementById('gametype');
var date = document.getElementById('date');
var build = document.getElementById('build');
var region = document.getElementById('region');
var duration = document.getElementById('duration');
var team0level = document.getElementById('team0level');
var team1level = document.getElementById('team1level');
var team0bar = document.getElementById('level-blue');
var team1bar = document.getElementById('level-red');

var timePlayed = new Date(params.TimePlayed);

gametype.innerHTML = fullGametypes[params.GameType];
date.innerHTML = timePlayed.getUTCDate() + ' ' + months[timePlayed.getMonth()] + ' ' + timePlayed.getFullYear();
build.innerHTML = params.Build;
region.innerHTML = regions[params.Region];
duration.innerHTML = Math.floor(params.GameLength / (16 * 60)) + ':' + (Math.round(params.GameLength / 16) % 60).pad(2);
team0level.innerHTML = params.Team0Level;
team1level.innerHTML = params.Team1Level;
team0bar.style.flexGrow = params.Team0Level - 5;
team1bar.style.flexGrow = params.Team1Level - 5;

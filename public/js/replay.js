var replayDate = document.getElementById('replay-date');

var timePlayed = new Date(params.TimePlayed);
replayDate.innerHTML = timePlayed.getUTCDate() + ' ' + months[timePlayed.getMonth()] + ' ' + timePlayed.getFullYear();

var uploader = 'https://localhost:3000';

Number.prototype.format = function(r){
  if(!r) r = '&#8198;';
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, r);
}

var ubox = document.getElementById('upload-box');
var ulabel = document.getElementById('upload-label');
var dragbox = document.getElementById('file-drag-box');
var fileList = document.getElementById('file-display');
var modalWrapper = document.getElementById('modals');
var modals = document.getElementsByClassName('modal');
var modalUpload = document.getElementById('upload-modal');
var modalLogin = document.getElementById('login-modal');
var modalDontCare = document.getElementById('modal-dontcare');
var modalUploadIcon = document.getElementsByClassName('modal-load-icon');
var modalUploadSpinner = document.getElementById('modal-load-spinner');
var modalUploadComplete = document.getElementById('modal-load-complete');
var modalUploadError = document.getElementById('modal-load-error');
var modalUploadTable = document.getElementById('modal-upload-table');
var modalUploadResults = document.getElementById('upload-results');
var modalUploadDoubloonTotal = document.getElementById('modal-upload-doubloon-total');
var modalUploadReplayTotal = document.getElementById('modal-upload-replay-total');
var modalUploadReplayS = document.getElementById('modal-upload-replay-petty-s');
var gazloweQuoteWrapper = document.getElementById('gazlowe-quote-wrapper');
var gazloweQuote = document.getElementById('gazlowe-quote');
var modalSignOutForm = document.getElementById('modal-upload-form');
var modalSignOut = document.getElementById('modal-upload-accept');
var uProgress = document.getElementById('modal-load-above');
var uName = document.getElementById('modal-load-below');
ubox.addEventListener('change', submitLoginCheck);

var upload;
var doesUserCare = true;
var responseTable = {
  0: ['Error', '#833', 0],
  1: ['Duplicate', '#bb3', 0],
  2: ['Training', '#bb3', 0],
  3: ['Versus AI', '#bb3', 0],
  4: ['Brawl', '#bb3', 0],
  5: ['Unranked', '#383', 100],
  6: ['Quick Match', '#383', 50],
  7: ['Hero League', '#383', 100],
  8: ['Team League', '#383', 125]
};

var gazloweQuotes = {
  nothing: [
    "Kid, I hate to break it to ya, but you're a huge disappointment.",
    "Well, I don't know how, but ya did it. You gave me absolutely nothin'.",
    "Hey, time is money, and kid, you're wasting my time! Get back to work!"
  ],
  bad: [
    "Not the best parts I've seen, but uh, I'll take it.",
    "Whaddya think this is, a pawn shop!? Well, I guess it kinda is...",
    "What is this, a replay for ants? It needs to be at least... three times bigger than this!",
    "Keep it quick, kid! I ain't got all day!"
  ],
  good: [
    "You done good, kid. Keep it up!",
    "Uh, yeah, sure, whatever. Just leave 'em right here.",
    "Take these doubloons, it's the least I could do to repay ya."
  ],
  great: [
    "Haha! Cha-ching! We're back in business, boys!",
    "Oh, man! It's a miracle! We're gonna be rich!"
  ]
}
var signOuts = {
  nothing: "Sorry, I'll try harder next time",
  bad: "Back to Work",
  good: "Thanks!",
  great: "Hell yeah!"
}

var socket, update;

var starttime, elapsed;

// check if user is logged in to show warning
function submitLoginCheck(){
  if(params.loggedIn || !doesUserCare){
    submitFiles();
  } else {
    openModal(modalLogin);
  }
}
modalDontCare.addEventListener('click', function(){
  closeModals();
  setTimeout(submitFiles, 450);
  doesUserCare = false;
})

// submit files
function submitFiles(){
  upload = {
    state: 0,
    progress: 0,
    done: 0,
    total: ubox.files.length,
    display: 0,
    results: [],
    displayResults: []
  };
  upload.results.length = Object.keys(responseTable).length;
  upload.results.fill(0);
  upload.displayResults.length = Object.keys(responseTable).length;
  upload.displayResults.fill(0);
  uploadStatusIcon(0);

  openModal(modalUpload);

  var form = new FormData();
  for(var i=0, j=ubox.files.length; i<j; i++){
    form.append('replay'+i, ubox.files[i]);
  }
  if(params.loggedIn) form.append('ultoken', params.ultoken);

  var req = new XMLHttpRequest();
  req.open('POST', uploader, true);

  req.onreadystatechange = function(){
    if(req.readyState == XMLHttpRequest.DONE){
      if(req.responseText !== 'nofile'
      && req.responseText !== 'error'){
        console.log(req.responseText);
        poll(req.responseText);
      } else {
        uploadError(req.responseText != 'error' ? req.responseText : '');
      }
    }
  }
  req.onerror = uploadError;
  req.upload.addEventListener('progress', function(e){
    upload.progress = e.loaded/e.total;
  });

  req.send(form);
  update = setInterval(uploadUpdate, 50);
}

// poll a socket for results
function poll(path){
  socket = io.connect(uploader);
  socket.emit('pollPath', path);

  socket.on('fileProgress', function(status){
    upload.done = status.length;
    for(var i=0, j=status.length; i<j; i++) upload.results[status[i]]++;
    if(upload.done >= upload.total) socket.disconnect();
  });

  socket.on('fileComplete', function(progress, res){
    upload.done = progress;
    upload.results[res]++;
    if(upload.done >= upload.total) socket.disconnect();
  });

  socket.on('disconnect', function(){
    socket.disconnect();
  });
}

function uploadUpdate(){

  // display results below
  var resHTML = '';
  var totalDoubloons = 0;
  var totalReplays = 0;

  // this for loop setup is kinda weird but it's done so that the results are iterated and listed in order
  // since objects (such as the responseTable) are inherently orderless
  var keys = Object.keys(responseTable).sort(function(a, b){return b-a});
  for(var h=0, j=keys.length; h<j; h++){
    var i = keys[h];

    var res = upload.results[i];
    var dres = upload.displayResults[i];
    if(dres < res) upload.displayResults[i] += Math.ceil((res - dres) / 5);

    if(upload.displayResults[i] > 0){

      if(responseTable[i][2] > 0){

        totalDoubloons += upload.displayResults[i] * responseTable[i][2];
        totalReplays += upload.displayResults[i];
        resHTML += '<div class="row" style="box-shadow: inset 3px 0 0 '
                + responseTable[i][1]
                + '"><div class="item">'
                + responseTable[i][0]
                + '</div><div class="item hover-hide">'
                + (upload.displayResults[i] * responseTable[i][2]).format() + ' <div class="coin" aria-hidden="true"></div>'
                + '</div><div class="item hover-reveal">'
                + upload.displayResults[i].format() + ' x ' + responseTable[i][2] + ' <div class="coin" aria-hidden="true"></div>'
                + '</div></div>';

      } else {

        resHTML += '<div class="row worthless" style="box-shadow: inset 3px 0 0 '
                + responseTable[i][1]
                + '"><div class="item">'
                + responseTable[i][0]
                + '</div><div class="item">'
                + upload.displayResults[i].format() + ' x 0'
                + '</div></div>';
      }
    }
  }

  modalUploadDoubloonTotal.innerHTML = totalDoubloons.format();
  modalUploadReplayTotal.innerHTML = totalReplays.format();
  modalUploadResults.innerHTML = resHTML;
  modalUploadReplayS.innerHTML = totalReplays === 1 ? '' : 's';

  if(upload.state === 0 && upload.progress === 1){
    upload.state = 1;
    upload.display = 0;
    starttime = Date.now();
  }

  // update the progress display
  var n = upload.state === 0 ? Math.floor(upload.progress * ubox.files.length) : upload.done;
  if(upload.display < n) upload.display += Math.ceil((n-upload.display) / 5);
  if(upload.done < upload.total || upload.display < upload.done){
    uProgress.innerHTML = (upload.state === 0 ? 'uploading ' : 'processing ') + upload.display + ' / ' + upload.total;
    uName.innerHTML = (ubox.files.length > 1 ? ubox.files[upload.display].name : ubox.files[0].name).replace(/\.stormreplay/ig, '');;
  } else {

    uProgress.innerHTML = 'processed ' + upload.total + ' / ' + upload.total;
    uName.innerHTML = 'Jobs done!';
    modalUploadTable.className = 'modal-table complete';
    gazloweQuoteWrapper.className = 'gazlowe-quote-wrapper complete';
    modalSignOutForm.className = 'modal-form complete';

    var quotes, out;
    if(totalDoubloons === 0){
      quotes = gazloweQuotes.nothing;
      out = signOuts.nothing;
    } else if(totalDoubloons <= 200){
      quotes = gazloweQuotes.bad;
      out = signOuts.bad;
    } else if(totalDoubloons <= 2000){
      quotes = gazloweQuotes.good;
      out = signOuts.good;
    } else {
      quotes = gazloweQuotes.great;
      out = signOuts.great;
    }

    gazloweQuote.innerHTML = quotes[Math.floor(Math.random()*quotes.length)];
    modalSignOut.innerHTML = out;

    uploadStatusIcon(1);
    clearInterval(update);
    elapsed = Date.now()-starttime;
    console.log('Finished in '+elapsed+'ms');

  }

}

// display an upload error on the modal
function uploadError(err){
  uploadStatusIcon(2);
  clearInterval(update);
  uProgress.innerHTML = 'Upload Error';
  if(typeof err === String) uName.innerHTML = err;
}

// change the icon for upload status, and text colors
function uploadStatusIcon(code){

  for(var i=0, j=modalUploadIcon.length; i<j; i++) modalUploadIcon[i].style.display = 'none';

  switch(code){
    case 1:
      modalUploadComplete.style.display = 'block';
      modalUploadComplete.style.width = '0px';
      uProgress.style.color = '#383';
      uName.style.color = '#383';
      setTimeout(function(){modalUploadComplete.style.width = '80px';}, 100);
      break;
    case 2:
      modalUploadError.style.display = 'block';
      uProgress.style.color = '#833';
      uName.style.color = '#833';
      break;
    default:
      modalUploadSpinner.style.display = 'block';
      uProgress.style.color = '#338';
      uName.style.color = '#338';
  }

}

// check for when a user is dropping a file
var xhr = new XMLHttpRequest();
if(xhr.upload){
  document.body.addEventListener('dragover', bodyFileHover);
  document.body.addEventListener('dragleave', bodyFileHover);
	dragbox.addEventListener('dragover', dropFileHover);
  dragbox.addEventListener('dragleave', dropFileHover);
	dragbox.addEventListener('drop', dropFile);
}

function bodyFileHover(e){
  dragbox.className = (e.type == 'dragover' ? 'enter' : '');
}
function dropFileHover(e){
  e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == 'dragover' ? 'hover' : '');
}

function dropFile(e){
  dropFileHover(e);
  ubox.files = e.target.files || e.dataTransfer.files;
}

function openModal(m){
  modalWrapper.style.zIndex = 99;
  modalWrapper.style.opacity = 1;
  m.style.display = 'block';
  m.style.opacity = 1;
}
function closeModals(){
  setTimeout(function(){
    modalWrapper.style.zIndex = -2;
    modalUploadTable.className = 'modal-table';
    gazloweQuoteWrapper.className = 'gazlowe-quote-wrapper';
    modalSignOutForm.className = 'modal-form';
    for(var i=0, j=modals.length; i<j; i++){
      modals[i].scrollTop = 0;
      modals[i].style.opacity = 0;
      modals[i].style.display = 'none';
    }
  }, 400);
  modalWrapper.style.opacity = 0;
}
var modalExit = document.getElementsByClassName('modal-exit');
for(var i=0, j=modalExit.length; i<j; i++){
  modalExit[i].addEventListener('click', closeModals);
}

window.addEventListener('resize', onResize);
function onResize(){
  if(window.innerWidth < 1300){
    document.getElementById('gazlowe').style.display = 'none';
  } else {
    document.getElementById('gazlowe').style.display = 'block';
  }
}
onResize();

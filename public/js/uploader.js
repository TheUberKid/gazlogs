var ubox = document.getElementById('upload-box');
var ulabel = document.getElementById('upload-label');
var dragbox = document.getElementById('file-drag-box');
var fileList = document.getElementById('file-display');
var modalWrapper = document.getElementById('modals');
var modalUpload = document.getElementById('upload-modal');
var modalUploadIcon = document.getElementsByClassName('modal-load-icon');
var modalUploadSpinner = document.getElementById('modal-load-spinner');
var modalUploadComplete = document.getElementById('modal-load-complete');
var modalUploadError = document.getElementById('modal-load-error');
var modalUploadTable = document.getElementById('modal-upload-table');
var modalUploadResults = document.getElementById('upload-results');
var uProgress = document.getElementById('modal-load-above');
var uName = document.getElementById('modal-load-below');
ubox.addEventListener('change', submitFiles);

var upload;
var responseTable = [
  ['Error', '#833'],
  ['Success', '#383']
];

var socket, update;

var starttime, elapsed;

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

  modalWrapper.style.zIndex = 99;
  modalWrapper.style.opacity = 1;

  var form = new FormData();
  for(var i=0, j=ubox.files.length; i<j; i++){
    form.append('replay'+i, ubox.files[i]);
  }

  var req = new XMLHttpRequest();
  req.open('POST', 'http://localhost:3000', true);

  req.onreadystatechange = function(){
    if(req.readyState == XMLHttpRequest.DONE){
      if(req.responseText !== 'nofile'
      && req.responseText !== 'error'){
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

  starttime = Date.now();
  console.log('Start time: ' + starttime);
}

// poll a socket for results
function poll(path){
  socket = io.connect('http://localhost:3000');
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
  // update the progress display
  var n = upload.state === 0 ? Math.floor(upload.progress * ubox.files.length) : upload.done;
  if(upload.display < n) upload.display += Math.ceil((n-upload.display) / 5);
  if(upload.done < upload.total || upload.display < upload.done){
    uProgress.innerHTML = (upload.state === 0 ? 'uploading ' : 'processing ') + upload.display + ' / ' + upload.total;
    uName.innerHTML = ubox.files[upload.display].name;
  } else {
    uProgress.innerHTML = 'processed ' + upload.total + ' / ' + upload.total;
    uName.innerHTML = 'Jobs done!';
    modalUploadTable.className = 'modal-table complete';
    uploadStatusIcon(1);
    clearInterval(update);
    elapsed = Date.now()-starttime;
    console.log('Finished in '+elapsed+' milliseconds');
  }
  if(upload.state === 0 && upload.progress === 1){
    upload.state = 1;
    upload.display = 0;
  }

  // display results below
  var resHTML = '';
  for(var i=upload.displayResults.length-1; i>-1; i--){
    var res = upload.results[i];
    var dres = upload.displayResults[i];
    if(dres < res) upload.displayResults[i] += Math.ceil((res - dres) / 5);

    if(dres > 0){
      resHTML += '<div class="row"><div class="item">'
              + responseTable[i][0]
              + '</div><div class="item">'
              + upload.displayResults[i]
              + '</div></div>';
    }
  }
  modalUploadResults.innerHTML = resHTML;
}

// display an upload error on the modal
function uploadError(err){
  uploadStatusIcon(2);
  uProgress.innerHTML = 'Upload Error';
  uName.innerHTML = (err ? 'err: '+err : 'unknown error');
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

function closeModals(){
  setTimeout(function(){
    modalWrapper.style.zIndex = -2;
    modalUploadTable.className = 'modal-table';
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

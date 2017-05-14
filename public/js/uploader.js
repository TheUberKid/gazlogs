var ubox = document.getElementById('upload-box');
var ulabel = document.getElementById('upload-label');
var dragbox = document.getElementById('file-drag-box');
var fileList = document.getElementById('file-display');
ubox.addEventListener('change', submitFiles);

// submit files
function submitFiles(){
  var form = new FormData();

  for(var i in ubox.files){
    form.append('replay'+i, ubox.files[i]);
  }

  var req = new XMLHttpRequest();
  req.open('POST', '/upload');
  req.send(form);
}

// poll upload and processing progress
function polling(){

}

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

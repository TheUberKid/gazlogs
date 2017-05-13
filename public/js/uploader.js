var ubox = document.getElementById('upload-box');
var ulabel = document.getElementById('upload-label');
var dragbox = document.getElementById('file-drag-box');
var fileList = document.getElementById('file-display');
ubox.addEventListener('change', updateFiles);

function updateFiles(){
  if(ubox.files){
    var newContent = '';
    for(var i=0, j=ubox.files.length; i<j; i++){
      newContent += '<div class="file">' + ubox.files[i].name + '</div>';
    }
    fileList.innerHTML = newContent;
  }
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
  updateFiles();
}

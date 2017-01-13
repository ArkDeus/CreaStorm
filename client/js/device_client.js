var socket = io('/DeviceService');

// ##############
// UPLOAD SECTION
// ##############
var fileInput = document.querySelector('#file'),
    progress = document.querySelector('#progress');
    uploadButton = document.querySelector('#upload');
    tags = document.querySelector('#tags');
    fileData = "";
    img = new Image();
    imgWidth;
    imgHeight;

function createJson(){

  fileData += "{"
              +"url:" + fileInput.value + ","
              +"type: image,"
              +"width:" + imgWidth + ","
              +"height:" + imgHeight + ","
              +"tags:" + tags.tagsinput("value")
              + "}";
}

fileInput.onchange = function(){
  img.onload = function(){
    imgWidth = img.width;
    imgHeight = img.height;
  }
}


uploadButton.onchange = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/file');

    xhr.upload.onprogress = function(e) {
        progress.value = e.loaded;
        progress.max = e.total;
    };

    xhr.onload = function() {
        console.log('Upload complete!');
    };

    var form = new FormData();
    form.append('file', fileInput.files[0]);
    form.append('imgJson', fileData);
    xhr.send(form);
};
var socket = io('/DeviceService');
$.getScript("tags-input/bootstrap-tagsinput.js", function(){

    console.log('tagsinput loaded');

});
// ##############
// UPLOAD SECTION
// ##############
var fileInput = document.querySelector('#fileInput'),
    progress = document.querySelector('#progress'),
    uploadButton = document.querySelector('#upload'),
    tags = document.querySelector('#tags'),
    fileData = "",
    img,
    imgWidth,
    imgHeight;

function createJson(values){

  fileData += '{ "url": "'+ fileInput.value + '",'
              +'"type": "image",'
              +'"width": "'+ imgWidth + '",'
              +'"height": "'+ imgHeight + '",'
              +'"tags": [';
  for( var i = 0; i<values.length-1;i++){
    fileData += '"'+values[i]+'",';
  }
  fileData+= '"'+values[length-1]+'"]}';
}

fileInput.onchange = function(){
  img = new Image();
  img.onload = function(){
    imgWidth = img.width;
    imgHeight = img.height;
  }
  console.log('imageupload')
}


function uploadFiles(values) {


    createJson(values);

    console.log(fileData);

    var formData = new FormData();
    formData.append('file', fileInput.files[0]);

    $.ajax({
        url: '/DeviceService',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        xhr: function() {
            // create an XMLHttpRequest
            var xhr = new XMLHttpRequest();

            // listen to the 'progress' event
            xhr.upload.addEventListener('progress', function(evt) {

                if (evt.lengthComputable) {
                    // calculate the percentage of upload completed
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);

                    // update the Bootstrap progress bar with the new percentage
                    $('#progress').text(percentComplete + '%');
                    $('#progress').width(percentComplete + '%');

                    // once the upload reaches 100%, set the progress bar text to done
                    if (percentComplete === 100) {
                        $('#progress').html('Done');
                    }

                }
                socket.emit('addToJson',fileData);

            }, false);

            return xhr;
        }
    });
};
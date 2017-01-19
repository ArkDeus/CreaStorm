var socket = io('/DeviceService');

var fileInput = document.querySelector('#fileInput'),
    progress = document.querySelector('#progress'),
    uploadButton = document.querySelector('#upload'),
    tags = document.querySelector('#tags'),
    fileData = "",
    img,
    imgWidth,
    imgHeight,
    projectsList = [];

//crée un nouveau projet
function createProject(){
    var projectName = prompt("New project name:");
    if(projectName != null){
        socket.emit('createProject',projectName);
        updateProjectsList();
    }
}

//demande au serveur la liste des projets
function updateProjectsList(){
    socket.emit("getAllProjects");
    console.log('update');
}

//mets à jour l'affichage des projets
function displayProjectsList(){
    var sel = document.getElementById('projects');
    while(sel.firstChild){
        sel.removeChild(sel.firstChild);
    }
    projectsList.forEach(function(projectName,index){
        var opt = document.createElement('option');
        opt.innerHTML = projectName[0];
        opt.value = projectName[0];
        sel.appendChild(opt);
    })
    console.log('display');
}

//met à jour la liste des projets si le projet a bien été créé, et s'il n'existe pas déjà
socket.on('returnCreated',function(isCreated){
   if(isCreated.code != 'EEXIST'){
        updateProjectsList();
        alert('The project was successfully created');
   } else{
       alert('A project already has the same name');
   }
});

//reçoit la liste des projets par le serveur et mets à jour l'affichage
socket.on("returnGetAll",function(answer){
    projectsList = answer;
    displayProjectsList();
    console.log('updated');
});

//crée un objet json avec les données de l'image
function createJson(values){

  fileData += '{ "url": "'+ fileInput.value + '",'
              +'"type": "image",'
              +'"width": "'+ imgWidth + '",'
              +'"height": "'+ imgHeight + '",'
              +'"tags": [';
  for( var i = 0; i<values.length-1;i++){
    fileData += '"'+values[i]+'",';
  }
  fileData+= '"'+values[values.length-1]+'"]}';
}

//ne marche pas actuellement (censé récupérer les dimensions de l'image
fileInput.onchange = function(){
  img = new Image();
  img.onload = function(){
    imgWidth = img.width;
    imgHeight = img.height;
  }
  console.log('imageupload')
}

//upload l'image dans le projet correspondant et met à jour le fichier json du projet
function uploadFiles(values) {


    createJson(values);

    console.log(fileData);

    var formData = new FormData();
    formData.append('file', fileInput.files[0]);

    socket.emit('projectName',document.getElementById('projects').value);

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

                socket.emit('addToJson', fileData);

            }, false);

            return xhr;
        }
    });
};
var socket = io('/DeviceService');

var fileInput = document.querySelector('#fileInput'),
    progress = document.querySelector('#progress'),
    uploadButton = document.querySelector('#upload'),
    tags = document.getElementById('tags'),
    fileData = "",
    imgWidth,
    imgHeight,
    projectsList = [],
    menu = document.getElementById('menu'),
    tagsList,
    projects = document.getElementById('projects'),
    project,
    projectJson,
    viewProjectJson,
    projectImages = document.getElementById('projectsImages'),
    viewProject = document.getElementById('checkProjects');
window.URL = window.URL || window.webkitURL;


// ajout de la classe JS à HTML
document.querySelector("html").classList.add('js');

window.onload = function(){
    updateProjectsList();
    displayProjectsList('projects');
    displayProjectsList('checkProjects');
}

viewProject.onchange = function(){
    getViewProjectJson(this.value);
}

function getProjectJson(project){
    socket.emit('getProjectJson', project);
}

function getViewProjectJson(project){
    socket.emit('getViewProjectJson', project);
}

projects.onchange = function(){
    console.log('selectChange');
    project = projects.value;
    getProjectJson(project);
}

socket.on('returnProjectJson',function (answer, project) {
    projectJson = answer;
    displayTags(projectJson['tags']);
});

socket.on('returnViewProjectJson', function(answer, project){
    viewProjectJson = answer;
    displayProjectsImages();
});

function displayProjectsImages(){
    var images = viewProjectJson.medias;
    while(projectImages.firstChild){
        projectImages.removeChild(projectImages.firstChild);
    }
    for(var i = 0; i < images.length; i++){
        console.log(images[i].url);
        var currentImgRow = document.createElement('div');
        currentImgRow.id = images[i].url;
        currentImgRow.className = "imgRow";
        var currentImg = document.createElement('img');
        currentImg.src = 'Projects/'+viewProject.value +'/'+images[i].url;
        currentImg.className = "img-responsive";
        currentImgRow.appendChild(currentImg);
        projectImages.appendChild(currentImgRow);
    }
}

function displayTags(values){
    while(tags.firstChild){
        tags.removeChild(tags.firstChild);
    }
    for(tag in values){
        var newTag = document.createElement('p');
        newTag.innerHTML = values[tag];
        newTag.id = values[tag];
        newTag.className = 'tag';
        newTag.setAttribute('picked',false);
        newTag.setAttribute('onclick', 'pickTag("'+ values[tag] + '")');
        tags.appendChild(newTag);
    }
}

function pickTag(id){
    if(document.getElementById(id).getAttribute('picked') == "true"){
        document.getElementById(id).setAttribute('picked', false);
        console.log('unpick');
    }else{
        document.getElementById(id).setAttribute('picked', true);
        console.log('pick');
    }
}

menu.onclick = function (event) {
        var sectionToShow = "";
        for (var i = 0; i < this.children.length; i++) {
            sectionToShow = this.children[i].firstChild.attributes.getNamedItem('href').value.slice(1);
            if (this.children[i].firstChild === event.target) {
                this.children[i].className = "active";
                if (sectionToShow != "") {
                    document.getElementById(sectionToShow).hidden = false;
                }
            } else {
                this.children[i].className = "";
                if (sectionToShow != "") {
                    document.getElementById(sectionToShow).hidden = true;
                }
            }
        }
        if (window.innerWidth < 768) {
            $('#myNavbar').collapse("toggle");
        }
    }


//crée un nouveau projet
function createProject(){
    var projectName = document.getElementById('projectName').value;
    var projectTags = $('#projectTags').tagsinput('items');
    var projectDirectories = $('#projectDirectories').tagsinput('items');
    var projectJson = '{"name": ' + '"' + projectName + '",'
                    + '"tags": [';

    for( var i = 0; i<projectTags.length-1;i++){
        projectJson += '"'+projectTags[i]+'",';
    }

    projectJson+= '"'+projectTags[projectTags.length-1]+'"],' +
        '"directories": [';

    for( var i = 0; i<projectDirectories.length-1;i++){
        projectJson += '"'+projectDirectories[i]+'",';
    }

    projectJson+= '"'+projectDirectories[projectDirectories.length-1]+'"],' +
        '"medias": []}';


    if(projectName != null){
        socket.emit('createProject',projectName, projectJson, projectDirectories);
    }



    console.log(projectName);
    console.log(projectTags);
    console.log(projectDirectories);
    console.log(projectJson);
}

//demande au serveur la liste des projets
function updateProjectsList(){
    socket.emit("getAllProjects");
    console.log('update');
}

//mets à jour l'affichage des projets
function displayProjectsList(id){
    var sel = document.getElementById(id);
    while(sel.firstChild){
        sel.removeChild(sel.firstChild);
    }
    projectsList.forEach(function(projectName,index){
        var opt = document.createElement('option');
        opt.innerHTML = projectName[0];
        opt.value = projectName[0];
        sel.appendChild(opt);
    })
    if(projectsList.length > 0){
        getProjectJson(projectsList[0][0]);
    }
    console.log('display');
}

//met à jour la liste des projets si le projet a bien été créé, et s'il n'existe pas déjà
socket.on('returnCreated',function(isCreated){
   if(isCreated.code != 'EEXIST'){
        updateProjectsList();
        alert('The project was successfully created');
        fileData = "";
        getProjectJson(viewProject.value);
   } else{
       alert('A project already has the same name');
   }
});

//reçoit la liste des projets par le serveur et mets à jour l'affichage
socket.on("returnGetAll",function(answer){
    projectsList = answer;
    displayProjectsList('projects');
    displayProjectsList('checkProjects');
    console.log('updated');
});

//crée un objet json avec les données de l'image
function createJson(){

  fileData = '{ "url": "'+ fileInput.value + '",'
              +'"type": "image",'
              +'"width": "'+ imgWidth + '",'
              +'"height": "'+ imgHeight + '",'
              +'"tags": [';
  var children = tags.children;
  var pickedTags = [];
  for(var i = 0; i < children.length; i++){
      console.log(children[i].id);
      if(children[i].getAttribute('picked') == "true"){
          pickedTags.push(children[i].id);
      };
  }
  console.log(pickedTags[0]);
  for(var i = 0; i < pickedTags.length-1; i++){
      fileData += '"' + pickedTags[i] + '",';
  }
  if(pickedTags.length > 0) {
      fileData += '"' + pickedTags[pickedTags.length - 1] + '"]}';
  }else{
      fileData+= ']}';
  }
}

//ne marche pas actuellement (censé récupérer les dimensions de l'image)
fileInput.onchange = function(){
   var file, img;
    if((file = this.files[0])){
        img = new Image();
        img.src= window.URL.createObjectURL(file);
        img.onload = function() {
            imgWidth = this.width;
            imgHeight = this.height;

            window.URL.revokeObjectURL( img.src );
        }
    }
}


//upload l'image dans le projet correspondant et met à jour le fichier json du projet
function uploadFiles() {

    createJson();

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
                console.log('addToJson');

            }, false);

            return xhr;
        }
    });
};

// initialisation des variables
var fileInput  = document.querySelector( ".input-file" ),
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");

// action lorsque la "barre d'espace" ou "Entrée" est pressée
button.addEventListener( "keydown", function( event ) {
    if ( event.keyCode == 13 || event.keyCode == 32 ) {
        fileInput.focus();
    }
});

// action lorsque le label est cliqué
button.addEventListener( "click", function( event ) {
    fileInput.focus();
    return false;
});

// affiche un retour visuel dès que input:file change
fileInput.addEventListener( "change", function( event ) {
    the_return.innerHTML = this.value;
});

document.querySelector('#upload').onclick = function(){
    uploadFiles();
}
var socket = io('/DeviceService');

var fileInput = document.querySelector('#fileInput'),
    projectIcon = document.querySelector('#projectIcon'),
    progress = document.querySelector('#progress'),
    uploadButton = document.querySelector('#upload'),
    tags = document.getElementById('tags'),
    fileData = "",
    imgWidth,
    imgHeight,
    projectsList = [],
    projectsJsonList = [],
    tagsList,
    project,
    projectJson,
    viewProjectJson,
    currentProjectName = document.getElementById('currentProjectName'),
    viewTags = document.getElementById('viewTags'),
    projectImages = document.getElementById('imgList'),
    viewProject = document.getElementById('checkProjects'),
    fileType;

window.URL = window.URL || window.webkitURL;


// ajout de la classe JS à HTML
document.querySelector("html").classList.add('js');

window.onload = function () {
    updateProjectsList();
    displayProjectsList();
}

function getProjectJson(project) {
    socket.emit('getProjectJson', project);
}

socket.on('returnProjectJson', function (answer, project) {
    projectJson = answer;
    displayTags(projectJson['tags'], tags);
});

socket.on('returnViewProjectJson', function (answer, project) {
    viewProjectJson = answer;
    displayTags(viewProjectJson['tags'], viewTags)
    displayProjectsImages();
});

function displayProjectsImages(project) {
    var medias = "";
    var json;
    currentProjectName.innerHTML = project;
    console.log(projectsJsonList);
    for (var i = 0; i < projectsJsonList.length; i++) {
        if (projectsJsonList[i].name == project) {
            json = projectsJsonList[i];
            break;
        }
    }

    medias = json.medias;

    while (projectImages.firstChild) {
        projectImages.removeChild(projectImages.firstChild);
    }
    for (var i = 0; i < medias.length; i++) {
        var currentMedia;

        if (medias[i].type.startsWith("audio")) {
            currentMedia = document.createElement('audio');
            currentMedia.setAttribute('controls', 'controls');
            currentMedia.innerHTML = medias[i].url;
        }
        if (medias[i].type.startsWith("image")) {
            currentMedia = document.createElement('img');
            currentMedia.className = "img-responsive";
        }
        if (medias[i].type.startsWith("video")) {
            currentMedia = document.createElement('video');
            currentMedia.setAttribute('controls', 'controls');
        }

        //currentMedia.className = 'col-xs-12 col-md-6';
        currentMedia.src = 'Projects/' + json.name + '/' + medias[i].url;


        var currentImgRow = document.createElement('div');
        currentImgRow.id = medias[i].url;
        currentImgRow.className = "imgRow col-xs-12 col-md-4 col-md-pull-left";
        currentImgRow.appendChild(currentMedia);

        projectImages.appendChild(currentImgRow);
    }
    console.log(currentProjectName.innerHTML + "_" + currentProjectName.value);
    document.getElementById('ViewProjects').hidden = true;
    document.getElementById('ProjectDetail').hidden = false;
}

function displayTags(values, span) {
    while (span.firstChild) {
        span.removeChild(span.firstChild);
    }

    for (tag in values) {
        var newTag = document.createElement('p');
        newTag.innerHTML = values[tag];
        newTag.id = values[tag];
        newTag.className = 'tag';
        newTag.setAttribute('picked', false);
        newTag.setAttribute('onclick', 'pickTag("' + values[tag] + '")');
        span.appendChild(newTag);
    }
}

function pickTag(id) {
    if (document.getElementById(id).getAttribute('picked') == "true") {
        document.getElementById(id).setAttribute('picked', false);
        console.log('unpick');
    } else {
        document.getElementById(id).setAttribute('picked', true);
        console.log('pick');
    }
}

/*menu.onclick = function (event) {
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
}*/


//crée un nouveau projet
function createProject() {
    var projectName = document.getElementById('projectName').value;
    var projectTags = $('#projectTags').tagsinput('items');
    var projectIconName = projectIcon.value.replace(/^.*[\\\/]/, '');
    var projectJson = '{"name": ' + '"' + projectName + '",' +
        '"iconUrl": "' + projectIconName + '",'
        + '"tags": [';

    for (var i = 0; i < projectTags.length - 1; i++) {
        projectJson += '"' + projectTags[i] + '",';
    }

    projectJson += '"' + projectTags[projectTags.length - 1] + '"],' +
        '"medias": []}';

    console.log("create: " + projectName);

    if (projectName != null) {
        socket.emit('createProject', projectName, projectJson);
        uploadFiles(projectName, projectIcon.files[0]);
        projectModal.style.display = "none";
    }

}

//demande au serveur la liste des projets
function updateProjectsList() {
    socket.emit("getAllProjects");
    console.log('update');
}


//mets à jour l'affichage des projets
function displayProjectsList() {
    var list = document.getElementById('projectsList');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    projectsJsonList.forEach(function (project, index) {
        console.log(index);
        var listElement = document.createElement('div');
        var projectImage = document.createElement('img');
        var projectName = document.createElement('p');
        var hr = document.createElement('hr');

        projectImage.src = "Projects/" + project.name + '/' + project.iconUrl;
        projectImage.className = "col-xs-4 img-responsive";

        projectName.innerHTML = project.name;
        projectName.className = 'col-xs-8 projectNames';

        listElement.id = project.name;
        listElement.className = 'projectElement row';
        listElement.setAttribute('onclick', "displayProjectsImages('" + project.name + "')");

        listElement.appendChild(projectImage);
        listElement.appendChild(projectName);

        list.appendChild(listElement);
        list.appendChild(hr);

    })
    if (projectsList.length > 0) {
        getProjectJson(projectsList[0][0]);
    }
    console.log('display');
}

//met à jour la liste des projets si le projet a bien été créé, et s'il n'existe pas déjà
socket.on('returnCreated', function (isCreated) {
    if (isCreated.code != 'EEXIST') {
        updateProjectsList();
        alert('The project was successfully created');
        fileData = "";
        projectModal.style.display = "none";
    } else {
        alert('A project already has the same name');
    }
});

//reçoit la liste des projets par le serveur et mets à jour l'affichage
socket.on("returnGetAll", function (names, jsonList) {
    projectsList = names;
    projectsJsonList = jsonList;
    displayProjectsList();
    if(currentProjectName.innerHTML != ""){
        displayProjectsImages(currentProjectName.innerHTML);
    }
    console.log('updated');
});

//crée un objet json avec les données de l'image
function createJson() {
    var filename = fileInput.value.replace(/^.*[\\\/]/, '');
    fileData = '{ "url": "' + filename + '",'
        + '"type": "' + fileType + '",'
        + '"width": "' + imgWidth + '",'
        + '"height": "' + imgHeight + '",'
        + '"tags": [';
    var children = tags.children;
    var pickedTags = [];
    for (var i = 0; i < children.length; i++) {
        console.log(children[i].id);
        if (children[i].getAttribute('picked') == "true") {
            pickedTags.push(children[i].id);
        };
    }
    console.log(pickedTags[0]);
    for (var i = 0; i < pickedTags.length - 1; i++) {
        fileData += '"' + pickedTags[i] + '",';
    }
    if (pickedTags.length > 0) {
        fileData += '"' + pickedTags[pickedTags.length - 1] + '"]}';
    } else {
        fileData += ']}';
    }
}

//ne marche pas actuellement (censé récupérer les dimensions de l'image)
fileInput.onchange = function () {
    var file, img;
    if ((file = this.files[0])) {
        img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = function () {
            imgWidth = this.width;
            imgHeight = this.height;
            window.URL.revokeObjectURL(img.src);
        }
    }
    fileType = this.files[0].type;
}

document.getElementById('projectName').oninput = function () {
    socket.emit('projectName', this.value);
}

//upload l'image dans le projet correspondant et met à jour le fichier json du projet
function uploadFiles(projectName, file) {

    socket.emit('projectName', projectName);

    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: '/DeviceService',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log('upload successful!\n' + data);
            alert('Upload Succesful !');
            displayProjectsImages(projectName);
        },
        xhr: function () {
            // create an XMLHttpRequest
            var xhr = new XMLHttpRequest();

            // listen to the 'progress' event
            xhr.upload.addEventListener('progress', function (evt) {

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

            }, false);

            return xhr;
        }
    });
};

// initialisation des variables
var fileInputButton = document.querySelector(".input-file"),
    button = document.querySelector(".input-file-trigger"),
    the_return = document.querySelector(".file-return");

// action lorsque la "barre d'espace" ou "Entrée" est pressée
button.addEventListener("keydown", function (event) {
    if (event.keyCode == 13 || event.keyCode == 32) {
        fileInputButton.focus();
    }
});

// action lorsque le label est cliqué
button.addEventListener("click", function (event) {
    fileInputButton.focus();
    return false;
});

// affiche un retour visuel dès que input:file change
fileInputButton.addEventListener("change", function (event) {
    the_return.innerHTML = this.value.replace(/^.*[\\\/]/, '');
});

document.querySelector('#upload').onclick = function () {
    createJson();
    uploadFiles(currentProjectName.innerHTML, fileInput.files[0]);
    console.log(currentProjectName.innerHTML);
    socket.emit('addToJson', fileData, currentProjectName.innerHTML);
    fileModal.style.display = "none";
    updateProjectsList();
    if(currentProjectName.innerHTML != ""){
        displayProjectsImages(currentProjectName.innerHTML);
    }
}


// Get the modal
var projectModal = document.getElementById('projectModal');
var fileModal = document.getElementById('fileModal');

// Get the button that opens the modal
var projectBtn = document.getElementById("addProject");
var fileBtn = document.getElementById("uploadFile");

// Get the <span> element that closes the modal
var projectSpan = document.getElementsByClassName("closeProject")[0];
var fileSpan = document.getElementsByClassName("closeFile")[0];

// When the user clicks on the button, open the modal
projectBtn.onclick = function () {
    projectModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
projectSpan.onclick = function () {
    projectModal.style.display = "none";
}



// When the user clicks on the button, open the modal
fileBtn.onclick = function () {
    fileModal.style.display = "block";
    displayTags(getProjectTags(currentProjectName.innerHTML), tags);
}

function getProjectTags(project) {
    for (var i = 0; i < projectsJsonList.length; i++) {
        if (projectsJsonList[i].name == project) {
            return projectsJsonList[i].tags;
        }
    }
}

// When the user clicks on <span> (x), close the modal
fileSpan.onclick = function () {
    fileModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == projectModal) {
        projectModal.style.display = "none";
    }
    if (event.target == projectModal) {
        fileModal.style.display = "none";
    }


}

document.getElementById('brand').onclick = function () {
    document.getElementById('ViewProjects').hidden = false;
    document.getElementById('ProjectDetail').hidden = true;
}
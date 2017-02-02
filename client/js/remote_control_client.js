var socket = io('/RemoteControl');

var projectName = "";

var getProjectsButton, displayListProject, listProjects;

socket.on('returnGetAll', function (value) {
	// clear the list
	listProjects.innerHTML = "";
	if (value.length > 0) {
		displayListProject.hidden = false;
		for (var i = 0; i < value.length; i++) {
			console.log(value[i]);
			var listElement = document.createElement('div');
			var projectImage = document.createElement('img');
			var projectName = document.createElement('span');
			var hr = document.createElement('hr');


			projectImage.src = value[i][2];
			projectImage.className = "col-xs-5 img-responsive";

			projectName.innerHTML = value[i][0] + " (" + value[i][1];
			if(value[i][1] < 2){
				projectName.innerHTML += " file)";
			}else{
				projectName.innerHTML += " files)";
			}
			projectName.className = 'col-xs-7 projectName';

			listElement.id = value[i][0];
			listElement.className = 'row';

			listElement.appendChild(projectImage);
			listElement.appendChild(projectName);
			listElement.onclick = function () {
				socket.emit('selectedProject', this.id);
				window.open('/RemoteControl/Manager', '_self');
			}

			listProjects.appendChild(listElement);
			listProjects.appendChild(hr);
		}
	} else {
		displayListProject.hidden = true;
		projectName = "";
	}
});



window.onload = function () {
	getProjectsButton = document.getElementById('get-projects');
	displayListProject = document.getElementById('display-list-projects');
	listProjects = document.getElementById('listProjects');

	getProjectsButton.onclick = function () {
		socket.emit('getAllProjects');
	}

	socket.emit('getAllProjects');
};
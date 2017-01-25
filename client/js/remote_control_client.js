var socket = io('/RemoteControl');

var projectName = "";

var getProjectsButton, displayListProject, listProjects, accessToSelectedProject;

socket.on('returnGetAll', function (value) {
	if (value.length > 0) {
		displayListProject.hidden = false;
		// clear the list
		listProjects.innerHTML = "";
		for (var i = 0; i < value.length; i++) {
			// create the title for the radio button
			var title = document.createElement('label');
			title.style = "margin-left : 5px;";
			if (value[i][1] > 1) {
				title.appendChild(document.createTextNode(value[i][0] + " (" + value[i][1] + " files)"));
			} else {
				title.appendChild(document.createTextNode(value[i][0] + " (" + value[i][1] + " file)"));
			}
			// create the radio button
			var input = document.createElement("input");
			input.type = "radio";
			input.name = "project";
			input.value = value[i][0];
			input.onchange = function () {
				projectName = this.value;
			}
			// check the first one by default
			if (i === 0) {
				projectName = value[i][0];
				input.checked = true;
			}
			listProjects.appendChild(input);
			listProjects.appendChild(title);
			listProjects.appendChild(document.createElement("br"));
		}
	} else {
		displayListProject.hidden = true;
		projectName = "";
	}
});



window.onload = function () {
	getProjectsButton = document.getElementById('get-projects');
	displayListProject = document.getElementById('display-list-projects');
	listProjects = document.getElementById('list-projects');
	accessToSelectedProject = document.getElementById('project-access');

	getProjectsButton.onclick = function () {
		socket.emit('getAllProjects');
	}

	accessToSelectedProject.onclick = function () {
		window.open('/RemoteControl/Manager', '_self');
		socket.emit('selectedProject', projectName);
	}

	socket.emit('getAllProjects');
};
var socket = io('/RemoteControl');

var projectTitle, projectNameTitle;
var disAll, disGif, disJpg, disNot;
var getProjectsButton, displayListProject, displayProjectError, listProjects;
var projectNameInput, createProjectButton;
var displayServerAnswer, serverAnswerError, serverAnswerSuccess, serverAnswerErrorMessage, serverAnswerSuccessMessage;

socket.on('returnCreated', function (value) {
	if (value != true) {
		displayServerAnswer.hidden = false;
		serverAnswerError.hidden = false;
		serverAnswerSuccess.hidden = true;
		if (value.code === "EEXIST") {
			serverAnswerErrorMessage.innerHTML = "The project already exists";
		} else {
			serverAnswerErrorMessage.innerHTML = value.code;
			console.log("There is a problem : " + value.code);
		}
	} else {
		displayServerAnswer.hidden = false;
		serverAnswerError.hidden = true;
		serverAnswerSuccess.hidden = false;
		serverAnswerSuccessMessage.innerHTML = "Successfully created";
	}
})

socket.on('returnGetAll', function (value) {
	if (value.length > 0) {
		displayListProject.hidden = false;
		displayProjectError.hidden = true;
		// clear the list
		listProjects.innerHTML = "";
		for (var i = 0; i < value.length; i++) {
			// create the title for the radio button
			var title = document.createElement('label');
			title.style = "margin-left : 5px;";
			if (value[i][1].length > 1) {
				title.appendChild(document.createTextNode(value[i][0] + " (" + value[i][1].length + " files)"));
			} else {
				title.appendChild(document.createTextNode(value[i][0] + " (" + value[i][1].length + " file)"));
			}
			// create the radio button
			var input = document.createElement("input");
			input.type = "radio";
			input.name = "project";
			input.value = value[i][0];
			input.onchange = function () {
				projectNameTitle.innerHTML = this.value;
			}
			// check the first one by default
			if (i === 0) {
				projectTitle.hidden = false;
				projectNameTitle.innerHTML = value[i][0];
				input.checked = true;
			}
			listProjects.appendChild(input);
			listProjects.appendChild(title);
			listProjects.appendChild(document.createElement("br"));
			// socket.emit('getProjectFiles', value[i][0]);
		}
	} else {
		displayListProject.hidden = true;
		displayProjectError.hidden = false;
		projectTitle.hidden = true;
	}
})

socket.on('returnGetFiles', function (value) {
	console.log(value);
})

window.onload = function () {
	projectTitle = document.getElementById('project-title');
	projectNameTitle = document.getElementById('project-name-title');

	disAll = document.getElementById("fancy-checkbox-all");
	disGif = document.getElementById("fancy-checkbox-gif");
	disJpg = document.getElementById("fancy-checkbox-jpg");
	disNot = document.getElementById("fancy-checkbox-nothing");

	getProjectsButton = document.getElementById('get-projects');
	displayListProject = document.getElementById('display-list-projects');
	displayProjectError = document.getElementById('display-project-error');
	listProjects = document.getElementById('list-projects');

	projectNameInput = document.getElementById("project-name-input");
	createProjectButton = document.getElementById('create-project');

	displayServerAnswer = document.getElementById('display-server-answer');
	serverAnswerError = document.getElementById('server-answer-error');
	serverAnswerSuccess = document.getElementById('server-answer-success');
	serverAnswerErrorMessage = document.getElementById('server-answer-error-message');
	serverAnswerSuccessMessage = document.getElementById('server-answer-success-message');

	projectNameInput.value = "";

	disAll.onchange = function () {
		if (disAll.checked) {
			disGif.checked = false;
			disJpg.checked = false;
			disNot.checked = false;
			socket.emit('displayAll');
		} else {
			disNot.checked = true;
			socket.emit('displayNothing');
		}
	};

	disGif.onchange = function () {
		if (disGif.checked) {
			disAll.checked = false;
			disJpg.checked = false;
			disNot.checked = false;
			socket.emit('displayGif');
		} else {
			disNot.checked = true;
			socket.emit('displayNothing');
		}
	};

	disJpg.onchange = function () {
		if (disJpg.checked) {
			disAll.checked = false;
			disGif.checked = false;
			disNot.checked = false;
			socket.emit('displayJpg');
		} else {
			disNot.checked = true;
			socket.emit('displayNothing');
		}
	};

	disNot.onchange = function () {
		if (disNot.checked) {
			disAll.checked = false;
			disGif.checked = false;
			disJpg.checked = false;
			socket.emit('displayNothing');
		} else {
			disAll.checked = true;
			socket.emit('displayAll');
		}
	};


	getProjectsButton.onclick = function () {
		socket.emit('getAllProjects');
	}

	createProjectButton.onclick = function () {
		if (projectNameInput.validity.valid) {
			socket.emit('createProject', projectNameInput.value);
		} else {
			displayServerAnswer.hidden = false;
			serverAnswerError.hidden = false;
			serverAnswerSuccess.hidden = true;
			serverAnswerErrorMessage.innerHTML = "The name can't be empty";
		}
	}
};
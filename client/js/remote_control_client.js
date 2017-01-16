var socket = io('/RemoteControl');

var productName = "CreaStorm";
var projectName = "";

var projectNameTitle;
var disAll, disGif, disJpg, disNot;
var getProjectsButton, displayListProject, displayProjectError, listProjects;
var projectNameInput, createProjectButton;
var displayServerAnswer, serverAnswerError, serverAnswerSuccess, serverAnswerErrorMessage, serverAnswerSuccessMessage;
var sidebarMenu;

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
				projectName = this.value;
				projectNameTitle.innerHTML = productName + " - " + projectName;
			}
			// check the first one by default
			if (i === 0) {
				projectName = value[i][0];
				projectNameTitle.innerHTML = productName + " - " + projectName;
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
	}
})

socket.on('returnGetFiles', function (value) {
	console.log(value);
})

window.onload = function () {
	projectNameTitle = document.getElementById('project-name-title');

	sidebarMenu = document.getElementById('sidebar-menu');

	disAll = document.getElementById("checkbox-all");
	disGif = document.getElementById("checkbox-gif");
	disJpg = document.getElementById("checkbox-jpg");
	disNot = document.getElementById("checkbox-nothing");

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

	projectNameTitle.innerHTML = productName;
	projectNameInput.value = "";

	sidebarMenu.onclick = function (event) {
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
	}

	disAll.onchange = function () {
		if (disAll.checked) {
			disGif.checked = false;
			disJpg.checked = false;
			disNot.checked = false;
			if (projectName.length > 0) {
				socket.emit('displayAll', projectName);
			}
		} else {
			disNot.checked = true;
			socket.emit('displayNothing');
		}
		socket.emit('tag', "costumes");
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
			if (projectName.length > 0) {
				console.log("emit");
				socket.emit('displayJpg', projectName, "jpeg");
			}
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
			if (projectNameInput.validity.tooShort) {
				serverAnswerErrorMessage.innerHTML = "The name is too short (min. 5 characters)";
			} else if (projectNameInput.validity.valueMissing) {
				serverAnswerErrorMessage.innerHTML = "The name can't be empty";
			} else {
				serverAnswerErrorMessage.innerHTML = "The name is invalid";
			}
		}
	}
};
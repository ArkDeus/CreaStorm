var socket = io('/RemoteControl');

socket.on('returnCreated', function (value) {
	if (value != true) {
		document.getElementById('display-server-answer').hidden = false;
		document.getElementById('server-answer-error').hidden = false;
		document.getElementById('server-answer-success').hidden = true;
		if (value.code === "EEXIST") {
			document.getElementById('server-answer-error-message').innerHTML = "The project already exists";
		} else {
			document.getElementById('server-answer').innerHTML = value.code;
			console.log("There is a problem : " + value.code);
		}
	} else {
		document.getElementById('display-server-answer').hidden = false;
		document.getElementById('server-answer-error').hidden = true;
		document.getElementById('server-answer-success').hidden = false;
		document.getElementById('server-answer-success-message').innerHTML = "Successfully created";
	}
})

socket.on('returnGetAll', function (value) {
	console.log(value);
	if (value.length > 0) {
		document.getElementById('display-list-project').hidden = false;
		document.getElementById('display-project-error').hidden = true;
		var form = document.getElementById("list-project");
		// clear the list
		form.innerHTML = "";
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
			// check the first one by default
			if (i === 0) {
				input.checked = true;
			}
			form.appendChild(input);
			form.appendChild(title);
			form.appendChild(document.createElement("br"));
			// socket.emit('getProjectFiles', value[i][0]);
		}
	} else {
		document.getElementById('display-list-project').hidden = true;
		document.getElementById('display-project-error').hidden = false;
	}
})

socket.on('returnGetFiles', function (value) {
	console.log(value);
})

window.onload = function () {
	var disAll = document.getElementById("fancy-checkbox-all");
	var disGif = document.getElementById("fancy-checkbox-gif");
	var disJpg = document.getElementById("fancy-checkbox-jpg");
	var disNot = document.getElementById("fancy-checkbox-nothing");

	document.getElementById("project-name").value = "";

	disAll.onchange = function () {
		console.log("displayAll = " + disAll.checked);
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
		console.log("displayGif = " + disGif.checked);
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
		console.log("displayJpg = " + disJpg.checked);
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
		console.log("displayNothing = " + disNot.checked);
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

	var getProjectsButton = document.getElementById('get-projects');
	getProjectsButton.onclick = function () {
		socket.emit('getAllProjects');
	}

	var createProjectButton = document.getElementById('create-project');
	createProjectButton.onclick = function () {
		var projectObj = document.getElementById('project-name');
		if (projectObj.validity.valid) {
			socket.emit('createProject', projectObj.value);
		} else {
			document.getElementById('display-server-answer').hidden = false;
			document.getElementById('server-answer-error').hidden = false;
			document.getElementById('server-answer-success').hidden = true;
			document.getElementById('server-answer-error-message').innerHTML = "The name can't be empty";
		}
	}
};
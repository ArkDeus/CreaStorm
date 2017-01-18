var socket = io('/RemoteControl');

var appWidth;

var productName = "CreaStorm";
var projectName = "";
var projectNameTitle;

var sidebarMenu;

var getProjectsButton, displayListProject, displayProjectError, listProjects;
var projectNameInput, createProjectButton;
var displayServerAnswer, serverAnswerError, serverAnswerSuccess, serverAnswerErrorMessage, serverAnswerSuccessMessage;

var disAll, disNot;
var disGif, disJpg, disPng, disMp3, disWma, disFlac, disWav, disMp4, disWmv, disAvi, disMkv;
var disImages, disVideos, disMusics;

var remoteControler, hammerControler;

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
});

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
			//socket.emit('getProjectFiles', value[i][0]);
		}
	} else {
		displayListProject.hidden = true;
		displayProjectError.hidden = false;
		projectName = "";
		projectNameTitle.innerHTML = productName;
	}
});

socket.on('filterResult', function (result) {
	console.log('result');
});

// socket.on('returnGetFiles', function (value) {
// 	console.log(value);
// })

window.onload = function () {
	appWidth = window.innerWidth;

	projectNameTitle = document.getElementById('project-name-title');

	sidebarMenu = document.getElementById('sidebar-menu');

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

	disAll = document.getElementById("checkbox-all");
	disNot = document.getElementById("checkbox-nothing");

	disGif = document.getElementById("checkbox-gif");
	disJpg = document.getElementById("checkbox-jpg");
	disPng = document.getElementById("checkbox-png");

	disMp3 = document.getElementById("checkbox-mp3");
	disWma = document.getElementById("checkbox-wma");
	disFlac = document.getElementById("checkbox-flac");
	disWav = document.getElementById("checkbox-wav");

	disMp4 = document.getElementById("checkbox-mp4");
	disWmv = document.getElementById("checkbox-wmv");
	disAvi = document.getElementById("checkbox-avi");
	disMkv = document.getElementById("checkbox-mkv");


	disImages = document.getElementById('checkbox-image');
	disVideos = document.getElementById('checkbox-video');
	disMusics = document.getElementById('checkbox-music');

	remoteControler = document.getElementById('remote-control');
	hammerControler = new Hammer(remoteControler);

	projectNameTitle.innerHTML = productName;
	projectNameInput.value = "";

	menuController();

	projectManagment();

	filterControl();

	remoteControl();
};

window.onresize = function () {
	if (appWidth !== window.innerWidth) {
		// if desktop open the left menu
		if (window.innerWidth >= 768) {
			$('#navbar').collapse("show");
		} else if (window.innerWidth < 768) { // else close it
			$('#navbar').collapse("toggle");
		}
		appWidth = window.innerWidth;
	}
};

function menuController() {
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
		if (window.innerWidth < 768) {
			$('#navbar').collapse("toggle");
		}
	}
};

function projectManagment() {
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


function filterControl() {
	var inputList = document.getElementsByTagName('input');
	for (var i = 0; i < inputList.length; i++) {
		if (inputList[i].type === "checkbox") {
			inputList[i].onchange = function () {
				doMagicTrick(this);
			}
		}
	}
};

function doMagicTrick(moved) {
	// manage general filter
	if (disAll === moved || disNot === moved) {
		// reverse if we want to hide
		if (disNot === moved) {
			disAll.checked = !disNot.checked;
		}
		// check or uncheck all types
		disImages.checked = disAll.checked; disMusics.checked = disAll.checked; disVideos.checked = disAll.checked;

		// check or uncheck all extension
		disGif.checked = disAll.checked; disJpg.checked = disAll.checked; disPng.checked = disAll.checked;
		disMp3.checked = disAll.checked; disWma.checked = disAll.checked; disFlac.checked = disAll.checked; disWav.checked = disAll.checked;
		disMp4.checked = disAll.checked; disWmv.checked = disAll.checked; disAvi.checked = disAll.checked; disMkv.checked = disAll.checked;

		// check or uncheck hidding everything
		disNot.checked = !disAll.checked;
	} else {
		if (disImages === moved) {
			// check or uncheck all images extension
			disGif.checked = disImages.checked; disJpg.checked = disImages.checked; disPng.checked = disImages.checked;
		} else if (disMusics === moved) {
			// check or uncheck all musics extension
			disMp3.checked = disMusics.checked; disWma.checked = disMusics.checked; disFlac.checked = disMusics.checked; disWav.checked = disMusics.checked;
		} else if (disVideos === moved) {
			// check or uncheck all videos extension
			disMp4.checked = disVideos.checked; disWmv.checked = disVideos.checked; disAvi.checked = disVideos.checked; disMkv.checked = disVideos.checked;
		} else {
			disImages.checked = !(!disGif.checked && !disJpg.checked && !disPng.checked);
			disMusics.checked = !(!disMp3.checked && !disWma.checked && !disFlac.checked && !disWav.checked);
			disVideos.checked = !(!disMp4.checked && !disWmv.checked && !disAvi.checked && !disMkv.checked);
		}
		disAll.checked = (disGif.checked && disJpg.checked && disPng.checked
			&& disMp3.checked && disWma.checked && disFlac.checked && disWav.checked
			&& disMp4.checked && disWmv.checked && disAvi.checked && disMkv.checked);
		disNot.checked = (!disGif.checked && !disJpg.checked && !disPng.checked
			&& !disMp3.checked && !disWma.checked && !disFlac.checked && !disWav.checked
			&& !disMp4.checked && !disWmv.checked && !disAvi.checked && !disMkv.checked);
	}
	extToFilter();
}

function extToFilter() {
	var extTab = [];

	// images
	if (disJpg.checked) { extTab.push("jpeg"); }
	if (disGif.checked) { extTab.push("gif"); }
	if (disPng.checked) { extTab.push("png"); }
	// musics
	if (disMp3.checked) { extTab.push("mpeg"); }
	if (disWma.checked) { extTab.push("x-ms-wma"); }
	if (disFlac.checked) { extTab.push("x-flac"); extTab.push("ogg"); }
	if (disWav.checked) { extTab.push("wav"); extTab.push("wave"); extTab.push("vnd.wave"); }
	// videos
	if (disMp4.checked) { extTab.push("mp4"); }
	if (disWmv.checked) { extTab.push("x-ms-wmv"); }
	if (disAvi.checked) { extTab.push("avi"); extTab.push("msvideo"); extTab.push("x-msvideo"); }
	if (disMkv.checked) { extTab.push("x-matroska"); }

	console.log(extTab);
}

function remoteControl() {
	hammerControler.on("swipeleft swiperight", function (ev) {
		if (ev.type === 'swipeleft') {
			socket.emit('goRight');
		} else {
			socket.emit('goLeft');
		}
	});
};
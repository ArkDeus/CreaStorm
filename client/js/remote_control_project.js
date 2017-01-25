var socket = io('/RemoteControl/Manager');

var onFullScreen = false;
var historyManager = 0;

var projectName, projectNameTitle;

var tabbarMenu;

var getProjectsButton, displayListProject, listProjects;

var disAll, disNot;
var disGif, disJpg, disPng, disMp3, disWma, disFlac, disWav, disMp4, disWmv, disAvi, disMkv;
var disImages, disVideos, disMusics;

var remoteControler, hammerControler;

socket.on('selectedProject', function (name) {
	projectName = name;
	projectNameTitle.innerHTML = name;

	socket.emit('getProjectTag');

	menuController();

	filterControl();

	remoteControl();
});

socket.on('projectTag', function (result) {
	console.log(result);
});

socket.on('filterResult', function (result) {
	var galleryDiv = document.getElementById('gallery');
	galleryDiv.innerHTML = "";
	var listOther = document.createElement('ul');
	for (var i = 0; i < result.length; i++) {
		for (var j = 0; j < result[i].length; j++) {
			var type = result[i][j][1].split("/")[0];
			if (type === "image") {
				var img = document.createElement("img");
				img.src = result[i][j][0];
				img.alt = result[i][j][0];
				img.style = "max-height:100px; max-width:200px; margin:15px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);";
				img.onclick = function () {
					onFullScreen = !onFullScreen;
					if (onFullScreen) {
						socket.emit('showFullScreen', this.alt);
					} else {
						socket.emit('closeFullScreen');
					}
				}
				galleryDiv.appendChild(img);
			} else {
				var li = document.createElement('li');
				li.innerHTML = result[i][j][0];
				listOther.appendChild(li);
			}
		}
	}
	if (listOther.children.length > 0) {
		galleryDiv.appendChild(listOther);
	}
});

window.onload = function () {
	appWidth = window.innerWidth;

	projectNameTitle = document.getElementById('project-name-title');

	tabbarMenu = document.getElementById('tabbar-menu');


	disAll = document.getElementById("checkbox-all"); disAll.checked = false;
	disNot = document.getElementById("checkbox-nothing"); disNot.checked = true;

	disGif = document.getElementById("checkbox-gif"); disGif.checked = false;
	disJpg = document.getElementById("checkbox-jpg"); disJpg.checked = false;
	disPng = document.getElementById("checkbox-png"); disPng.checked = false;

	disMp3 = document.getElementById("checkbox-mp3"); disMp3.checked = false;
	disWma = document.getElementById("checkbox-wma"); disWma.checked = false;
	disFlac = document.getElementById("checkbox-flac"); disFlac.checked = false;
	disWav = document.getElementById("checkbox-wav"); disWav.checked = false;

	disMp4 = document.getElementById("checkbox-mp4"); disMp4.checked = false;
	disWmv = document.getElementById("checkbox-wmv"); disWmv.checked = false;
	disAvi = document.getElementById("checkbox-avi"); disAvi.checked = false;
	disMkv = document.getElementById("checkbox-mkv"); disMkv.checked = false;


	disImages = document.getElementById('checkbox-image'); disImages.checked = false;
	disVideos = document.getElementById('checkbox-video'); disVideos.checked = false;
	disMusics = document.getElementById('checkbox-music'); disMusics.checked = false;

	remoteControler = document.getElementById('remote-control');
	hammerControler = new Hammer(remoteControler);

	socket.emit('getProjectName');
};

window.onhashchange = function(){
	console.log(historyManager);
	console.log(window.history.length);
	if(historyManager >= window.history.length){
		window.open('/RemoteControl', '_self');
	}else{
		historyManager = window.history.length;
	}
}

function menuController() {
	tabbarMenu.onclick = function (event) {
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
};



function filterControl() {
	var inputList = document.getElementsByTagName('input');
	for (var i = 0; i < inputList.length; i++) {
		if (inputList[i].type === "checkbox") {
			if (projectName.length < 5) {
				inputList[i].disabled = true;
			} else {
				inputList[i].disabled = false;
				inputList[i].onchange = function () {
					doMagicTrick(this);
				}
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

	socket.emit('applyFilter', extTab);
	socket.emit('tag', 'costumes');
}

function remoteControl() {
	hammerControler.on("swipeleft swiperight", function (ev) {
		if (projectName.length > 0) {
			if (ev.type === 'swipeleft') {
				socket.emit('goRight');
			} else {
				socket.emit('goLeft');
			}
		}
	});
};
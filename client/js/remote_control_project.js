var socket = io('/RemoteControl/Manager');

var onFullScreen = false;
var isPlaying = false;
var videoPlaying = false;
var audioRunning = false;
var historyManager = 0;
var count = 0;

var projectName, projectNameTitle;

var tabbarMenu;

var disAll, disNot;
var disGif, disJpg, disPng, disMp3, disWma, disFlac, disWav, disMp4, disWmv, disAvi, disMkv;
var disImages, disVideos, disMusics;

var tagFilterDiv, listSelectedTag = [];

var remoteControler, hammerControler, playButton, pauseButton;

var layoutSelect;

var selectedIndex, resultMedias = [];

socket.on('selectedProject', function (name) {
	projectName = name;
	projectNameTitle.innerHTML = name;

	socket.emit('getProjectTag');

	menuController();

	filterControl();

	remoteControl();

	layoutSelection();
});

socket.on('projectTag', function (result) {
	tagFilterDiv = document.getElementById('tag-filter').firstElementChild;
	for (var i = 0; i < result.length; i++) {
		var btnTag = document.createElement('button');
		btnTag.className = "btn-default btn active";
		btnTag.style = "margin:5px;";
		btnTag.value = result[i];
		btnTag.innerHTML = result[i];
		listSelectedTag.push(result[i]);
		btnTag.onclick = function () {
			if ($(this).hasClass("active")) {
				$(this).removeClass('active');
				listSelectedTag.splice(listSelectedTag.indexOf(this.value), 1);
			} else {
				$(this).addClass('active');
				listSelectedTag.push(this.value);
			}
			extToFilter();
		}
		tagFilterDiv.appendChild(btnTag);
	}
});

socket.on("resultMedias", function (result) {
	var galleryImageDiv = document.getElementById('galleryImage');
	var galleryAudioDiv = document.getElementById('galleryAudio');
	var galleryVideoDiv = document.getElementById('galleryVideo');
	var buttonCloseModal = document.getElementById('closeFullScreen');
	galleryImageDiv.innerHTML = "";
	galleryAudioDiv.innerHTML = "";
	galleryVideoDiv.innerHTML = "";

	if (result.length > 0) {
		buttonCloseModal.onclick = function () {
			onFullScreen = false;
			socket.emit('closeFullScreen');
			this.style.display = "none";
			controlMedia();
		}
	}

	var index = 0;
	resultMedias = [];

	for (var i = 0; i < result.length; i++) {
		var type = result[i].type.split("/")[0];
		if (type === "image") {
			var img = document.createElement("img");
			img.id = index++;
			img.src = result[i].url;
			img.alt = result[i].url;
			img.style = "max-height:100px; max-width:200px; margin:15px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);";
			img.onclick = function () {
				onFullScreen = true;
				selectedIndex = this.id;
				socket.emit('showFullScreen', this.alt);
				buttonCloseModal.style.display = "block";
			}
			galleryImageDiv.appendChild(img);
			resultMedias.push([result[i].url, 'image']);
		} else if (type === 'audio') {
			var btn = document.createElement("button");
			btn.value = result[i].url;
			btn.innerHTML = "play music";
			btn.style = "margin:15px;";
			btn.onclick = function () {
				if (!videoPlaying) {
					socket.emit('playAudio', this.value);
					videoPlaying = false;
					audioRunning = true;
					isPlaying = true;
					controlMedia();
				}
			}
			galleryAudioDiv.appendChild(btn);
		} else {
			var btn = document.createElement("button");
			btn.id = index++;
			btn.value = result[i].url;
			btn.innerHTML = "play video";
			btn.style = "margin:15px;";
			btn.onclick = function () {
				onFullScreen = true;
				selectedIndex = this.id;
				buttonCloseModal.style.display = "block";
				socket.emit('playVideo', this.value);
				videoPlaying = true;
				isPlaying = true;
				controlMedia();
			}
			galleryVideoDiv.appendChild(btn);
			resultMedias.push([result[i].url, 'video']);
		}
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

	tagFilterDiv = document.getElementById('tag-filter').firstElementChild;

	remoteControler = document.getElementById('remote-control');
	hammerControler = new Hammer(remoteControler);
	playButton = document.getElementById('control-play');
	pauseButton = document.getElementById('control-pause');

	layoutSelect = document.getElementById('selection-layout');

	socket.emit('getProjectName');
};

// manage history
window.onhashchange = function () {
	if (historyManager >= count) {
		window.open('/RemoteControl', '_self');
	}
	++historyManager;
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
		count = historyManager + 1;
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

	socket.emit('filterMedias', extTab, listSelectedTag);
}

function remoteControl() {
	hammerControler.on("swipeleft swiperight", function (ev) {
		if (projectName.length > 0) {
			if (ev.type === 'swipeleft') {
				if (onFullScreen) {
					selectedIndex = (++selectedIndex) % resultMedias.length;
					(resultMedias[selectedIndex][1] == 'image' ? socket.emit('showFullScreen', resultMedias[selectedIndex % resultMedias.length][0]) : socket.emit('playVideo', resultMedias[selectedIndex % resultMedias.length][0]));
					videoPlaying = (resultMedias[selectedIndex][1] == 'video');
					isPlaying = videoPlaying;
					controlMedia();
				} else {
					socket.emit('goRight');
				}
			} else {
				if (onFullScreen) {
					if (selectedIndex == 0) selectedIndex = resultMedias.length;
					(resultMedias[--selectedIndex][1] == 'image' ? socket.emit('showFullScreen', resultMedias[selectedIndex % resultMedias.length][0]) : socket.emit('playVideo', resultMedias[selectedIndex % resultMedias.length][0]));
					videoPlaying = (resultMedias[selectedIndex][1] == 'video');
					isPlaying = videoPlaying;
					controlMedia();
				} else {
					socket.emit('goLeft');
				}
			}
		}
	});
};

function layoutSelection() {
	layoutSelect.onclick = function (event) {
		for (var i = 0; i < this.children.length; i++) {
			for (var j = 0; j < this.children[i].children.length; j++) {
				if (this.children[i].children[j].firstElementChild == event.target) {
					this.children[i].children[j].firstElementChild.style = "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);";
				} else {
					this.children[i].children[j].firstElementChild.style = "box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.19);";
				}
			}
		}
	};
}

function controlMedia() {
	if (isPlaying) {
		if (onFullScreen) {
			pauseButton.style.opacity = 1;
			pauseButton.onclick = function () {
				if (videoPlaying) {
					socket.emit('pauseInVideo');
				} else {
					socket.emit('pauseInAudio');
				}
				isPlaying = false;
				controlMedia();
			}
			playButton.style.opacity = 0.5;
			playButton.onclick = "";
		} else {
			if (audioRunning) {
				pauseButton.style.opacity = 1;
				pauseButton.onclick = function () {
					socket.emit('pauseInAudio');
					isPlaying = false;
					controlMedia();
				}
				playButton.style.opacity = 0.5;
				playButton.onclick = "";
			} else {
				playButton.style.opacity = 0.5;
				playButton.onclick = "";
				pauseButton.style.opacity = 0.5;
				pauseButton.onclick = "";
			}
		}
	} else {
		if (onFullScreen) {
			playButton.style.opacity = 1;
			playButton.onclick = function () {
				if (videoPlaying) {
					socket.emit('playInVideo');
				} else {
					socket.emit('playInAudio');
				}
				isPlaying = true;
				controlMedia();
			}
			pauseButton.style.opacity = 0.5;
			pauseButton.onclick = "";
		} else {
			playButton.style.opacity = 1;
			playButton.onclick = function () {
				socket.emit('playInAudio');
				isPlaying = true;
				controlMedia();
			}
			pauseButton.style.opacity = 0.5;
			pauseButton.onclick = "";

		}
	}
}
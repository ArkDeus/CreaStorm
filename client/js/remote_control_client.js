var socket = io('/RemoteControl');

window.onload = function () {
	var disAll = document.getElementById("fancy-checkbox-all");
	var disGif = document.getElementById("fancy-checkbox-gif");
	var disJpg = document.getElementById("fancy-checkbox-jpg");
	var disNot = document.getElementById("fancy-checkbox-nothing");

	disAll.addEventListener('change', function () {
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
	});

	disGif.addEventListener('change', function () {
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
	});

	disJpg.addEventListener('change', function () {
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
	});

	disNot.addEventListener('change', function () {
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
	});
};
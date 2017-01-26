var socket = io('/BoardService');

var globalTab;
var currentIndex = 0;
var nbDisplayedElems = 0;

socket.on('goRight', function () {
    displayMedias("right");
});

socket.on('goLeft', function () {
    displayMedias("left");
});

socket.on('showFullScreen', function (url) {
    $('#myModal').collapse("show");
    var img = document.getElementById("fullscreenimg");
    var cont = document.getElementsByClassName("modal-body")[0];
    img.src = url;
    img.className = (img.width / img.height > 16 / 9 ? 'wide' : 'tall');
    cont.className += (img.width / img.height > 16 / 9 ? ' wide' : ' tall');
    cont.style = "align-content: center;display: flex;";
});

socket.on('closeFullScreen', function () {
    $('#myModal').collapse("toggle");
});

function displayMedias(navigation) {
    var container = document.getElementsByClassName("mediacontainer")[0];
    var startIndex;
    var endIndex;

    if (navigation == "right") {
        if (currentIndex == globalTab.medias.length) {
            return;
        }
        startIndex = currentIndex;
        currentIndex = (currentIndex + 6);
        nbDisplayedElems = 6;

        if (currentIndex > globalTab.medias.length) {
            currentIndex = globalTab.medias.length;
            nbDisplayedElems = (globalTab.medias.length - startIndex);
            console.log("nb elems : " + nbDisplayedElems);
        }
        endIndex = currentIndex;
    } else if (navigation == "left") {
        console.log("currentIndex " + currentIndex);
        if ((currentIndex - nbDisplayedElems) <= 0) {
            console.log("fin fonction");
            return;
        }
        endIndex = (currentIndex - nbDisplayedElems);
        currentIndex = endIndex - 6;

        if (currentIndex < 0) {
            currentIndex = 0;
        }
        startIndex = currentIndex;
    }


    $('.media').remove();
    console.log("start " + startIndex + " end " + endIndex);
    for (var i = startIndex; i < endIndex; i++) {
        var div = document.createElement("div");
        div.className = "media";
        if (globalTab.medias[i].type.includes("image")) {
            var img = document.createElement("img");
            img.src = globalTab.medias[i].url;
            div.appendChild(img);
        } else if (globalTab.medias[i].type.includes("video")) {
            var video = document.createElement("video");
            video.src = globalTab.medias[i].url;
            video.muted = true;
            video.play();
            div.appendChild(video);
        }

        container.appendChild(div);
    }
}


socket.on('tag', function (tab) {
    globalTab = tab;

    currentIndex = 0;

    if (globalTab.medias.length == 1) {
        var container = document.getElementsByClassName("mediacontainer")[0];
        var div = document.createElement("div");
        div.className = "mediafull";
        var img = document.createElement("img");
        img.src = globalTab.medias[0].url;
        div.appendChild(img);

        container.appendChild(div);
    } else {
        displayMedias("right");
    }
});

socket.on('audio', function (src) {
    document.getElementById("audio").innerHTML = "";

    var audio = document.createElement("audio");
    audio.src = src;
    audio.controls = true;
    audio.play();
    document.getElementById("audio").appendChild(audio);
});

socket.on('audio-pause', function () {
    document.getElementById("audio").pause();
});

socket.on('audio-play', function () {
    document.getElementById("audio").play();
});
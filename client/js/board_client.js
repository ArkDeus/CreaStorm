var socket = io('/BoardService');

var globalTab;
var currentIndex = 0;
var nbDisplayedElems = 0;
var nbPages = 0;
var currentPage = 0;

socket.on('goRight', function (indexLayout) {
    displayMedias("right", indexLayout);
});

socket.on('goLeft', function (indexLayout) {
    displayMedias("left", indexLayout);
});

socket.on('showFullScreen', function (url, type) {
    $('#myModal').collapse("show");
    var cont = document.getElementsByClassName("modal-body");

    cont.style = "align-content: center;display: flex;";
    if (type == "image") {
        var img = document.getElementById("fullscreenimg");
        img.src = url;
        img.className = (img.width / img.height > 16 / 9 ? 'wide' : 'tall');
        cont[0].className += (img.width / img.height > 16 / 9 ? ' wide' : ' tall');
        cont[0].style = "align-content: center;display: flex; margin-bottom:1%;";
        cont[1].style = "display: none;";
        document.getElementById("fullscreenvideo").pause();
    } else if (type == "video") {
        var video = document.getElementById("fullscreenvideo");
        video.src = url;
        document.getElementById("audio").pause();
        video.play();
        video.className = (video.videoWidth / video.videoHeight > 16 / 9 ? 'wide' : 'tall');
        cont[1].className += (video.videoWidth / video.videoHeight > 16 / 9 ? ' wide' : ' tall');
        cont[1].style = "align-content: center;display: flex; margin-bottom:1%;";
        cont[0].style = "display: none;";
    }
});

socket.on('closeFullScreen', function () {
    document.getElementById("fullscreenvideo").pause();
    $('#myModal').collapse("toggle");
});

function displayMedias(navigation, indexLayout) {
    // var container = document.getElementsByClassName("mediacontainer")[0];
    var container = document.getElementById(indexLayout);
    var startIndex;
    var endIndex;

    if (navigation == "right") {
        console.log("right : currentIndex " + currentIndex);
        if (currentIndex == globalTab.length) {
            return;
        }
        startIndex = currentIndex;
        currentIndex = (currentIndex + 6);
        nbDisplayedElems = 6;

        if (currentIndex > globalTab.length) {
            currentIndex = globalTab.length;
            nbDisplayedElems = (globalTab.length - startIndex);
            console.log("nb elems : " + nbDisplayedElems);
        }
        endIndex = currentIndex;
        console.log("right : currentIndex " + currentIndex);
        currentPage++;
    } else if (navigation == "left") {
        console.log("left : currentIndex " + currentIndex);
        if ((currentIndex - nbDisplayedElems) <= 0) {
            return;
        }
        endIndex = (currentIndex - nbDisplayedElems);
        currentIndex = endIndex;
        startIndex = endIndex - 6;
        nbDisplayedElems = 6;
        if (startIndex < 0) {
            startIndex = 0;
            nbDisplayedElems = endIndex;
        }
        // startIndex = currentIndex;
        console.log("left : currentIndex " + currentIndex);
        currentPage--;
    }
    console.log("current page = " + currentPage + " et nbPages = " + nbPages);
    if (currentPage <= 1) {
        document.getElementById("leftarrow" + indexLayout).hidden = true;
    } else {
        document.getElementById("leftarrow" + indexLayout).hidden = false;
    }
    if (currentPage >= nbPages) {
        document.getElementById("rightarrow" + indexLayout).hidden = true;
    } else {
        document.getElementById("rightarrow" + indexLayout).hidden = false;
    }
    

    // $('.media').remove();
    console.log("start " + startIndex + " end " + endIndex);
    for (var i = startIndex; i < endIndex; i++) {
        var div = document.createElement("div");
        div.className = "media";
        if (globalTab[i].type.includes("image")) {
            var img = document.createElement("img");
            img.src = globalTab[i].url;
            div.appendChild(img);
        } else if (globalTab[i].type.includes("video")) {
            var video = document.createElement("video");
            video.src = globalTab[i].url;
            video.muted = true;
            video.play();
            div.appendChild(video);
        }

        container.appendChild(div);
    }
}


socket.on('changelayout1', function() {
    document.getElementById("layout0").style += "display: none;";
    document.getElementById("layout1").style += "display: flex;";
});

socket.on('changelayout0', function() {
    document.getElementById("layout0").style += "display: flex;";
    document.getElementById("layout1").style += "display: none;";
});

socket.on('tag', function (tab, indexLayout) {
    console.log("voici l'index du layout : " + indexLayout);
    globalTab = tab;
    nbPages = Math.ceil(globalTab.length/6);
    console.log("il y aura nbPages : " + nbPages);
    currentIndex = 0;
    currentPage = 0;
    // $('.media').remove();
    if (globalTab.length == 1) {
        // var container = document.getElementsByClassName("mediacontainer")[0];
        var container = document.getElementById(indexLayout);
        container.innerHTML = "";
        var div = document.createElement("div");
        div.className = "mediafull";
        if (globalTab[0].type.includes("image")) {
            var img = document.createElement("img");
            img.src = globalTab[0].url;
            div.appendChild(img);
        } else if (globalTab[0].type.includes("video")) {
            var video = document.createElement("video");
            video.src = globalTab[0].url;
            video.play();
            document.getElementById("audio").pause();
            div.appendChild(video);
        }

        container.appendChild(div);
    } else {
        displayMedias("right", indexLayout);
    }
});

socket.on('audio', function (src) {
    // document.getElementById("audiocontainer").innerHTML = "";
    var title = src.split("/");

    document.getElementById("musictitle").innerText = title[title.length - 1];
    var audio = document.getElementById("audio");
    audio.src = src;
    audio.controls = true;
    audio.play();
    document.getElementById("audiocontainer").hidden = false;
    document.getElementById("fullscreenvideo").pause();
});

socket.on('audio-pause', function () {
    document.getElementById("audio").pause();
});

socket.on('audio-play', function () {
    document.getElementById("audio").play();
});

socket.on('audio-stop', function () {
    document.getElementById("audio").pause();
    document.getElementById("audio").currentTime = 0;
    document.getElementById("audiocontainer").hidden = true;
});

socket.on('video-pause', function () {
    document.getElementById("fullscreenvideo").pause();
});

socket.on('video-play', function () {
    document.getElementById("fullscreenvideo").play();
});
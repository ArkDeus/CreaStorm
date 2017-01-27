var socket = io('/BoardService');

var globalTab;
var currentIndex = 0;
var nbDisplayedElems = 0;
var nbPages = 0;
var currentPage = 0;

socket.on('goRight', function () {
    displayMedias("right");
});

socket.on('goLeft', function () {
    displayMedias("left");
});

socket.on('showFullScreen', function (url, type) {
    $('#myModal').collapse("show");
    var cont = document.getElementsByClassName("modal-body")[0];

    cont.style = "align-content: center;display: flex;";

    if (type == "image") {
        var img = document.getElementById("fullscreenimg");
        img.src = url;
        img.className = (img.width / img.height > 16 / 9 ? 'wide' : 'tall');
        cont.className += (img.width / img.height > 16 / 9 ? ' wide' : ' tall');
    } else if (type == "video") {
        var video = document.getElementById("fullscreenvideo");
        video.src = url;
        video.className = (video.videoWidth / video.videoHeight > 16 / 9 ? 'wide' : 'tall');
        cont.className += (video.videoWidth / video.videoHeight > 16 / 9 ? ' wide' : ' tall');
    }
});

socket.on('closeFullScreen', function () {
    $('#myModal').collapse("toggle");
});

function displayMedias(navigation) {
    var container = document.getElementsByClassName("mediacontainer")[0];
    var startIndex;
    var endIndex;

    // if ((currentIndex + 6) < globalTab.length) {
    //     console.log("afficher fleche droite");
    //     document.getElementById("rightarrow").hidden = false;
    // } else {
    //     document.getElementById("rightarrow").hidden = true;
    // }
    // if ((currentIndex - nbDisplayedElems) >= 0) {
    //     document.getElementById("leftarrow").hidden = false;
    // } else {
    //     document.getElementById("leftarrow").hidden = true;
    // }

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
        document.getElementById("leftarrow").hidden = true;
    } else {
        document.getElementById("leftarrow").hidden = false;
    }
    if (currentPage >= nbPages) {
        document.getElementById("rightarrow").hidden = true;
    } else {
        document.getElementById("rightarrow").hidden = false;
    }
    

    $('.media').remove();
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


socket.on('tag', function (tab) {
    globalTab = tab;
    nbPages = Math.ceil(globalTab.length/6);
    console.log("il y aura nbPages : " + nbPages);
    currentIndex = 0;
    $('.media').remove();
    if (globalTab.length == 1) {
        var container = document.getElementsByClassName("mediacontainer")[0];
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
        displayMedias("right");
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
    // document.getElementById("audio").appendChild(audio);
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
    document.getElementById("audiocontainer").controls = false;
});

socket.on('video-pause', function () {
    document.getElementById("fullscreenvideo").pause();
});

socket.on('video-play', function () {
    document.getElementById("fullscreenvideo").play();
});
var socket = io('/BoardService');

var globalTab;
var currentIndex = 0;

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
        startIndex = currentIndex;
        currentIndex = (currentIndex + 6);

        if (currentIndex > globalTab.medias.length) {
            currentIndex = globalTab.medias.length;
        }
        endIndex = currentIndex;
    } else if (navigation == "left") {
        endIndex = currentIndex;
        currentIndex = (currentIndex - 6);

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
        var img = document.createElement("img");
        img.src = globalTab.medias[i].url;
        div.appendChild(img);
        container.appendChild(div);
    }
}


socket.on('tag', function (tab) {
    globalTab = tab;

    currentIndex = 0;

    displayMedias("right");

});


var socket = io('/BoardService');

var img = document.querySelector("#img1");
// socket.on('displayAll', function (urlImg) {
//     console.log("displayAll");
//     document.getElementById("img1").src = urlImg;
// });
// socket.on('displayJpg', function (urlImg) {
//     console.log("displayJpg");
//     document.getElementById("img1").src = urlImg;
// });
// socket.on('displayGif', function (urlImg) {
//     console.log("displayGif");
//     document.getElementById("img1").src = "";
// });
// socket.on('hideAll', function (urlImg) {
//     console.log("hideAll");
//     document.getElementById("img1").src = "";
// });

// socket.on('tag', function (tab) {
//     document.getElementsByClassName("container")[1].innerHTML = "";
//     for (var i = 0; i < tab.medias.length; i++) {
//         var div = document.createElement("div");
//         div.className = "col-lg-3 col-md-4 col-xs-6";
//         div.style = "margin-bottom:2%;";
//         var img = document.createElement("img");

//         img.src = tab.medias[i].url;
//         img.className = "img-responsive";
//         img.style = "height : 28%";
//         div.appendChild(img);
//         document.getElementsByClassName("container")[1].appendChild(div);
//     }
// });


socket.on('tag', function (tab) {

    // calculate how many pages will be displayed
    var nbPages = Math.floor(tab.medias.length / 12);

    if (tab.medias.length % 12 != 0) {
        nbPages++;
    }

    // calculate how many medias will be displayed par page
    var nbElemPerPage = Math.floor(tab.medias.length / nbPages);

    // if the division has a rest, how many pages will have one more element
    var nbPagesWithOneMore = tab.medias.length % nbPages;

    var elemPerRowNorm;
    if (nbElemPerPage == 1) {
        elemPerRowNorm = 1;
    } else if (nbElemPerPage <= 4) {
        elemPerRowNorm = 2;
    } else {
        elemPerRowNorm = 4;
    }

    var elemPerRowOneMore;
    if ((nbElemPerPage + 1) <= 4) {
        elemPerRowOneMore = 2;
    } else if ((nbElemPerPage + 1) == 1) {
        elemPerRowOneMore = 1;
    } else {
        elemPerRowOneMore = 4;
    }
    // create divs with id
    for (var n = 0; n < nbPages; n++) {
        var divPage = document.createElement("div");
        divPage.id = "page" + n;
         
        document.getElementsByClassName("slider")[0].appendChild(divPage);
    }

    console.log(tab.medias.length);

    console.log("il y a nb pages : " + nbPages);
    for (var n = 0; n < nbPages; n++) {
        var nbRows = 0;
        if (nbPagesWithOneMore > 0) {
            nbPagesWithOneMore--;
            nbRows = Math.floor(nbElemPerPage / elemPerRowOneMore);
            if ((nbRows % elemPerRowOneMore) != 0) {
                nbRows++;
            }
        } else {
            nbRows = Math.floor(nbElemPerPage / elemPerRowNorm);
            if ((nbRows % elemPerRowNorm) != 0) {
                nbRows++;
            }
        }

        for (var r = 0; r < nbRows; r++) {
            for (var c = 0; c < elemPerRowNorm; c++) {
                var divMedia = document.createElement("div");
                divMedia.className = "grandchild col-lg-3 col-md-4 col-xs-6";
                var img = document.createElement("img");
                img.src = "";
                divMedia.appendChild(img);
                document.getElementById("page" + n).appendChild(divMedia);
                console.log("j'essaie de get : page" + n);
                console.log("sur cette page il y a nbRows : " + nbRows);
            }
            var br = document.createElement("br");
            br.className = "clearboth";
            document.getElementById("page" + n).appendChild(br);
        }



    }

    var tabImg = document.getElementsByTagName("img");

    for (var i = 0; i < tab.medias.length; i++) {
        tabImg[i].src = tab.medias[i].url;
        tabImg[i].className = "img-responsive";
    }
    // var div = document.createElement("div");



    // for (var i = 0; i < tab.medias.length; i++) {
    // //   if (i%4 == 0) {
    // //     var div = document.createElement("div");
    // //   }
    //     var divGrand = document.createElement("div");
    //     divGrand.className = "grandchild col-lg-3 col-md-4 col-xs-6";
    //     // div.style = "margin-bottom:2%;";
    //     var img = document.createElement("img");

    //     img.src = tab.medias[i].url;
    //     img.className = "img-responsive";
    //     img.style = "height : 28%";
    //     divGrand.appendChild(img);
    //     div.appendChild(divGrand);


    //     if ((i+1)%4 == 0 && (i+1)%12 != 0) {
    //       var br = document.createElement("br");
    //       br.className = "clearboth";
    //       console.log("j'ajoute br à "+i);
    //       div.appendChild(br);
    //     } else if ((i+1)%12 == 0) {
    //       document.getElementsByClassName("slider")[0].appendChild(div);
    //     }
    // }
});




$(document).ready(function () {
    $('.slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1
    });
});
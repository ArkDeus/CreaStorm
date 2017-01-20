var socket = io('/BoardService');

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

// var ul = document.createElement("ul");


// img.src = "http://placehold.it/400x300";



function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

socket.on('goRight', function () {
    console.log("jessaie de faire next page");
    eventFire(document.getElementsByName("Next Page")[0], 'click');
});

socket.on('goLeft', function () {
    console.log("jessaie de faire previous page");
    eventFire(document.getElementsByName("Previous Page")[0], 'click');
});

socket.on('showFullScreen', function (url) {
    console.log('open');
    $('#myModal').collapse("show");
    var img = document.getElementById("fullscreenimg");
    var cont = document.getElementsByClassName("modal-body")[0];
    img.src = url;
    img.className = (img.width/img.height > 16/9 ? 'wide': 'tall');
    cont.className += (img.width/img.height > 16/9 ? ' wide': ' tall');
    cont.style = "align-content: center;display: flex;";
});

socket.on('closeFullScreen', function () {
    console.log('close');
    $('#myModal').collapse("toggle");
});

socket.on('tag', function (tab) {
    // console.log(tab);
    document.getElementById("mycarousel").innerHTML = "";
    var tabLi = [];
    for (var i = 0; i < tab.medias.length; i++) {
        var img = document.createElement("img");
        img.src = tab.medias[i].url;
        img.style = "width:433px;height:auto";
        // img.className = "carousel-element-3";

        var li = document.createElement("li");
        li.appendChild(img);
        tabLi[i] = li;
    }


    for (var i = 0; i < tab.medias.length; i++) {
        document.getElementById("mycarousel").appendChild(tabLi[i]);
    }

    // var i;
    // var j = 2;
    // var width;
    // var height = 450;

    // if (tab.medias.length == 1) {
    //     i = 1;
    //     j = 1;
    //     width = "width: 1200px;";
    //     height = "height: 800px;";
    // } else if (tab.medias.length <= 4) {
    //     i = 2;
    //     width = 900;
    // } else if (tab.medias.length <= 6) {
    //     i = 3;
    //     width = 600;
    // } else {
    //     i = 4;
    //     width = 400;
    // }

    var carousel = new YAHOO.widget.Carousel("container", {
        // specify number of columns and number of rows
        numVisible: [3, 2]
    });
    carousel.render(); // get ready for rendering the widget
    carousel.show();   // display the widget

    // var car = document.getElementsByClassName('li');
    // for(var i = 0; i < car.length; i++){
    //     car[i].style += "width: 1200px;";
    //     car[i].style += height;
    // };

});

// window.onload = function(){
//     var img = document.getElementById("fullscreenimg");
//     var cont = document.getElementsByClassName("modal-body")[0];
//     img.className = (img.width/img.height > 16/9 ? 'wide': 'tall');
//     cont.className += (img.width/img.height > 16/9 ? ' wide': ' tall');
//     cont.style = "align-content: center;display: flex;";
// }


// Get the modal
// var modal = document.getElementById('myModal');

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
// btn.onclick = function() {
//     modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }






    // // calculate how many pages will be displayed
    // var nbPages = Math.floor(tab.medias.length / 12);

    // if (tab.medias.length % 12 != 0) {
    //     nbPages++;
    // }

    // // calculate how many medias will be displayed par page
    // var nbElemPerPage = Math.floor(tab.medias.length / nbPages);

    // // if the division has a rest, how many pages will have one more element
    // var nbPagesWithOneMore = tab.medias.length % nbPages;

    // var elemPerRowNorm;
    // if (nbElemPerPage == 1) {
    //     elemPerRowNorm = 1;
    // } else if (nbElemPerPage <= 4) {
    //     elemPerRowNorm = 2;
    // } else {
    //     elemPerRowNorm = 4;
    // }

    // var elemPerRowOneMore;
    // if ((nbElemPerPage + 1) <= 4) {
    //     elemPerRowOneMore = 2;
    // } else if ((nbElemPerPage + 1) == 1) {
    //     elemPerRowOneMore = 1;
    // } else {
    //     elemPerRowOneMore = 4;
    // }

    // document.getElementsByClassName("slick-track")[0].style = "opacity: 1; width: 7080px; transform: translate3d(-1770px, 0px, 0px);";

    // // create divs with id
    // for (var n = 0; n < nbPages; n++) {

    //     var div    // } else if ((nbElemPerPage + 1) == 1) {
    //     elemPerRowOneMore = 1;
    // } else {
    //     elemPerRowOneMore = 4;
    // }

    // document.getElementsByClassName("slick-track")[0].style = "opacity: 1; width: 7080px; transform: translate3d(-1770px, 0px, 0px);";

    // // create divs with id
    // for (var n = 0; n < nbPages; n++) {Page = document.createElement("div");
    //     divPage.id = "page" + n;

    //     document.getElementsByClassName("slider")[0].appendChild(divPage);
    // }

    // console.log(tab.medias.length);

    // console.log("il y a nb pages : " + nbPages);


    // for (var n = 0; n < nbPages; n++) {
    //     var nbRows = 0;
    //     if (nbPagesWithOneMore > 0) {
    //         nbPagesWithOneMore--;
    //         nbRows = Math.floor(nbElemPerPage / elemPerRowOneMore);
    //         if ((nbRows % elemPerRowOneMore) != 0) {
    //             nbRows++;
    //         }
    //     } else {
    //         nbRows = Math.floor(nbElemPerPage / elemPerRowNorm);
    //         if ((nbRows % elemPerRowNorm) != 0) {
    //             nbRows++;
    //         }
    //     }




    //     for (var r = 0; r < nbRows; r++) {


    //         // create slide container
    //         var divContainer = document.createElement("div");

    //         if (n == 0) {
    //             divContainer.style = "slick-slide slick-current slick-active";
    //             divContainer.setAttribute("data-slick-index", n);
    //             divContainer.setAttribute("aria-hidden", "false");
    //             divContainer.setAttribute("style", "width: 1770px;");
    //             divContainer.setAttribute("tabindex", "-1");
    //             divContainer.setAttribute("role", "option");
    //             divContainer.setAttribute("aria-describedby", "slick-slide00");
    //         } else {
    //             divContainer.style = "slick-slide";
    //             divContainer.setAttribute("data-slick-index", n);
    //             divContainer.setAttribute("aria-hidden", "true");
    //             divContainer.setAttribute("style", "width: 1770px;");
    //             divContainer.setAttribute("tabindex", "-1");
    //             divContainer.setAttribute("role", "option");
    //             divContainer.setAttribute("aria-describedby", "slick-slide0" + n);
    //         }
    //         for (var c = 0; c < elemPerRowNorm; c++) {


    //             var divMedia = document.createElement("div");
    //             divMedia.className = "grandchild col-lg-3 col-md-4 col-xs-6";
    //             var img = document.createElement("img");
    //             img.src = "";
    //             divMedia.appendChild(img);
    //             divContainer.appendChild(divMedia);

    //         }
    //         document.getElementById("page" + n).appendChild(divContainer);
    //         var br = document.createElement("br");
    //         br.className = "clearboth";
    //         document.getElementById("page" + n).appendChild(br);
    //     }



    // }

    // var tabImg = document.getElementsByTagName("img");

    // for (var i = 0; i < tab.medias.length; i++) {
    //     console.log("tableau images index : " + i);
    //     tabImg[i].src = tab.medias[i].url;
    //     tabImg[i].className = "img-responsive";
    // }
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
// });




// $(document).ready(function () {
//     $('.slider').slick({
//         slidesToShow: 1,
//         slidesToScroll: 1
//     });
// });
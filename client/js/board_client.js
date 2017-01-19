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



// var carousel = new YAHOO.widget.Carousel("parentContainerId");

// carousel.render();
// carousel.show();
// console.log(carousel.addItem("zhengqin", 0));
// add an item to the Carousel
//  console.log(carousel.addItem(li, 1));
//  console.log(carousel.addItem(img, 0));
// carousel.addItems(li,li,li); // add multiple items at one go
// carousel.set("numVisible", [3, 2]);
// render the widget inside the
// parentContainerId container 


// YAHOO.util.Event.onDOMReady(function (ev) {

// });

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function nextPage() {
    console.log("jessaie de faire next page");
    eventFire(document.getElementsByName("Next Page")[0], 'click');
    // $('element[name="Next Page"]').click();
}

function previousPage() {
    console.log("jessaie de faire previous page");
    eventFire(document.getElementsByName("Previous Page")[0], 'click');
    // $('element[name="Next Page"]').click();
}




socket.on('tag', function (tab) {

    var tabLi = [];
    for (var i = 0; i < tab.medias.length; i++) {
        var img = document.createElement("img");
        img.src = tab.medias[i].url;
        img.className = "carousel-element";

        var li = document.createElement("li");
        li.appendChild(img);
        tabLi[i] = li;
    }


    for (var i = 0; i < tab.medias.length; i++) {
        document.getElementById("mycarousel").appendChild(tabLi[i]);
    }


    // $('.yui-carousel-item').css('width: ');
    var carousel = new YAHOO.widget.Carousel("container", {
        // specify number of columns and number of rows
        numVisible: [3, 2]
    });
    carousel.render(); // get ready for rendering the widget
    carousel.show();   // display the widget

});

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

    //     var divPage = document.createElement("div");
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
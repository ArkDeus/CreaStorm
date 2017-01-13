var socket = io('/BoardService');

var img = document.querySelector("#img1");

socket.on('tag', function (tab) {
    
    for (var i = 0; i < tab.medias.length; i++) {
        var div = document.createElement("div");
        div.className = "col-lg-3 col-md-4 col-xs-6";
        div.style = "margin-bottom:2%;";
        var img = document.createElement("img");

        img.src = tab.medias[i].url;
        img.className = "img-responsive";
        img.style = "height : 28%";
        div.appendChild(img);
        document.getElementsByClassName("container")[1].appendChild(div);
    }
});


// socket.on('tag', function (tab) {
//     // var div = document.createElement("div");
    
//     for (var i = 0; i < tab.medias.length; i++) {
//       if (i%4 == 0) {
//         var div = document.createElement("div");
//       }
//         var divGrand = document.createElement("div");
//         divGrand.className = "grandchild col-lg-3 col-md-4 col-xs-6";
//         // div.style = "margin-bottom:2%;";
//         var img = document.createElement("img");

//         img.src = tab.medias[i].url;
//         img.className = "img-responsive";
//         img.style = "height : 28%";
//         divGrand.appendChild(img);
//         div.appendChild(divGrand);
        

//         if ((i+1)%4 == 0 && (i+1)%12 != 0) {
//           var br = document.createElement("br");
//         } else if ((i+1)%12 == 0) {
//           document.getElementsByClassName("slider")[0].appendChild(div);
//         }
//     }
// });


// $(document).ready(function() {
//     $('.slider').slick({
//         slidesToShow: 1,
//         slidesToScroll: 1
//     });
// });

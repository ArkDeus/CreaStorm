/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

// Import TUIOManager
import TUIOManager from 'tuiomanager/core/TUIOManager';

/** TUIOManager starter **/
const tuioManager = new TUIOManager();
tuioManager.start();

/** App Code **/
var socket = io('/SurfaceService');
var offset = [0,0];
var zindex = 0;
socket.on('folder', function (foldercontent) {
    data.innerHTML = foldercontent;
})

window.onload = init;

function init() {
    var projectListDropdown = document.getElementById("projectListDropdown");
    socket.emit("getProjectList");
    socket.on("returnProjectList",function(projectList){
        for (var i =0; i<projectList.length;i++){
            console.log(projectList[i][0]);
            projectListDropdown.innerHTML += "<li><a onclick='displayImages(\""+projectList[i][0]+ "\")'>"+projectList[i][0]+"</a></li>"
        }
    });

};

function displayTags(projectName){

}

function displayImages(projectName){
    var workbench=document.getElementById("workbench");
    workbench.innerHTML = "";
    console.log(projectName);
    socket.emit("getImagesFromProject",projectName);
    socket.on("returnAllImages", function(images){
        console.log(images);
        for (var i=0;i<images.length;i++){
            workbench.innerHTML += "<img src='../Projects/"+projectName+"/"+images[i]+"'/>";
        }
        for (var i=0;i<workbench.children.length;i++){
            var image = workbench.children[i];
            image.style.position="absolute";
            var top = Math.floor(Math.random()*(1000-10+1))+10;
            var left = Math.floor(Math.random()*(1900-10+1))+10;
            var rotation = Math.floor(Math.random()*(360+1));
            image.style.top = top+"px";
            image.style.left = left+"px";
            image.style.transform="rotate("+rotation+"deg)";
            console.log(image);
            initializeDragAndDrop(image);

        }
    });
}

function initializeDragAndDrop(div){

    div.addEventListener('mousedown', function(e) {
        div.setAttribute("mousedown","true");
        div.style.position="absolute";
        div.style.zIndex=++zindex;
        offset = [
            div.offsetLeft - e.clientX,
            div.offsetTop - e.clientY
        ];
    }, true);

    div.addEventListener('mouseup', function(e) {

        div.setAttribute("mousedown","false");


    }, true);


    div.addEventListener('mousemove', function(event) {
        event.preventDefault();
        if (div.getAttribute("mousedown")==="true" ) {

            div.style.left = (event.clientX + offset[0]) + 'px';
            div.style.top  = (event.clientY + offset[1]) + 'px';
        }
    }, true);
}



function allElementsFromPoint(x, y) {
    var element, elements = [];
    var old_visibility = [];
    while (true) {
        element = document.elementFromPoint(x, y);
        if (!element || element === document.documentElement) {
            break;
        }
        elements.push(element);
        old_visibility.push(element.style.visibility);
        element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
    }
    for (var k = 0; k < elements.length; k++) {
        elements[k].style.visibility = old_visibility[k];
    }
    elements.reverse();
    return elements;
}

function mouseAboveClass(x,y,classe){
    var elements = allElementsFromPoint(x, y);
    var arrayLength = elements.length;
    for (var i = 0; i < arrayLength; i++) {
        if (elements[i].classList.contains(classe)){
            return elements[i];
        }
    }
    return false;
}

function nbElemUnderMouse(x,y,classe){
    var elements = allElementsFromPoint(x,y);
    var arrayLength = elements.length;
    var res = 0;
    for (var i = 0; i < arrayLength; i++) {
        if (elements[i].classList.contains(classe)){
            res++;
        }
    }
    return res;
}
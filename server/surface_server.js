// to access to the file system to read folder content
var filesystem = require("fs");

var jq = require('jquery');

var json = "";
var projectFolder = "Projects/";

function _getAllFilesFromFolder(dir) {
    // remove the last "," when we have a recursion
    if (json.length > 2) {
        if (json.substring(json.length - 1, json.length) === ",}") {
            json = json.substring(0, json.length - 2) + "}";
        }
    }

    json += "   \"" + dir.split('/').pop() + "\": {";

    filesystem.readdirSync(dir).forEach(function (file) {
        file = dir + '/' + file;
        var stat = filesystem.statSync(file);

        // if it's a directory we open the folder
        if (stat && stat.isDirectory()) {
            _getAllFilesFromFolder(file);
        } else {
            var filename = file.split(/(\\|\/)/g).pop();
            var fileext = filename.split('.').pop();
            filename = filename.substring(0, filename.length - 1 - fileext.length);
            if (filename.length > 0) {
                json += "\"" + filename + "\": " + "\"" + filename + "." + fileext + "\",";
            }
        }
    });
    // 
    json = json.substring(0, json.length - 1);
    json += "},";
    return json;
}

function _getAllProjectsName() {
    var result = [];
    var objProjectAndFiles;
    var listProject = filesystem.readdirSync('Projects');
    for (var i = 0; i < listProject.length; i++) {
        var currentProjectJson = require("./../" + projectFolder + listProject[i] + "/medias.json");
        objProjectAndFiles = [currentProjectJson.name, currentProjectJson.iconUrl];
        result.push(objProjectAndFiles);
    }
    return result;
}

function _getProjectsAndIcon(){
    var result = [];
    var objProjectAndFiles;
    var listProject = filesystem.readdirSync('Projects');
    for (var i = 0; i < listProject.length; i++) {
        var currentProjectJson = require("./../" + projectFolder + listProject[i] + "/medias.json");
        objProjectAndFiles = [currentProjectJson.name, currentProjectJson.iconUrl];
        result.push(objProjectAndFiles);
    }
    return result;

}

function _getProjectJson(project) {
    var projectJson = require('../' + projectFolder + project + '/medias.json');
    return projectJson;
}

function _getAllImages(project) {
    var projectJson = _getProjectJson(project);
    var medias = projectJson.medias;
    var images = [];
    for (var i = 0; i < medias.length; i++) {
        images.push(medias[i]);
    }
    return images;
}

function _getAllTags(project) {
    var projectJson = _getProjectJson(project);
    return projectJson.tags;
}


function _removeMediaFromProject(project, media){
    console.log("Project name: " + project);
    console.log("Project url: " + media);

    var projectJson = _getProjectJson(project);
    console.log("Project Json: " +projectJson.toString());
    var index;
    for(var i = 0; i < projectJson.length; i++){
        if(projectJson.url == media){
            index = i;
            break;
        }
    }

    projectJson.medias.splice(index,1);
    console.log("Après splice: " +projectJson.medias);
    filesystem.unlink(projectFolder + project + '/' + media, function(err){
        if (err) {
            console.log(err);
        }
        else {
            console.log('file deleted');
        }
    });
    filesystem.writeFile(projectFolder + project + '/medias.json', projectJson, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('json updated');
        }
    });
}

module.exports = {
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    getAllFilesFromFolder: function (dir) {
        // clear the json
        json = "";
        return _getAllFilesFromFolder(dir);
    },
    getAllImages: function (project) {
        return _getAllImages(project);
    },
    getAllTags: function (project) {
        return _getAllTags(project);
    },
    getProjectJson: function (project) {
        return _getProjectJson(project);
    },
    removeMediaFromProject: function (project, media) {
        return _removeMediaFromProject(project, media);
    }
};
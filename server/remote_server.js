// to access to the file system to read folder content
var filesystem = require("fs");
var mime = require('mime');

var json = "";

var projectFolder = "Projects/";

function _getAllFilesFromProjectByExtention(name, ext) {
    var result = [];
    try {
        filesystem.readdirSync(projectFolder + name).forEach(function (file) {
            file = projectFolder + name + '/' + file;
            var lookup = mime.lookup(file).split("/");
            if (lookup[1] === ext) {
                result.push([file, mime.lookup(file)]);
            }
        });
    } catch (e) {
        return e;
    }
    return result;
}

function _getNbFilesFromProject(name) {
    try {
        return filesystem.readdirSync(projectFolder + name).length;
    } catch (e) {
        return e;
    }
}

function _createProject(name) {
    try {
        filesystem.mkdirSync(projectFolder + name);
    } catch (e) {
        return e;
    }
    return true;
}

function _getAllProjectsName() {
    var result = [];
    var objProjectAndFiles;
    var listProject = filesystem.readdirSync('Projects');
    for (var i = 0; i < listProject.length; i++) {
        objProjectAndFiles = [listProject[i], _getNbFilesFromProject(listProject[i])];
        result.push(objProjectAndFiles);
    }
    return result;
}

function _getTabFromTag(tag) {
    var parsedJSON = require('./../medias.json');

    for (var i = 0; i < parsedJSON.medias.length; i++) {
        if (!parsedJSON.medias[i].tags.includes(tag)) {
            // console.log("j'ai supprime : " + parsedJSON.medias[i].url);
            parsedJSON.medias.splice(i, 1);
        }
    }
    return parsedJSON;
}

module.exports = {
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    createProject: function (name) {
        return _createProject(name);
    },
    getAllFilesFromProjectByExtention: function (name, ext) {
        return _getAllFilesFromProjectByExtention(name, ext);
    },
    getTabFromTag: function (tag) {
        return _getTabFromTag(tag);
    }
};
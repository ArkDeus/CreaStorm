// to access to the file system to read folder content
var filesystem = require("fs");
var mime = require('mime');

var projectFolder = "Projects/";
var projectName = "";


function _getAllProjectsName() {
    var result = [];
    var objProjectAndFiles;
    var listProject = filesystem.readdirSync('Projects');
    for (var i = 0; i < listProject.length; i++) {
        var currentProjectJson = require("./../" + projectFolder + listProject[i] + "/medias.json");
        objProjectAndFiles = [currentProjectJson.name, currentProjectJson.medias.length];
        result.push(objProjectAndFiles);
    }
    return result;
}

function _filterProjectMedias(ext, tags) {
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    var result = [];
    for (var i = 0; i < ext.length; i++) {
        var curExtRes = _getProjectFilesByExtAndTags(ext[i], tags);
        if (curExtRes.length > 0) {
            result.push.apply(result, curExtRes);
        }
    }
    return result;
}

function _getProjectFilesByExtAndTags(ext, tags) {
    var result = [];
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    for (var i = 0; i < projectJsonFile.medias.length; i++) {
        var currentMedia = projectJsonFile.medias[i];
        var lookup = currentMedia.type.split("/");
        if (lookup[1] === ext) {
            var hasTag = false;
            for (var j = 0; j < tags.length && !hasTag; j++) {
                if (currentMedia.tags.includes(tags[j])) {
                    var currentMedia = Object.assign({}, projectJsonFile.medias[i]);
                    currentMedia.url = "./../" + projectFolder + projectName + "/" + currentMedia.url;
                    result.push(currentMedia);
                    hasTag = true;
                }
            }
        }
    }
    return result;
}

function _getAllTagFromProject() {
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    return projectJsonFile.tags;
}

function _getFilterProjectMediasWithoutAudio(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        if(list[i].type.split("/")[0] != 'audio'){
            result.push(list[i]);
        }
    }
    return result;
}

module.exports = {
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    filterProjectMedias: function (ext, tags) {
        return _filterProjectMedias(ext, tags);
    },
    getAllTagFromProject: function () {
        return _getAllTagFromProject();
    },
    getFilterProjectMediasWithoutAudio: function (listMedias) {
        return _getFilterProjectMediasWithoutAudio(listMedias);
    },
    getProjectName: function () {
        return projectName;
    },
    setProjectName: function (name) {
        projectName = name;
    }
};
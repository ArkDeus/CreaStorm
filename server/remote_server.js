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

function _filterProjectFiles(filters) {
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    var result = [];
    for (var i = 0; i < filters.length; i++) {
        var curExtRes = _getAllFilesFromProjectByExtention(filters[i]);
        if (curExtRes.length > 0) {
            result.push(curExtRes);
        }
    }
    return result;
}

function _getAllFilesFromProjectByExtention(ext) {
    var result = [];
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    for (var i = 0; i < projectJsonFile.medias.length; i++) {
        var currentMedia = projectJsonFile.medias[i];
        var lookup = currentMedia.type.split("/");
        if (lookup[1] === ext) {
            result.push(["./../" + projectFolder + projectName + "/" + currentMedia.url, currentMedia.type]);
        }
    }
    return result;
}

function _getAllTagFromProject() {
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    return projectJsonFile.tags;
}

function _getTabFromTag(tag) {
    var result = [];
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    for (var i = 0; i < projectJsonFile.medias.length; i++) {
        if (projectJsonFile.medias[i].tags.includes(tag)) {
            result.push(projectJsonFile.medias[i]);
        }
    }
    return result;
}

module.exports = {
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    filterProjectFiles: function (filters) {
        return _filterProjectFiles(filters);
    },
    getAllTagFromProject: function () {
        return _getAllTagFromProject();
    },
    getTabFromTag: function (tag) {
        return _getTabFromTag(tag);
    },
    getProjectName: function () {
        return projectName;
    },
    setProjectName: function (name) {
        projectName = name;
    }
};
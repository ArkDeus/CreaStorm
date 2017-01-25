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
        var projectJsonFile = require("./../" + projectFolder + listProject[i] + "/medias.json");
        objProjectAndFiles = [projectJsonFile.name, projectJsonFile.medias.length];
        result.push(objProjectAndFiles);
    }
    return result;
}

function _filterProjectFiles(filters) {
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
    try {
        filesystem.readdirSync(projectFolder + projectName).forEach(function (file) {
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

function _getAllTagFromProject() {
    var projectJsonFile = require("./../" + projectFolder + projectName + "/medias.json");
    return projectJsonFile.tags;
}

function _getTabFromTag(tag) {
    var parsedJSON = require("./../" + projectFolder + projectName + "/medias.json");

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
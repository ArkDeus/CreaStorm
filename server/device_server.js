// to access to the file system to read folder content
var filesystem = require("fs");

var projectFolder = "Projects/";

function _createProject(name, projectJson) {
    try {
        filesystem.mkdirSync(projectFolder + name);
        filesystem.writeFile(projectFolder + name + '/medias.json', projectJson, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('file created');
            }
        });
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
        var currentProjectJson = require("./../" + projectFolder + listProject[i] + "/medias.json");
        objProjectAndFiles = [currentProjectJson.name, currentProjectJson.medias.length];
        result.push(objProjectAndFiles);
    }
    return result;
}

function _getProjectJson(project) {
    var projectJson = require('../' + projectFolder + project + '/medias.json');
    return projectJson;
}

function _getAllProjectsJson() {
    var result = [];
    var listProject = filesystem.readdirSync('Projects');
    for (var i = 0; i < listProject.length; i++) {
        var json = require('../' + projectFolder + listProject[i] + '/medias.json');
        result.push(json);
    }
    return result;
}

module.exports = {
    createProject: function (name, projectJson) {
        return _createProject(name, projectJson);
    },
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    getProjectJson: function (project) {
        return _getProjectJson(project);
    },
    getAllProjectsJson: function () {
        return _getAllProjectsJson();
    }
};
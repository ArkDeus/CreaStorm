// to access to the file system to read folder content
var filesystem = require("fs");

var projectFolder = "Projects/";

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

function _createProject(name, projectJson, projectDirectories) {
    try {
        filesystem.mkdirSync(projectFolder + name);
        for (dir in projectDirectories) {
            filesystem.mkdirSync(projectFolder + name + '/' + projectDirectories[dir]);
            console.log(projectDirectories[dir]);
        }
        console.log(projectJson);
        console.log(projectDirectories);
        filesystem.writeFile(projectFolder + name + '/medias.json', projectJson, function (err) {
            if (err) console.log(err);
            else console.log('file created');
        });
    } catch (e) {
        return e;
    }
    return result;
}

function _getProjectJson(project) {
    var projectJson = require('../' + projectFolder + project + '/medias.json');
    return projectJson;
}

module.exports = {
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    createProject: function (name, projectJson, projectDirectories) {
        return _createProject(name, projectJson, projectDirectories);
    },
    getProjectJson: function (project) {
        return _getProjectJson(project);
    }
};
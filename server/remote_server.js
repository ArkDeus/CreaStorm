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

function _getAllFilesFromProject(name) {
    var result = [];
    try {
        filesystem.readdirSync(projectFolder + name).forEach(function (file) {
            file = projectFolder + name + '/' + file;
            result.push([file, mime.lookup(file)]);
        });
    } catch (e) {
        return e;
    }
    return result;
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
    var listFile;
    var objProjectAndFiles;
    var listProject = filesystem.readdirSync('Projects');
    for (var i = 0; i < listProject.length; i++) {
        listFile = _getAllFilesFromProject(listProject[i]);
        objProjectAndFiles = [listProject[i], listFile];
        result.push(objProjectAndFiles);
    }
    return result;
}

module.exports = {
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    createProject: function (name) {
        return _createProject(name);
    },
    getAllFilesFromProject: function (name) {
        return _getAllFilesFromProject(name);
    },
    getAllFilesFromProjectByExtention: function (name, ext) {
        return _getAllFilesFromProjectByExtention(name, ext);
    }
};
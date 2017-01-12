// to access to the file system to read folder content
var filesystem = require("fs");

var json = "";

var projectFolder = "Projects/";

function _getAllFilesFromProject(dir) {

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
    return filesystem.readdirSync('Projects');
}

module.exports = {
    getAllFilesFromProject: function (dir) {
        // clear the json
        json = "";
        return _getAllFilesFromProject(dir);
    },
    getAllProjectsName: function () {
        return _getAllProjectsName();
    },
    createProject: function (name) {
        return _createProject(name);
    }
};
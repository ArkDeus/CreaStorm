// to access to the file system to read folder content
var filesystem = require("fs");

var json = "";

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

module.exports = {
    getAllFilesFromFolder: function (dir) {
        // clear the json
        json = "";
        return _getAllFilesFromFolder(dir);
    }
};
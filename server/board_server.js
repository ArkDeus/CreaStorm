function _getTabFromTag(tag) {
    var parsedJSON = require('./../medias.json');
    
    for (var i = 0; i < parsedJSON.medias.length; i++) {
        if (!parsedJSON.medias[i].tags.includes(tag)) {
            // console.log("j'ai supprime : " + parsedJSON.medias[i].url);
            parsedJSON.medias.splice(i, 1);
        }
    }
// console.log(parsedJSON);
    return parsedJSON;
}



module.exports = {
    getTabFromTag: function(tag) {
        return _getTabFromTag(tag);
    }
};
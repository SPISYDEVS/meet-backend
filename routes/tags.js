let c = require('../config/cache');
let cache = c.cache;
let resetTagsCache = c.resetTagsCache;

let firebase = require('../config/firebase');


let express = require('express');
let router = express.Router();


function getAllTags(callback) {
    let data = cache.get('tags');

    if (data === undefined) {
        resetTagsCache(function(err, data) {
            callback(err, data);
        });
    }
    else {
        callback(null, data);
    }
}


module.exports = router;
module.exports.getAllTags = getAllTags;
let c = require('../config/cache');
let cache = c.cache;
let resetUsersCache = c.resetUsersCache;

let firebase = require('../config/firebase');


let express = require('express');
let router = express.Router();


function getAllUsers(callback) {
    let data = cache.get('users');

    if (data === undefined) {
        resetUsersCache(function(err, data) {
            callback(err, data);
        });
    }
    else {
        callback(null, data);
    }
}


module.exports = router;
module.exports.getAllUsers = getAllUsers;
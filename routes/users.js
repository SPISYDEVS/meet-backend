let c = require('../config/cache');
let cache = c.cache;
let resetUsersCache = c.resetUsersCache;

let firebase = require('../config/firebase');
let database = firebase.database;


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


function filterUsers(data, substring) {
    let results = [];
    for (let key in data) {
        let user = data[key];
        let email = user.email !== undefined ? user.email.split("@")[0] : undefined;

        let matchedEmail = email !== undefined ? email.toLowerCase().indexOf(substring) !== -1 : false;
        let matchedLast = user.lastName !== undefined ? user.lastName.toLowerCase().indexOf(substring) !== -1 : false;
        let matchedFirst = user.firstName !== undefined ? user.firstName.toLowerCase().indexOf(substring) !== -1 : false;

        if (matchedEmail || matchedLast || matchedFirst) {
            var obj = {};
            obj[key] = user;
            results.push(obj);
        }
    }
    return results;
}


router.get('/search', function (req, res) {
    if (req.query.query === undefined) {
        res.send({
            error: 'Must provide query parameter \'query\''
        });
    }
    else {
        let queryText = req.query.query.toLowerCase();
        getAllUsers(function(err, data) {
            if (data !== null) {
                let results = filterUsers(data, queryText);
                res.send(results);
            }
            else {
                res.send({
                    error: 'Unable to load users data'
                });
            }
        });
    }
});



module.exports = router;
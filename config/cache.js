let firebase = require('../config/firebase');
let database = firebase.database;


let NodeCache = require('node-cache');

// Cache resets every 2 minutes by default
let cache = new NodeCache({
    checkperiod: 90,
    stdTTL: 120
});


function resetUsersCache(callback) {
    database.ref('users').orderByKey().once('value', function(data) {
        cache.set("users", data.val(), function(err, success) {
            if (!err && success) {
                callback(null, data.val());
            }
            else {
                callback(err, null);
            }
        })
    });
}


function resetEventsCache(callback) {
    database.ref('events').orderByKey().once('value', function(data) {
        cache.set("events", data.val(), function(err, success) {
            if (!err && success) {
                callback(null, data.val());
            }
            else {
                callback(err, null);
            }
        });
    });
}


cache.on('expired', function(key, value) {
    console.log(key);
    switch (key) {
        case 'users':
            resetUsersCache((err, data) => {});
            break;
        case 'events':
            resetEventsCache((err, data) => {});
            break;
        default:
    }
});


module.exports = {
    cache: cache,
    resetUsersCache: resetUsersCache,
    resetEventsCache: resetEventsCache
};
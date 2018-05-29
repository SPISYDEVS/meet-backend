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


let usersRef = database.ref('users');
let eventsRef = database.ref('events');

// Used to ignore the data that were already in firebase
let initialUsersDataLoaded = false;
let initialEventsDataLoaded = false;

// Reset cache whenever these events happen
usersRef.on('child_added', function(snapshot, prevChildKey) {
    if (initialUsersDataLoaded) {
        resetUsersCache((err, data) => {})
    }
});

usersRef.once('value', function(snapshot) {
    initialUsersDataLoaded = true;
});

usersRef.on('child_changed', function(snapshot) {
    resetUsersCache((err, data) => {})
});

usersRef.on('child_removed', function(snapshot) {
    resetUsersCache((err, data) => {})
});



eventsRef.on('child_added', function(snapshot, prevChildKey) {
    if (initialEventsDataLoaded) {
        console.log('Resetting cache');
        resetEventsCache((err, data) => {});
    }
});

eventsRef.once('value', function(snapshot) {
    initialEventsDataLoaded = true;
});

eventsRef.on('child_changed', function(snapshot) {
    resetEventsCache((err, data) => {});
});

eventsRef.on('child_removed', function(snapshot) {
    resetEventsCache((err, data) => {});
});



cache.on('expired', function(key, value) {
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
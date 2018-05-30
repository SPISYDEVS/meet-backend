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


function resetTagsCache(callback) {
    database.ref('tags').once('value', function(data) {
        let tags = data.val();
        // Cache only the tags' keys
        let tagKeys = Object.keys(tags);

        // tagKeys is an array of tags
        cache.set("tags", tagKeys, function(err, success) {
            if (!err && success) {
                callback(null, tagKeys);
            }
            else {
                callback(err, null);
            }
        });
    });
}


let usersRef = database.ref('users');
let eventsRef = database.ref('events');
let tagsRef = database.ref('tags');

// Used to ignore the data that were already in firebase
let initialUsersDataLoaded = false;
let initialEventsDataLoaded = false;
let initialTagsDataLoaded = false;

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



tagsRef.on('child_added', function(snapshot, prevChildKey) {
    if (initialEventsDataLoaded) {
        resetTagsCache((err, data) => {});
    }
});

tagsRef.once('value', function(snapshot) {
    initialTagsDataLoaded = true;
});

tagsRef.on('child_changed', function(snapshot) {
    resetTagsCache((err, data) => {});
});

tagsRef.on('child_removed', function(snapshot) {
    resetTagsCache((err, data) => {});
});



cache.on('expired', function(key, value) {
    switch (key) {
        case 'users':
            resetUsersCache((err, data) => {});
            break;
        case 'events':
            resetEventsCache((err, data) => {});
            break;
        case 'tags':
            resetTagsCache((err, data) => {});
            break;
        default:
    }
});


module.exports = {
    cache: cache,
    resetUsersCache: resetUsersCache,
    resetEventsCache: resetEventsCache,
    resetTagsCache: resetTagsCache
};
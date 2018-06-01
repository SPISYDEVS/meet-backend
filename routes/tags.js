let c = require('../config/cache');
let cache = c.cache;
let resetTagsCache = c.resetTagsCache;


let events = require('./events');
let getAllEvents = events.getAllEvents;

let firebase = require('../config/firebase');
let database = firebase.database;
let tagsRef = database.ref('tags');


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


router.get('/:tag', function(req, res) {
    let tag = req.params.tag;
    if (tag === undefined) {
        res.send({
            error: 'Must provide \'tag\' parameter'
        });
    }
    else {
        // Getting the eventIds associated with this tag
        tagsRef.child(`${tag}/events`).once('value', function(snapshot) {
            if (snapshot.val() === null) {
                res.send({
                    error: 'Invalid tag'
                });
                return;
            }

            // snapshot contains keys as eventId
            let results = {};
            let eventIds = Object.keys(snapshot.val());

            // Filling results with event data
            getAllEvents(function(err, data) {
                if (data !== null) {
                    eventIds.forEach(eventId => {
                        results[eventId] = data[eventId];
                    });

                    res.send({
                        data: {
                            events: results
                        }
                    });
                }
                else {
                    res.send({
                        error: 'Unable to load events data'
                    });
                }
            });
        })
    }
});


module.exports = router;
module.exports.getAllTags = getAllTags;
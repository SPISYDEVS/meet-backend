let GeoFire = require('geofire');

let c = require('../config/cache');
let cache = c.cache;
let resetEventsCache = c.resetEventsCache;

let users = require('./users');
let getAllUsers = users.getAllUsers;

let firebase = require('../config/firebase');
let geofireRef = firebase.geofireRef;
let database = firebase.database;


let express = require('express');
let router = express.Router();



function dateDiff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first)/(1000*60*60*24));
}


function getAllEvents(callback) {
    let data = cache.get('events');

    if (data === undefined) {
        resetEventsCache(function(err, data) {
            callback(err, data);
        });
    }
    else {
        callback(null, data);
    }
}


router.get('/all', function (req, res) {
    getAllEvents(function(err, data) {
        if (data !== null) {
            res.send({
                data: data
            });
        }
        else {
            res.send({
                error: 'Unable to load events data'
            });
        }
    });
});


function filterFeedData(events, users, center, daysFromNow, radius) {
    let eventObject = {};
    let userObject = {};
    let today = Date.now();
    for (let key in events) {
        let event = events[key];
        let lat = event.location.latitude;
        let lng = event.location.longitude;
        let location = [lat, lng];
        let distanceFromCenter = GeoFire.distance(center, location);
        let withinRadius = distanceFromCenter <= radius;
        if (!withinRadius)
            continue;

        let startDate = event.startDate;
        let dayDiff = dateDiff(today, startDate);
        const now = Date.now();
        let withinTime = startDate >= now && dayDiff < daysFromNow;

        // Satisfies both time and distance requirements
        if (withinTime) {
            eventObject[key] = event;
            userObject[event.hostId] = users[event.hostId];
        }
    }
    return {
        data: {
            events: eventObject,
            hosts: userObject
        }
    }
}


router.get('/feed', function (req, res) {
    // Validation
    let radius = req.query.radius;
    let daysFromNow = req.query.daysFromNow;
    let lat = req.query.lat;
    let lng = req.query.lng;
    if (radius === undefined || daysFromNow === undefined || lat === undefined || lng === undefined) {
        res.send({
            error: 'Must provide query parameters \'radius\', \'daysFromNow\', \'lat\', and \'lng\''
        });
    }
    else {
        radius = Number(radius);
        daysFromNow = Number(daysFromNow);
        lat = Number(lat);
        lng = Number(lng);
        let center = [lat, lng];

        // Counting async requests to keep track when both requests have finished
        let asyncCount = 0;
        let eventsData = null;
        let usersData = null;

        getAllEvents(function(err, data) {
            if (data !== null) {
                eventsData = data;
                asyncCount += 1;
                if (asyncCount === 2) {
                    res.send(filterFeedData(eventsData, usersData, center, daysFromNow, radius));
                }
            }
            else {
                res.send({
                    error: 'Unable to load events data'
                });
            }
        });
        getAllUsers(function(err, data) {
            if (data !== null) {
                usersData = data;
                asyncCount += 1;
                if (asyncCount === 2) {
                    res.send(filterFeedData(eventsData, usersData, center, daysFromNow, radius));
                }
            }
            else {
                res.send({
                    error: 'Unable to load users data'
                })
            }
        });

    }
});



module.exports = router;
module.exports.getAllEvents = getAllEvents;
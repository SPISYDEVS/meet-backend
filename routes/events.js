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

        const geoQuery = geofireRef.query({
            center: [lat, lng],
            radius: radius
        });

        const eventIds = [];

        const onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {
            eventIds.push(key);
        });

        getAllEvents(function(err, events) {
            if (events !== null) {
                geoQuery.on("ready", function () {
                    Promise.all(eventIds.map(id => {
                        return {
                            key: id,
                            value: events[id]
                        }
                    }))
                        .then(events => {
                            const eventObject = {};
                            let userIds = [];

                            // Filter events by date
                            let today = Date.now();

                            events.forEach(event => {
                                // let eventDate = new Date(event.value.startDate);
                                let dayDiff = dateDiff(today, event.value.startDate);
                                if (dayDiff >= 0 && dayDiff < daysFromNow) {
                                    eventObject[event.key] = event.value;
                                    userIds.push(event.value.hostId);
                                }
                            });

                            getAllUsers(function(err, users) {
                                if (users !== null) {
                                    let userObject = {};
                                    userIds.forEach(id => {
                                        userObject[id] = users[id];
                                    });

                                    res.send({
                                        data: {
                                            events: eventObject,
                                            hosts: userObject
                                        }
                                    });
                                }
                                else {
                                    res.send({
                                        error: 'Unable to load users data'
                                    });
                                }
                            });

                        })
                        .catch((error) => {
                            res.send({
                                error: error
                            });
                        });


                    // This will fire once the initial data is loaded, so now we can cancel the "key_entered" event listener
                    onKeyEnteredRegistration.cancel();
                });
            }
            else {
                res.send({
                    error: 'Unable to load events data'
                });
            }
        });

    }
});



module.exports = router;
module.exports.getAllEvents = getAllEvents;
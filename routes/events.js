let c = require('../config/cache');
let cache = c.cache;
let resetEventsCache = c.resetEventsCache;

let firebase = require('../config/firebase');
let database = firebase.database;


let express = require('express');
let router = express.Router();


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


function filterEventsTitle(data, substring) {
    let results = [];
    for (let key in data) {
        let event = data[key];
        let title = event.title.toLowerCase();
        if (title.indexOf(substring) !== -1) {
            var obj = {};
            obj[key] = event;
            results.push(obj);
        }
    }
    return results;
}


router.get('/all', function (req, res) {
    getAllEvents(function(err, data) {
        if (data !== null) {
            res.send(data);
        }
        else {
            res.send({
                error: 'Unable to load events data'
            });
        }
    })
});


router.get('/search', function (req, res) {
    if (req.query.title === undefined) {
        res.send({
            error: 'Must provide query parameter \'title\''
        });
    }
    else {
        let queryTitle = req.query.title.toLowerCase();
        getAllEvents(function(err, data) {
            if (data !== null) {
                let results = filterEventsTitle(data, queryTitle);
                res.send(results);
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
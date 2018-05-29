let c = require('../config/cache');
let cache = c.cache;
let resetEventsCache = c.resetEventsCache;

let firebase = require('../config/firebase');


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
    })
});


module.exports = router;
module.exports.getAllEvents = getAllEvents;
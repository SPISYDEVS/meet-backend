let c = require('../config/cache');
let cache = c.cache;


let events = require('./events');
let users = require('./users');
let tags = require('./tags');
let getAllEvents = events.getAllEvents;
let getAllUsers = users.getAllUsers;
let getAllTags = tags.getAllTags;


let express = require('express');
let router = express.Router();


function filterUsers(data, substring) {
    let results = {};
    for (let key in data) {
        let user = data[key];
        let email = user.email !== undefined ? user.email.split("@")[0] : undefined;

        let matchedEmail = email !== undefined ? email.toLowerCase().indexOf(substring) !== -1 : false;
        let matchedLast = user.lastName !== undefined ? user.lastName.toLowerCase().indexOf(substring) !== -1 : false;
        let matchedFirst = user.firstName !== undefined ? user.firstName.toLowerCase().indexOf(substring) !== -1 : false;

        if (matchedEmail || matchedLast || matchedFirst) {
            results[key] = user;
        }
    }
    return results;
}


function filterEventsTitle(data, substring) {
    let results = {};
    for (let key in data) {
        let event = data[key];
        let title = event.title.toLowerCase();
        if (title.indexOf(substring) !== -1) {
            results[key] = event;
        }
    }
    return results;
}


function filterTags(data, substring) {
    let results = {};
    data.forEach(tag => {
        let tagLower = tag.toLowerCase();
        if (tagLower.indexOf(substring) !== -1) {
            results[tag] = true;
        }
    });
    return results;
}


router.get('/users', function (req, res) {
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
                res.send({
                    data: results
                });
            }
            else {
                res.send({
                    error: 'Unable to load users data'
                });
            }
        });
    }
});


router.get('/events', function (req, res) {
    if (req.query.query === undefined) {
        res.send({
            error: 'Must provide query parameter \'query\''
        });
    }
    else {
        let queryTitle = req.query.query.toLowerCase();
        getAllEvents(function(err, data) {
            if (data !== null) {
                let results = filterEventsTitle(data, queryTitle);
                res.send({
                    data: results
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


router.get('/tags', function (req, res) {
    if (req.query.query === undefined) {
        res.send({
            error: 'Must provide query parameter \'query\''
        });
    }
    else {
        let query = req.query.query.toLowerCase();
        getAllTags(function(err, data) {
            if (data !== null) {
                let results = filterTags(data, query);
                res.send({
                    data: results
                });
            }
            else {
                res.send({
                    error: 'Unable to load tags data'
                });
            }
        });
    }
});


router.get('/all', function (req, res) {
    if (req.query.query === undefined) {
        res.send({
            error: 'Must provide query parameter \'title\''
        });
    }
    else {
        let queryText = req.query.query.toLowerCase();
        let results = {};
        results['data'] = {};

        var count = 0;
        getAllEvents(function (err, data) {
            if (data !== null) {
                results['data']['events'] = filterEventsTitle(data, queryText);
            }
            else {
                if (results['error'] === undefined)
                    results['error'] = [];
                results['error'].push('Unable to load events data');
            }
            count++;
            if (count === 3)
                res.send(results);
        });
        getAllUsers(function(err, data) {
            if (data !== null) {
                results['data']['users'] = filterUsers(data, queryText);
            }
            else {
                if (results['error'] === undefined)
                    results['error'] = [];
                results['error'].push('Unable to load users data');
            }
            count++;
            if (count === 3)
                res.send(results);
        });
        getAllTags(function(err, data) {
            if (data !== null) {
                results['data']['tags'] = filterTags(data, query);
            }
            else {
                if (results['error'] === undefined)
                    results['error'] = [];
                results['error'].push('Unable to load tags data');
            }
            count++;
            if (count === 3)
                res.send(results);
        });
    }
});


module.exports = router;
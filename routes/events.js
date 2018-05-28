var firebase = require('../config/firebase');
var database = firebase.database;


var express = require('express');
var router = express.Router();


router.get('/all', function (req, res, next) {
    var ref = database.ref('events');
    ref.orderByKey().once('value', function(data) {
        res.send(data.val());
    });
});

module.exports = router;
let firebase = require('../config/firebase');
let database = firebase.database;


let express = require('express');
let router = express.Router();


router.get('/all', function (req, res, next) {
    let ref = database.ref('events');
    ref.orderByKey().once('value', function(data) {
        res.send(data.val());
    });
});

module.exports = router;
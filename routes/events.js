let firebase = require('../config/firebase');
let database = firebase.database;


let express = require('express');
let router = express.Router();


router.get('/all', function (req, res) {
    let ref = database.ref('events');
    ref.orderByKey().once('value', function(data) {
        res.send(data.val());
    });
});


router.get('/search', function (req, res) {
    if (req.query.title === undefined) {
        res.send({
            error: 'Must provide query parameter \'title\''
        });
    }
    else {
        let queryTitle = req.query.title.toLowerCase();
        let ref = database.ref('events');
        ref.orderByKey().once('value', function(data) {
            let results = [];
            data.forEach(snapshot => {
                let title = snapshot.val().title.toLowerCase();
                if (title.indexOf(queryTitle) !== -1) {
                    results.push(snapshot);
                }
            });
            res.send(results);
        });
    }
});



module.exports = router;
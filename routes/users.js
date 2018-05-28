let firebase = require('../config/firebase');
let database = firebase.database;


let express = require('express');
let router = express.Router();


router.get('/search', function (req, res) {
    if (req.query.query === undefined) {
        res.send({
            error: 'Must provide query parameter \'query\''
        });
    }
    else {
        let queryText = req.query.query.toLowerCase();
        let ref = database.ref('users');
        ref.orderByKey().once('value', function(data) {
            let results = [];
            data.forEach(snapshot => {
                let user = snapshot.val();
                let email = user.email !== undefined ? user.email.split("@")[0] : undefined;

                let matchedEmail = email !== undefined ? email.toLowerCase().indexOf(queryText) !== -1 : false;
                let matchedLast = user.lastName !== undefined ? user.lastName.toLowerCase().indexOf(queryText) !== -1 : false;
                let matchedFirst = user.firstName !== undefined ? user.firstName.toLowerCase().indexOf(queryText) !== -1 : false;

                if (matchedEmail || matchedLast || matchedFirst) {
                    results.push(snapshot);
                }
            });
            res.send(results);
        });
    }
});



module.exports = router;
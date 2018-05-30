let axios = require('axios');
let querystring = require('querystring');

let firebase = require('../config/firebase');
let database = firebase.database;

let express = require('express');
let router = express.Router();

let pushTokensRef = database.ref('pushTokens');


function sendPushNotifications(messages, callback) {
    axios({
        url: 'https://exp.host/--/api/v2/push/send',
        method: 'post',
        data: messages,
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
        }
    })
        .then(function(res) {
            callback(null, res);
    })
        .catch(function(err) {
            callback(err, null);
        });
}


router.post('/send', function(req, res) {
    let userIds = req.body.userIds;
    let title = req.body.title;
    let body = req.body.body;
    if (userIds === undefined || title === undefined || body === undefined) {
        res.send({
            error: 'Must include userIds, title, and body in the body of request'
        });
    }
    else {
        let ids = userIds.split(',');
        Promise.all(ids.map(id => {
            return pushTokensRef.child(`${id}/tokens`).once('value');
        }))
            .then(usersTokens => {
                let messages = [];

                usersTokens.forEach(userTokens => {
                    let tokens = userTokens.val();
                    for (let token in tokens) {
                        let obj = {};
                        obj['title'] = title;
                        obj['body'] = body;
                        obj['to'] = `ExponentPushToken[${token}]`;
                        obj['priority'] = 'high';
                        messages.push(obj);
                    }
                });
                console.log(messages);

                sendPushNotifications(messages, function(err, response) {
                    if (response !== null) {
                        res.send({
                            data: 'Successfully sent notifications'
                        });
                    }
                    else {
                        console.log(err);
                        res.send({
                            error: 'Error sending notification'
                        });
                    }
                })
            })
            .catch(error => {
                res.send({
                    error: 'Error fetching push notification tokens'
                });
            });
    }
});

module.exports = router;
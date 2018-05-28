let express = require('express');
let router = express.Router();


router.get('/', function (req, res, next) {
    res.send('My name is Heff');
});

module.exports = router;
var bodyParser = require('body-parser');

const express = require('express');
var homeRoutes = require('./routes/home');


const path = require('path');
const PORT = process.env.PORT || 5000;

var app = express();

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/home', homeRoutes);

module.exports = app;
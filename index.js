let bodyParser = require('body-parser');

const express = require('express');

let homeRoutes = require('./routes/home');
let eventsRoutes = require('./routes/events');
let usersRoutes = require('./routes/users');


const path = require('path');
const PORT = process.env.PORT || 5000;

let app = express();

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/** Routing **/
app.use('/api/home', homeRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);



module.exports = app;
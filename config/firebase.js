const firebase = require('firebase');
const c = require('./constants');
const geofire = require('geofire');

// Initialize Firebase
const config = {
    apiKey: c.FIREBASE_API_KEY,
    authDomain: c.FIREBASE_AUTH_DOMAIN,
    databaseURL: c.FIREBASE_DATABASE_URL,
    projectId: c.FIREBASE_PROJECT_ID,
    storageBucket: c.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: c.FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

const geofireRef = new geofire(firebase.database().ref('geofire'));
const database = firebase.database();
const auth = firebase.auth();

module.exports = {
    database: database,
    auth: auth,
    geofireRef: geofireRef
}
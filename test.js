'use strict';
var admin = require('firebase-admin');
var key = require('./serviceAccountKey');
admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: 'https://natural-notch-177618.firebaseio.com/'
});

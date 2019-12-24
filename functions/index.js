const functions = require('firebase-functions');
const admin = require("firebase-admin");
const firebase = require('firebase');
const config = require('./config/config.json');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: config.databaseURL
});

firebase.initializeApp(config);

const routes = require('./src/routes');

module.exports.app = functions.https.onRequest(routes);

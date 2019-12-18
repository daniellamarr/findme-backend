const functions = require('firebase-functions');
const admin = require("firebase-admin");
const config = require("./config/google-services.json");
const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: config.databaseURL
});

const routes = require("./src/routes");

module.exports.app = functions.https.onRequest(routes);
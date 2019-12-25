/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getEvents = (req, res) => {
	return db
		.collection("experiences")
		.get()
		.then(snapshot => {
			const data = snapshot.docs.map(doc => {
				return {...doc.data(), id: doc.id};
			});
			return res.status(200).send({
				success: true,
				message: "Experiences Retrieved",
                data
			});
		})
		.catch((error) =>
			res.status(500).send({
				success: false,
				message: error.message
			})
		);
};

module.exports = getEvents;

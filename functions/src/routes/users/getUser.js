/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getUser = (req, res) => {
	const {userId} = req.params;
	return db
		.collection("users")
		.doc(userId)
		.get()
		.then(docRef => {
			return res.status(200).send({
				success: true,
				message: "User Retrieved",
				data: {...docRef.data(), id: docRef.id}
			});
		})
		.catch(error => {
			res.status(500).send({
				success: false,
				message: error.message
			});
		});
};

module.exports = getUser;

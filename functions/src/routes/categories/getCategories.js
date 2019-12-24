/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getCategories = (req, res) => {
	return db
		.collection("categories")
		.get()
		.then(snapshot => {
			const data = snapshot.docs.map(doc => {
				return {...doc.data(), id: doc.id};
			});
			return res.status(200).send({
				success: true,
				message: "Categories Retrieved",
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

module.exports = getCategories;

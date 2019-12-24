/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const addCategory = (req, res) => {
	if (!req.body.name) {
		return res.status(400).json({
			success: false,
			message: "Category Name is required"
		});
	}
	return db
		.collection("categories")
		.add({
			name: req.body.name,
			updated: new Date().getTime(),
			created: new Date().getTime()
		})
		.then(docRef => {
			return res.status(201).send({
				success: true,
				message: "Category Added",
				data: {
					id: docRef.id,
					name: req.body.name
				}
			});
		})
		.catch(error =>
			res.status(500).send({
				success: false,
				message: error.message
			})
		);
};

module.exports = addCategory;

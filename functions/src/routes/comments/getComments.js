/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getComments = (req, res) => {
	return db
		.collection("comments")
		.where("experience", "==", req.query.experienceId)
		.get()
		.then(snapshot => {
			const data = snapshot.docs.map(doc => {
				return {...doc.data(), id: doc.id};
			});
			return res.status(200).send({
				success: true,
				message: "Comments Retrieved",
				data
			});
		})
		.catch(error =>
			res.status(500).send({
				success: false,
				message: error.message
			})
		);
};

module.exports = getComments;

/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const currentExperience = (req, res) => {
    const {id: userId} = req.payload;
	let experienceRef = db
		.collection("experiences")
		.where("currentAttendees", "array-contains", userId)
		.where("status", "==", "Open");

	return experienceRef
		.get()
		.then(snapshot => {
			const data = snapshot.docs.map(snap => {
				return {...snap.data(), id: snap.id};
			});
			return res.status(200).send({
				success: true,
				message: "Users Current Expereince Retrieved",
				data
			});
		})
		.catch(error => {
			return res.status(500).json({
				success: false,
				message: error.message,
				stack: error.stack
			});
		});
};

module.exports = currentExperience;

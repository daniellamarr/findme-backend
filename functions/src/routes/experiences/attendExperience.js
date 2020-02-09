/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const attendExperience = (req, res) => {
	const {id: userId} = req.payload;
	const {experienceId} = req.body;

	const experienceRef = db.collection("experiences").doc(experienceId);

	return experienceRef
		.get()
		.then(docRef => {
			if (!docRef.exists) {
				return res.status(404).json({
					success: false,
					message: "Experience not found"
				});
			}
			const oldExperienceData = {...docRef.data()};
			oldExperienceData.attendees.push(userId);

			const experienceData = {
				...oldExperienceData,
				updated: new Date().getTime()
			};
			return experienceRef.update(experienceData).then(() => {
				return res.status(200).send({
					success: true,
					message: "Hurray you're now an attendee",
					data: experienceData
				});
			});
		})
		.catch(error => {
			return res.status(500).send({
				success: false,
				message: error.message
			});
		});
};

module.exports = attendExperience;

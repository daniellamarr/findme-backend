/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const leaveExperience = (req, res) => {
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
			oldExperienceData.currentAttendees = oldExperienceData.currentAttendees.filter(attendeeId => {
                return attendeeId !== userId;
            });

			const experienceData = {
				...oldExperienceData,
				updated: new Date().getTime()
			};
			return experienceRef.update(experienceData).then(() => {
				return res.status(200).send({
					success: true,
					message: "Thank you for attending the experience",
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

module.exports = leaveExperience;

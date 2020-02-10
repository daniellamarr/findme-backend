/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const updateCommentStatus = (req, res) => {
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
			const experienceData = {...docRef.data()};
			if (userId !== experienceData.user) {
				return res.status(403).json({
					success: false,
					message: "You are unauthorized to perform this action"
				});
			}
			experienceData.commentsAllowed = !experienceData.commentsAllowed;
			experienceData.updated = new Date().getTime();

			return experienceRef.update(experienceData).then(() => {
				return res.status(200).send({
					success: true,
					message: "Experience Comments Status Updated",
					data: experienceData
				});
			});
		})
		.catch(() => {
			return res.status(500).send({
				success: false,
				message: error.message
			});
		});
};

module.exports = updateCommentStatus;

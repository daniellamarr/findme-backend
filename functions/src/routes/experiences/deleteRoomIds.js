/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const chatkit = require("../../helpers/chatkit");

const db = admin.firestore();

const deleteUserConnection = (req, res) => {
	const {experienceId} = req.params;
	if (!experienceId) {
		return res.status(400).json({
			success: false,
			message: "Missing some fields"
		});
	}
	const now = new Date().getTime();
	const experiencerRef = db.collection("experiences").doc(experienceId);

	return experiencerRef
		.get()
		.then(docRef => {
			const experienceData = {...docRef.data()};
			const checkEndTime = experienceData.endTime && experienceData.endTime > now;
			if(experienceData.status !== "Closed" && checkEndTime){
				return res.status(400).json({
					success: false,
					message: "Operation not allowed: Experience is still live"
				})
			}
			const deleteRoomIdsPromises = experienceData.roomIds.map(roomId => {
				return chatkit.asyncDeleteRoom({
					roomId: roomId
				});
			});
			return Promise.all(deleteRoomIdsPromises);
		})
		.then(() => {
			return res.status(200).send({
				success: true,
				message: "Experience Rooms Deletion in Progress"
			});
		})
		.catch(error => {
			return res.status(500).send({
				success: false,
				message: error.message
			});
		});
};

module.exports = deleteUserConnection;

/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const {chatkit} = require("../../helpers/chatkit");

const db = admin.firestore();

const deleteUserConnection = (req, res) => {
	const {roomId} = req.params;
	if (!roomId) {
		return res.status(400).json({
			success: false,
			message: "Missing some fields"
		});
	}
	return chatkit
		.asyncDeleteRoom({
			roomId: roomId
		})
		.then(({id: jobId}) => {
			return res.status(200).send({
				success: true,
				message: "Connection Deletion in Progress",
				data: {
					jobId
				}
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

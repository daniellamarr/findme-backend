/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const chatkit = require("../../helpers/chatkit");

const db = admin.firestore();

const connectToUser = (req, res) => {
	const {id: userId} = req.payload;
	const {secondUserId} = req.body;
	if (!secondUserId) {
		return res.status(400).json({
			success: false,
			message: "Missing some fields"
		});
	}
	return chatkit
		.createRoom({
			id: `${userId}-${secondUserId}-room`,
			creatorId: userId,
			name: `${userId}-${secondUserId}-room`,
			isPrivate: true,
			userIds: [secondUserId]
		})
		.then(() => {
			return res.status(201).send({
				success: true,
				message: "Connection Made",
				data: {
					roomId: `${userId}-${secondUserId}-room`
				}
			});
		})
		.catch(error => {
			return res.status(500).send({
				success: false,
				message: error.description || error.message
			});
		});
};

module.exports = connectToUser;

/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const chatkit = require("../../helpers/chatkit");

const db = admin.firestore();

const messageUser = (req, res) => {
	const {id: userId} = req.payload;
	const {roomId, message} = req.body;
	if (!roomId) {
		return res.status(400).json({
			success: false,
			message: "Missing some fields"
		});
	}
	return chatkit
		.sendSimpleMessage({
			userId,
			roomId,
			text: message
		})
		.then(() => {
			return res.status(200).send({
				success: true,
				message: "Message Sent"
			});
		})
		.catch(error => {
			return res.status(500).send({
				success: false,
				message: error.message
			});
		});
};

module.exports = messageUser;

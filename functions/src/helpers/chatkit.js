const Chatkit = require("@pusher/chatkit-server");
const env = require("../../config/env.json");

const {CHATKIT_INSTANCE_LOCATOR_ID, CHATKIT_SECRET_KEY} = env;

const chatkit = new Chatkit.default({
	instanceLocator: CHATKIT_INSTANCE_LOCATOR_ID,
	key: CHATKIT_SECRET_KEY
});

const deleteRoomIds = (db, experienceData, chatkit, action = "closed") => {
	const now = new Date().getTime();
	const checkEndTime = experienceData.endTime && experienceData.endTime > now;
	if (
		experienceData.status !== "Closed" &&
		checkEndTime &&
		action !== "deletion"
	) {
		throw new Error("Operation not allowed: Experience is still live");
	}
	const deleteRoomIdsPromises = experienceData.roomIds.map(roomId => {
		return chatkit.asyncDeleteRoom({
			roomId: roomId
		});
	});
	return deleteRoomIdsPromises;
};

module.exports = {chatkit, deleteRoomIds};

/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const {deleteFile} = require("../../middleware/gcloudStorage");
const {chatkit, deleteRoomIds} = require("../../helpers/chatkit");

const db = admin.firestore();

const updateExperience = (req, res) => {
	const {
		title,
		category,
		description,
		address,
		latlng,
		capacity,
		contactPhone,
		tags,
		type,
		status
	} = req.body;
	const {id} = req.params;
	const [imageUrl] = req.files;
	if (!id) {
		return res.status(400).json({
			success: false,
			message: "Experience ID is required"
		});
	}
	const types = {
		event: {
			startDate: req.body.startDate || null,
			endDate: req.body.endDate || null,
			price: req.body.price || null
		},
		place: {
			openingDays: req.body.openingDays || null,
			openingHours: req.body.openingHours || null,
			closingHours: req.body.closingHours || null
		}
	};
	const experienceRef = db.collection("experiences").doc(id);
	let experienceData, oldExperienceData;

	return experienceRef
		.get()
		.then(docRef => {
			if (!docRef.exists) {
				return res.status(404).json({
					success: false,
					message: "Experience not found"
				});
			}
			oldExperienceData = {...docRef.data()};
			if (userId !== oldExperienceData.user) {
				return res.status(403).json({
					success: false,
					message: "You are unauthorized to perform this action"
				});
			}
			const experienceReqData = {
				title,
				category,
				address,
				latlng,
				capacity,
				contactPhone,
				description,
				imageUrl: imageUrl || null,
				tags: tags || [],
				...types[type],
				status
			};
			const filteredReqData = Object.keys(experienceReqData).reduce(
				(newData, key) => {
					if (experienceReqData[key]) newData[key] = experienceReqData[key];
					return newData;
				},
				{}
			);

			experienceData = {
				...oldExperienceData,
				...filteredReqData,
				updated: new Date().getTime()
			};
			return experienceRef.update(experienceData);
		})
		.then(() => {
			const cleanUpPromises = [];
			if (imageUrl) {
				const urlSplit = oldExperienceData.imageUrl.split("/");
				cleanUpPromises.push(deleteFile(urlSplit[urlSplit.length - 1]));
			}
			if (experienceData.status === "Closed") {
				cleanUpPromises.push(...deleteRoomIds(db, experienceData, chatkit));
			}
			return Promise.all(cleanUpPromises);
		})
		.then(() => {
			return res.status(200).send({
				success: true,
				message: "Experience Updated",
				data: experienceData
			});
		})
		.catch(error => {
			if (imageUrl) {
				const urlSplit = imageUrl.split("/");
				return deleteFile(urlSplit[urlSplit.length - 1]).then(() => {
					return res.status(500).send({
						success: false,
						message: error.message
					});
				});
			}
			return res.status(500).send({
				success: false,
				message: error.message
			});
		});
};

module.exports = updateExperience;

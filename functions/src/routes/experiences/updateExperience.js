/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const gCloudFileActions = require("../../middleware/gcloudStorage");

const db = admin.firestore();

const updateExperience = (req, res) => {
	const {
		title,
		categoryId,
		description,
		address,
		capacity,
		contactPhone,
		tags,
		type
	} = req.body;
	const {id} = req.params;
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
	return experienceRef
		.get()
		.then(docRef => {
			const experienceReqData = {
				title,
				categoryId,
				address,
				capacity,
				contactPhone,
				description,
				imageUrl: req.file || null,
				tags: tags || [],
				...types[type]
			};
			const filteredReqData = Object.keys(experienceReqData).reduce(
				(newData, key) => {
					if (experienceReqData[key]) newData[key] = experienceReqData[key];
					return newData;
				},
				{}
			);
			const oldExperienceData = {...docRef.data()};
			const experienceData = {
				...oldExperienceData,
				...filteredReqData,
				updated: new Date().getTime()
			};
			return experienceRef.update(experienceData).then(() => {
				if (req.file) {
					const urlSplit = oldExperienceData.imageUrl.split("/");
					return gCloudFileActions
						.deleteFile(urlSplit[urlSplit.length - 1])
						.then(() =>
							res.status(200).send({
								success: true,
								message: "Experience Updated",
								data: experienceData
							})
						);
				}
				return res.status(200).send({
					success: true,
					message: "Experience Updated",
					data: experienceData
				});
			});
		})
		.catch(error => {
			if (req.file) {
				const urlSplit = req.file.split("/");
				return gCloudFileActions
					.deleteFile(urlSplit[urlSplit.length - 1])
					.then(() => {
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
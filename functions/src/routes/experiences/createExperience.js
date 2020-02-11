/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const {deleteFile} = require("../../middleware/gcloudStorage");

const db = admin.firestore();

const createExperience = (req, res) => {
	const {
		title,
		category,
		description,
		address,
		capacity,
		contactPhone,
		tags,
		type
	} = req.body;
	const [imageUrl] = req.files;
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
	const areExtraValuesComplete = Object.entries(
		types[type]
	).filter(([k, v], i) => Boolean(v));
	if (
		!title ||
		!category ||
		!description ||
		!address ||
		!capacity ||
		!contactPhone ||
		!areExtraValuesComplete ||
		!imageUrl
	) {
		return res.status(400).json({
			success: false,
			message: "Missing some fields"
		});
	}
	return db
		.collection("experiences")
		.add({
			title,
			category,
			description,
			address,
			capacity,
			contactPhone,
			type,
			...types[type],
			tags: tags && JSON.parse(tags) || [],
			attendees: [],
			commentsAllowed: true,
			imageUrl,
			status: "Open",
			user: req.payload.id,
			updated: new Date().getTime(),
			created: new Date().getTime()
		})
		.then(docRef => {
			return res.status(201).send({
				success: true,
				message: "Experience Created",
				data: {
					id: docRef.id,
					...req.body,
					imageUrl,
					tags: tags || [],
					user: req.payload.id
				}
			});
		})
		.catch(error => {
			const urlSplit = imageUrl.split("/");
			return deleteFile(urlSplit[urlSplit.length - 1])
				.then(() => {
					return res.status(500).send({
						success: false,
						message: error.message
					});
				});
		});
};

module.exports = createExperience;

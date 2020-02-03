/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getExperiences = (req, res) => {
	const now = new Date().getTime();
	const eventFilter = {
		all: experience => {
			return experience;
		},
		happening: experience => {
			return experience.startDate < now && experience.endDate > now;
		},
		upcoming: experience => {
			return experience.startDate > now;
		}
	};
	let experienceRef = db
		.collection("experiences")
		.where("type", "==", req.query.type);
	// Query Params
	if (req.query.category) {
		experienceRef = experienceRef.where("categoryId", "==", req.query.cateory);
	}
	return experienceRef
		.get()
		.then(snapshot => {
			let data = snapshot.docs.map(doc => {
				return {...doc.data(), id: doc.id};
			});
			if (req.query.type === "event") {
				data = data.filter(eventFilter[req.query.filter]);
			}
			return res.status(200).send({
				success: true,
				message: "Experiences Retrieved",
				data
			});
		})
		.catch(error =>
			res.status(500).send({
				success: false,
				message: error.message
			})
		);
};

module.exports = getExperiences;

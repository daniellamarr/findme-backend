/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const searchExperience = (req, res) => {
	let experienceRef = db.collection("experiences");
	const {keywords, ...fieldFilter} = req.query;

	Object.keys(fieldFilter).forEach(key => {
		const queryString = key.includes("attendees") ? "array-contains" : "==";
		experienceRef = experienceRef.where(key, queryString, req.query[key]);
	});

	return experienceRef
		.get()
		.then(snapshot => {
			let data = snapshot.docs.map(snap => {
				return {...snap.data(), id: snap.id};
			});
			if (keywords) {
				data = data.filter(experienceObj => {
					return Object.values(experienceObj)
                        .join(" ")
                        .toLowerCase()
						.includes(keywords.toLowerCase());
				});
			}

			return res.status(200).send({
				success: true,
				message: "Search Complete",
				data
			});
		})
		.catch(error => {
			return res.status(500).json({
				success: false,
				message: error.message,
				stack: error.stack
			});
		});
};

module.exports = searchExperience;

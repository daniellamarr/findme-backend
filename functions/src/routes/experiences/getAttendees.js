/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getAttendees = (req, res) => {
	const {id: userId} = req.payload;
	const {experienceId} = req.query;
	const experienceRef = db.collection("experiences").doc(experienceId);
	const userRef = db.collection("users").doc(userId);

	return userRef.get()
		.then(snapshot => {
			const signedInUser = snapshot.data();
			return experienceRef.get()
				.then(snapshot => {
					let data = [];
					const {attendees} = snapshot.data();
					const attendeesPromise = attendees.map(attendee => {
						return db.collection("users")
							.doc(attendee)
							.get()
							.then(snapshot => {
								const user = snapshot.data();
								user.id = snapshot.id;
								data.push({
									id: user.id,
									name: `${user.firstname} ${user.lastname}`,
									photo: user.photo,
									availabilityStatus: user.availabilityStatus,
									gender: user.gender,
									genderInterests: user.genderInterests,
									interests: user.interests
								});
								data = data.filter(attendee => {
									return signedInUser.genderInterests.includes(attendee.gender) &&
										attendee.availabilityStatus === 'Available';
								});
							});
					});
					return Promise.all(attendeesPromise)
						.then(() => {
							return res.status(200).send({
								success: true,
								message: "Attendees Retrieved",
								data
							});
						})
				})
				.catch(error => {
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack
					});
				});
		});
};

module.exports = getAttendees;

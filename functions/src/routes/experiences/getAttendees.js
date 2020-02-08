/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getAttendees = (req, res) => {
	//const {id: userId} = req.payload;
	const userId = "kjjxTGXIvcKy2u4dUe1f";
	const {experienceId} = req.query;
	const experienceRef = db.collection("experiences").doc(experienceId);
	const userRef = db.collection("users").doc(userId);

	let userData;
	let experienceData;

	return Promise.all(experienceRef.get(), userRef.get())
		.then(docRefs => {
			const [experienceDocRef, userDocRef] = docRefs;
			experienceData = {...experienceDocRef.data()};
			userData = {...userDocRef.data()};
			const attendeesPromises = experienceData.attendees.map(attendeeId => {
				return db
					.collection("users")
					.doc(attendeeId)
					.get();
			});
			return Promise.all(attendeesPromises);
		})
		.then(attendeesDocRefs => {
			let attendeesData = attendeesDocRefs.map(attendeeDocRef => {
				return {...attendeeDocRef.data()};
			});

			if (userId !== experienceData.user) {
				attendeesData = attendeesData.filter(attendee => {
					return userData.genderInterests.includes(attendee.gender);
				});
			}

			return res.status(200).json({
				success: true,
				message: "Attendees Retrieved",
				data: attendeesData
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

module.exports = getAttendees;

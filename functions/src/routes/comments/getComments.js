/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getComments = (req, res) => {
	return db
		.collection("comments")
		.where("experience", "==", req.query.experienceId)
		.orderBy('created', 'desc')
		.get()
		.then(snapshot => {
			const data = snapshot.docs.map(doc => {
				return {...doc.data(), id: doc.id};
			});

			const getCommentUsers = data.map(comment => {
				return db.collection("users")
					.doc(comment.user)
					.get()
					.then(snapshot => {
						const user = snapshot.data();
						comment.user = {
							id: snapshot.id,
							name: `${user.firstname} ${user.lastname}`,
							photo: user.photo
						}
					})
				});
			Promise.all(getCommentUsers).then(() => {
				return res.status(200).send({
					success: true,
					message: "Comments Retrieved",
					data
				});
			}).catch(err => {
				return res.status(500).send({
					success: false,
					message: err.message
				})
			})
		})
		.catch(error =>
			res.status(500).send({
				success: false,
				message: error.message
			})
		);
};

module.exports = getComments;

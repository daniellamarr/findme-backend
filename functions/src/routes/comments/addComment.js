/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const {deleteFile} = require("../../middleware/gcloudStorage");

const db = admin.firestore();

const addComment = (req, res) => {
    const {content, experience} = req.body;
    if (
		!content ||
		!experience
	) {
		return res.status(400).json({
			success: false,
			message: "Missing some fields"
		});
	}
    return db
		.collection("comments").add({
            content,
            images: req.files || [],
			experience,
			user: req.payload.id,
			updated: new Date().getTime(),
			created: new Date().getTime()
        }).then(docRef => {
            return res.status(201).send({
				success: true,
				message: "Comment Added",
				data: {
                    id: docRef.id,
                    content,
					images: req.files || [],
                    experience,
                    user: req.payload.id
				}
			});
        }).catch(error => {
            const fileDeletes = req.files.map(fileUrl => {
                const urlSplit = fileUrl.split("/");
                return deleteFile(urlSplit[urlSplit.length - 1]);
            })
			
			return Promise.all(fileDeletes) 
				.then(() => {
					return res.status(500).send({
						success: false,
						message: error.message
					});
				});
		});
};

module.exports = addComment;
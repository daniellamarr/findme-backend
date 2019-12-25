/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const {deleteFile} = require("../../middleware/gcloudStorage");

const db = admin.firestore();

const deleteExperience = (req, res) => {
	const {id} = req.params;
	if (!id) {
		return res.status(400).json({
			success: false,
			message: "ID is required"
		});
	}
	const experienceRef = db.collection("experiences").doc(id);

	return experienceRef
		.get()
		.then(docRef => {
            if(!docRef.exists){
                return res.status(404).json({
                    success: false,
                    message: 'Experience not found'
                })
            }
            const data = { ...docRef.data(), aid: docRef.id };
            if (data.user !== req.payload.id) {
                return res.status(401).json({
                    success: false,
                    message: 'You can only delete your own experiences',
                });
            }
            const urlSplit = data.imageUrl.split('/');
            return deleteFile(urlSplit[urlSplit.length - 1]);
        })
        .then(() => experienceRef.delete())
        .then(() => {
            return res.status(200).send({
				success: true,
				message: "Experience Deleted"
			});
        })
		.catch(error => {
			return res.status(500).send({
				success: false,
				message: error.message
			});
		});
};

module.exports = deleteExperience;

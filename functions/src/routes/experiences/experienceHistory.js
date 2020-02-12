/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const experienceHistory = (req, res) => {
    const {id: userId} = req.payload;
    let experienceRef = db.collection("experiences").where("allAttendees", "array-contains", userId);
    
    return experienceRef
        .get()
        .then(snapshot => {
            const data = snapshot.docs.map(snap => {
                return {...snap.data(), id: snap.id};
            });
            return res.status(200).send({
                success: true,
                message: "History Retrieved",
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

module.exports = experienceHistory;

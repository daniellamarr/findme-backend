/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const experienceHistory = (req, res) => {
    const {id: userId} = req.payload;
    const {type = 'all'} = req.query;
    let experienceRef = db.collection("experiences");

    if (type === 'current') {
        experienceRef = experienceRef
            .where("currentAttendees", "array-contains", userId)
            .where("status", "==", "Open")
    } else {
        experienceRef = experienceRef
            .where("allAttendees", "array-contains", userId)
    }
    
    return experienceRef
        .get()
        .then(snapshot => {
            const data = snapshot.docs.map(snap => {
                return {...snap.data(), id: snap.id};
            });
            return res.status(200).send({
                success: true,
                message: "History Retrieved",
                data: type === 'current' ? data[0] : data
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

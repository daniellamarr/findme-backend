/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');

const db = admin.firestore();

const UPDATE = (req, res) => {
  const {id} = req.payload;
  const {firstname, lastname, phoneNumber, interests} = req.body;

  return db.collection('users')
    .doc(id)
    .get()
    .then(snapshot => {
      if (!snapshot.exists) {
        return res.status(404).send({
          success: false,
          message: 'We could not find any data for this user'
        });
      }

      const data = snapshot.data();
      data.firstname = firstname || data.firstname;
      data.lastname = lastname || data.lastname;
      data.phoneNumber = phoneNumber || data.phoneNumber;
      data.interests = interests || data.interests;
      data.updated = new Date().getTime();

      return db.collection('users')
        .doc(id)
        .update(data)
        .then(() => {
          return res.status(200).send({
            success: true,
            message: 'User profile successfully updated',
            data
          });
        })
    })
    .catch(error => {
			return res.status(500).json({
        success: false,
				message: error.message
			});
		});
}

module.exports = UPDATE;

/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const generateToken = require('../../helpers/generateToken');

const db = admin.firestore();

const signin = (req, res) => {
  const {email} = req.socialAuth.user;
  return db.collection('users')
    .where('email', '==', email)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.status(404).send({
          success: false,
          message: 'You are not yet signed up to Findme'
        });
      }
      let data;
      snapshot.forEach(doc => {
        data = doc.data();
        data.id = doc.id;
      });
      return res.status(200).send({
        success: true,
        message: 'You have successfully logged in to Findme',
        data: {
          user: data,
          token: generateToken(data, '1y')
        }
      })
    })
		.catch(error => {
			return res.status(500).json({
        success: false,
				message: error.message
			});
		});
};

module.exports = signin;

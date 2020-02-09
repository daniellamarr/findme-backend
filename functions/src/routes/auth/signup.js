/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const searchCollection = require('../../helpers/searchCollection');
const generateToken = require('../../helpers/generateToken');

const db = admin.firestore();

const signup = (req, res) => {
  const {type} = req.body;
  const {user, additionalUserInfo} = req.socialAuth;
  const {email, photoURL, phoneNumber} = user;
  const {profile} = additionalUserInfo;
  return searchCollection('users', { email }, ['email'])
    .then(check => {
      if (check) {
        return res.status(409).send({
          success: false,
          message: `${email} is already signed up, you should login instead`
        });
      }
      let firstname, lastname;
      if (type === 'facebook') {
        firstname = profile.first_name;
        lastname = profile.last_name;
      } else if (type === 'google') {
        firstname = profile.given_name;
        lastname = profile.family_name;
      }
      const userDetails = {
        firstname,
        lastname,
        email,
        phoneNumber,
        photo: photoURL,
        genderInterests: [],
        availabilityStatus: "Available",
        type,
        updated: new Date().getTime(),
        created: new Date().getTime()
      }
      return db.collection('users')
        .add(userDetails)
        .then(snap => {
          userDetails.id = snap.id;
          const token = generateToken(userDetails, '1y');
          return res.status(201).send({
            success: true,
            message: 'You have successfully signed up to Findme',
            data: {
              user: userDetails,
              token
            }
          })
        })
    })
		.catch(error => {
			return res.status(500).json({
        success: false,
				message: error.message
			});
		});
};

module.exports = signup;

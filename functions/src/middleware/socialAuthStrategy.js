const firebase = require('firebase');

const socialAuthStrategy = (req, res, next) => {
  const { data, type } = req.body;
  let credential;
  if (type === 'facebook') {
    credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
  } else if (type === 'google') {
    credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
  }
	firebase
		.auth()
		.signInWithCredential(credential)
		.then(user => {
      req.socialAuth = user;
      return next();
		})
		.catch(error => {
			return res.status(500).json({
        success: false,
				message: error.message
			});
		});
};

module.exports = socialAuthStrategy;

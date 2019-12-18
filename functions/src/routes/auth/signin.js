const firebase = require("firebase");

const signin = (req, res) => {
	const providers = {
		google: "GoogleAuthProvider",
		facebook: "FacebookAuthProvider"
	};
	var credential = firebase.auth[providers.req.body.type].credential(req.body.id_token);
	return firebase
		.auth()
		.signInWithCredential(credential)
		.catch(error => {
			return res.status(500).json({
                code: error.code,
                message: error.message,
                email: error.email
            });
		});
};

module.exports = signin;

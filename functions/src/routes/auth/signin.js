const firebase = require("firebase");

const signin = (req, res) => {
	const providers = {
		google: "GoogleAuthProvider",
		facebook: "FacebookAuthProvider"
	};
	const credential = firebase.auth[providers.req.body.type].credential(
		req.body.id_token
	);
	firebase
		.auth()
		.signInWithCredential(credential)
		.then(user => {
			return res.status(200).json({
				status: "success",
				message: "Authenticated",
				data: user ? user : "No user data"
			});
		})
		.catch(error => {
			return res.status(500).json({
				code: error.code,
				message: error.message,
				email: error.email
			});
		});
};

module.exports = signin;

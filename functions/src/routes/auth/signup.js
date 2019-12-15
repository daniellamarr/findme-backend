const admin = require('firebase-admin');

const signup = (req, res) => {
  const { token } = req.body;

  admin.auth().verifyIdToken(token)
    .then(() => {
      return
    })
    .catch(() => {})
}

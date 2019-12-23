const jwt = require('jsonwebtoken');
const env = require('../../config/env.json');

const verifyToken = (req, res, next) => {
  let token =		req.headers.authorization
		|| req.headers['x-access-token']
		|| req.query.token
		|| req.body.token;

  if (!token) {
    return res.status(401).send({
      success: false,
      message: 'You did not provide a token',
    });
  }

  return jwt.verify(token, env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: 'Your token is invalid or expired',
      });
    }

    req.payload = payload;
    return next();
  });
};

module.exports = verifyToken;

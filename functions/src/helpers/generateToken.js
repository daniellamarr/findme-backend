const jwt = require('jsonwebtoken');
const env = require('../../config/env.json');

const generateToken = (payload, expires = '24h') => {
  const token = jwt.sign(payload, env.TOKEN_SECRET, {
    expiresIn: expires,
  });
  return token;
};

module.exports = generateToken;

const socialAuthStrategy = require('./socialAuthStrategy');
const verifyToken = require('./verifyToken');
const {fileUpload} = require('./gcloudStorage');

module.exports = {
  socialAuthStrategy,
  verifyToken,
  fileUpload
}

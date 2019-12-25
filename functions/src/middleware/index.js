const socialAuthStrategy = require('./socialAuthStrategy');
const verifyToken = require('./verifyToken');
const gCloudFileActions = require('./gcloudStorage');

module.exports = {
  socialAuthStrategy,
  verifyToken,
  gCloudFileActions
}

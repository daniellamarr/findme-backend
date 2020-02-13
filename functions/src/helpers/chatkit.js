const Chatkit = require('@pusher/chatkit-server');
const env = require('../../config/env.json');

const {CHATKIT_INSTANCE_LOCATOR_ID,CHATKIT_SECRET_KEY} = env;

const chatkit = new Chatkit.default({
  instanceLocator: CHATKIT_INSTANCE_LOCATOR_ID,
  key: CHATKIT_SECRET_KEY,
});

module.exports = chatkit;
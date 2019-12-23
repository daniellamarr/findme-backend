const express = require('express');
const signin = require('./signin');
const signup = require('./signup');
const {socialAuthStrategy} = require('../../middleware');

const authRouter = express.Router();

authRouter.post('/signin', socialAuthStrategy, signin);
authRouter.post('/signup', socialAuthStrategy, signup);

module.exports = authRouter;

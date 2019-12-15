const express = require('express');
const authRouter = require('./auth');

const routes = express();
routes.use('auth', authRouter);

module.exports = routes;

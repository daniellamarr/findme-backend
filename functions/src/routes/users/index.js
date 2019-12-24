const express = require('express');
const UPDATE = require('./update');
const {verifyToken} = require('../../middleware');

const userRouter = express.Router();

userRouter.put('/', verifyToken, UPDATE);

module.exports = userRouter;

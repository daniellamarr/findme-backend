const {Router} = require('express');
const UPDATE = require('./update');
const {verifyToken} = require('../../middleware');

const userRouter = Router();

userRouter.put('/', verifyToken, UPDATE);

module.exports = userRouter;

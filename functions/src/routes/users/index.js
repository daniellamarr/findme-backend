const {Router} = require('express');
const UPDATE = require('./update');
const {verifyToken} = require('../../middleware');   
const getUser = require('./getUser');

const userRouter = Router();

userRouter.put('/', verifyToken, UPDATE);

userRouter.get('/:userId', verifyToken, getUser);

module.exports = userRouter;

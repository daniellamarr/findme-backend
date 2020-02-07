const {Router} = require('express');
const {verifyToken, fileUpload} = require('../../middleware');
const getComments = require('./getComments');
const addComment = require('./addComment');

const commentRouter = Router();

commentRouter.get('/', verifyToken, getComments);

commentRouter.post('/', verifyToken, fileUpload, addComment);

module.exports = commentRouter;

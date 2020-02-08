const {Router} = require('express');
const {verifyToken, fileUpload} = require('../../middleware');
const getComments = require('./getComments');
const addComment = require('./addComment');
const updateCommentStatus = require('./updateCommentStatus');

const commentRouter = Router();

commentRouter.get('/', verifyToken, getComments);

commentRouter.post('/', verifyToken, fileUpload, addComment);

commentRouter.patch("/status", verifyToken, updateCommentStatus);

module.exports = commentRouter;

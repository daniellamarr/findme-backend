const {Router} = require('express');
const {verifyToken} = require('../../middleware');
const getCategories = require('./getCategories');
const addCategory = require('./addCategory');

const categoryRouter = Router();

categoryRouter.get('/', verifyToken, getCategories);

categoryRouter.post('/', verifyToken, addCategory);

module.exports = categoryRouter;

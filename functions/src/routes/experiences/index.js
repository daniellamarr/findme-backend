const {Router} = require('express');
const {verifyToken, fileUpload} = require('../../middleware');
const getExperiences = require('./getExperiences');
const createExperience = require('./createExperience');
const deleteExperience = require('./deleteExperience');
const updateExperience = require('./updateExperience');

const experienceRouter = Router();

experienceRouter.get('/', verifyToken, getExperiences);

experienceRouter.post('/', verifyToken, fileUpload, createExperience);

experienceRouter.put('/:id',verifyToken, fileUpload, updateExperience);

experienceRouter.delete('/:id', verifyToken, deleteExperience);

module.exports = experienceRouter;

const {Router} = require('express');
const {verifyToken, gCloudFileActions} = require('../../middleware');
const getExperiences = require('./getExperiences');
const createExperience = require('./createExperience');
const deleteExperience = require('./deleteExperience');
const updateExperience = require('./updateExperience');

const experienceRouter = Router();

experienceRouter.get('/', verifyToken, getExperiences);

experienceRouter.post('/', verifyToken, gCloudFileActions.fileUpload, createExperience);

experienceRouter.put('/:id', verifyToken, gCloudFileActions.fileUpload, updateExperience);

experienceRouter.delete('/:id', verifyToken, deleteExperience);

module.exports = experienceRouter;
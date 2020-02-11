const {Router} = require("express");
const {verifyToken, fileUpload} = require("../../middleware");
const getExperiences = require("./getExperiences");
const createExperience = require("./createExperience");
const deleteExperience = require("./deleteExperience");
const updateExperience = require("./updateExperience");
const attendExperience = require("./attendExperience");
const getAttendees = require("./getAttendees");
const leaveExperience = require('./leaveExperience');

const experienceRouter = Router();

experienceRouter.get("/", verifyToken, getExperiences);

experienceRouter.post("/", verifyToken, fileUpload, createExperience);

experienceRouter.put("/attend", verifyToken, attendExperience);

experienceRouter.put('/leave', verifyToken, leaveExperience);

experienceRouter.put("/:id", verifyToken, fileUpload, updateExperience);

experienceRouter.delete("/:id", verifyToken, deleteExperience);

experienceRouter.get("/attendees", verifyToken, getAttendees);

module.exports = experienceRouter;

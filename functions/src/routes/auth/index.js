const express = require("express");
const signin = require("./signin");

const authRouter = express.Router();

authRouter.use("/signin", signin);

module.exports = authRouter;

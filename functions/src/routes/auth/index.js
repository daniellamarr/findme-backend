const express = require("express");
const signin = require("./signin");

const authRouter = express.Router();

authRouter.post("/signin", signin);

module.exports = authRouter;

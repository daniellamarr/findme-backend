const {Router} = require("express");
const UPDATE = require("./update");
const {verifyToken} = require("../../middleware");
const getUser = require("./getUser");
const connectToUser = require("./connectToUser");
const deleteUserConnection = require("./deleteUserConnection");
const messageUser = require("./messageUser");

const userRouter = Router();

userRouter.put("/", verifyToken, UPDATE);

userRouter.get("/:userId", verifyToken, getUser);

userRouter.post("/connect", verifyToken, connectToUser);

userRouter.delete(
	"/delete-connection/:roomId",
	verifyToken,
	deleteUserConnection
);

userRouter.post("/message", verifyToken, messageUser);

module.exports = userRouter;

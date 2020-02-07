const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./auth');
const userRouter = require('./users');
const categoryRouter = require('./categories');
const experienceRouter = require('./experiences');
const commentRouter = require('./comments');

const routes = express();
routes.use(bodyParser.urlencoded({extended: false}));
routes.use(bodyParser.json());
// Enable CORS
routes.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, Authorization"
	);
	res.header(
		"Access-Control-Request-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, Authorization"
	);
	next();
});

routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/categories', categoryRouter);
routes.use('/experiences', experienceRouter);
routes.use('/comments', commentRouter);

module.exports = routes;

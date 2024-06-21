const express = require('express');
const morgan = require("morgan");
const tourRouter = require("./Routers/toursRouter");
const AppError = require("./utils/appError")
const globalErrorHandler = require("./Controllers/errorController")
const userRouter = require("./Routers/userRouter")


const app = express();
app.use(express.json());

if(process.env.NODE_ENV === "development"){
	app.use(morgan('dev'));
}
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
	
	next((new AppError(`can't find ${req.originalUrl} on this server.`, 404, "fail")));
})

app.use(globalErrorHandler)

module.exports = app;


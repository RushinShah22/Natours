const { isObjectIdOrHexString } = require("mongoose");
const AppError = require("../utils/appError");

const sendDevError = (res, err) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack
	});
}

const sendProdError = (res, err) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.statusCode === 500 ? "Something Went Wrong." : err.message
	});
}


module.exports = (err, req, res, next) => {
	let error = Object.assign(err);
	error.statusCode = error.statusCode || 500;
	error.status = error.status || "error";

	// Invalid Database ID
	if(err.name === "CastError"){
		error = new AppError(`Invalid Database ${err.path}:${err.value}`, 400, "fail");
	}

	// Duplicate values error
	if(err.code === 11000){
		error = new AppError(`A tour with '${Object.keys(err.keyValue)[0]} : ${Object.values(err.keyValue)[0]}' already exists!!!`, 400, "fail");
	}

	// Validation Error
	if(err.name === "ValidationError"){
		let message = 'Validation Failed: ';
	
		for(x of Object.values(err.errors)){
			message += x.message + ",";
		}
		
		message = message.slice(0, message.length - 1);
		error = new AppError(message, 400, "fail");
	}


	if(process.env.NODE_ENV === "development")sendDevError(res, error);
	else sendProdError(res, error);
}
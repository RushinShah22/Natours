 class AppError extends Error{
    constructor(message, statusCode, status){
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.operationalError = true;

        Error.captureStackTrace(this, this.constructor);
    }
 }

 module.exports = AppError;
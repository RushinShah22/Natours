const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routers/toursRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const userRouter = require('./Routers/userRouter');
const xss = require('xss-clean');
const expressMongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

const app = express();

app.use(
  rateLimit({
    max: 100,
    windowMS: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
);

app.use(expressMongoSanitize());
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

app.use(xss());
app.use(
  hpp({
    whitelist: ['difficulty', 'duration', 'ratingAverage', 'ratings'],
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(`can't find ${req.originalUrl} on this server.`, 404, 'fail')
  );
});

app.use(globalErrorHandler);

module.exports = app;

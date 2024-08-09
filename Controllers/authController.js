const UserModel = require('./../Model/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

exports.signup = catchAsyncError(async (req, res) => {
  const newUser = await UserModel.create(req.body);
  const token = createToken(newUser._id);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token,
    },
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Incorrect email.', 401));
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Password.', 401));
  }

  res.status(200).json({
    status: 'success',
    data: {
      token: createToken(user._id),
    },
  });
});

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message:
        'You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n' +
        resetURL +
        '\n\n If you did not request this, please ignore this email and your password will remain unchanged.',
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.protect = catchAsyncError(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await UserModel.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You cannot access this route.', 403));
    }
    next();
  };
};

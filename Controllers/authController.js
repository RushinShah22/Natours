const User = require("./../Model/userModel");
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

exports.signup = catchAsyncError(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photo: req.body.photo
  });
  newUser.password = undefined;
  const token = createToken(newUser._id);
  res.cookie('jwt', token, {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Incorrect email.', 401));
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Password.', 401));
  }
  const token = createToken(user._id);
  res.cookie('jwt', token, {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'User Logged in Successfully.',
    data: {
      name: user.name,
      email: user.email,
      _id: user._id
    }
  });
});

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
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
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  let { token } = req.params;
  token = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  res.cookie('jwt', createToken(user._id), {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(201).json({
    status: 'success',
    message: 'Password successfully changed.',
  });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  if (String(req.user._id) !== req.params.id) {
    return next(
      new AppError('You are not authorized to perform this action.', 403)
    );
  }
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User Not Found.', 404));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = createToken(user._id);
  res.cookie('jwt', token, {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(201).json({
    status: 'success',
    message: 'User Updated successfully.',
    data: {
      user,
    },
  });
});


// Authentication and Authorization (Protect, RestrictTo)

exports.protect = catchAsyncError(async (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  const token = req.cookies.jwt;
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

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

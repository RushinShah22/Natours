const UserModel = require('./../Model/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

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

const UserModel = require('./../Model/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
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

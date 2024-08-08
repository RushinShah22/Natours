const UserModel = require('./../Model/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');

exports.signup = catchAsyncError(async (req, res) => {
  const newUser = await UserModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

const catchAsyncError = require('../utils/catchAsyncError');
const User = require('./../Model/userModel');
const AppError = require('../utils/appError');
const {getAll, getOne} = require("./handlerFactory");

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);

exports.deleteUser = catchAsyncError(async (req, res) => {
  if (String(req.user._id) !== req.params.id) {
    return next(
      new AppError('You are not authorized to perform this action.', 403)
    );
  }
  await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    { new: true, runValidators: true }
  );
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
  if (String(req.user._id) !== req.params.id) {
    console.log(req.user._id, req.params.id);
    return next(
      new AppError('You are not authorized to perform this action.', 403)
    );
  }
  const filterProps = ['name', 'email'];
  const updatedUserData = {};

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /changePassword',
        400
      )
    );
  }

  for (x of filterProps) {
    if (req.body[x]) {
      updatedUserData[x] = req.body[x];
    }
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    updatedUserData,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

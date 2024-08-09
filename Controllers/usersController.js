const fs = require('fs');
const catchAsyncError = require('../utils/catchAsyncError');
const UserModel = require('./../Model/userModel');
const AppError = require('../utils/appError');

exports.checkID = (req, res, next, val) => {
  fs.readFile(`${__dirname}/../dev-data/data/users.json`, (err, data) => {
    data = JSON.parse(data);
    const user = data.find((user) => val === user.id);
    if (!user) {
      return res.send('NO USER FOUND');
    }
    next();
  });
};

exports.getAllUsers = (req, res) => {
  fs.readFile(`${__dirname}/../dev-data/data/users.json`, (err, data) => {
    res.status(200).json(Object.assign({ message: 'ok' }, data));
  });
};

exports.getAUser = (req, res) => {
  fs.readFile(`${__dirname}/../dev-data/users.json`, (err, data) => {
    data = JSON.parse(data);
    const id = req.params(id) * 1;
    const user = data.find((val) => val.id === id);
    res.status(200).json(user);
  });
};

exports.deleteAUser = (req, res) => {
  fs.readFile(`${__dirname}/../dev-data/users.json`, (err, data) => {
    data = JSON.parse(data);
    const id = req.params(id) * 1;
    const user = data.find((val) => val.id === id);
    res.status(200).json(user);
  });
};

exports.updateUser = catchAsyncError(async (req, res, next) => {
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
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    updatedUserData,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!user) {
    return next(new AppError('No user found with that ID', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

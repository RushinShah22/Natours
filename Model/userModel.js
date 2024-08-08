const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is mandatory'],
    trim: true,
    maxlength: [50, 'A user name can be atmost 50 characters long.'],
  },
  email: {
    type: String,
    required: [true, 'Email is mandatory.'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email.',
    },
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password is mandatory.'],
    minlength: [8, 'Password must be atleast 8 characters long.'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirming Password is mandatory.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password and Confirm Password did not match.',
    },
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

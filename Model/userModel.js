const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    select: false,
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

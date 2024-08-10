const express = require('express');
const userController = require('./../Controllers/usersController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router.param('id', authController.protect);
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotpassword);
router.route('/resetPassword/:token').post(authController.resetPassword);
router.route('/changePassword/:id').patch(authController.updatePassword);
module.exports = router;

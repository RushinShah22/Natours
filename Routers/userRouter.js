const express = require('express');
const userController = require('./../Controllers/usersController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router.param('id', userController.checkID);
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getAUser)
  .delete(userController.deleteAUser);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotpassword);

module.exports = router;

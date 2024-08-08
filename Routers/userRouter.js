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

module.exports = router;

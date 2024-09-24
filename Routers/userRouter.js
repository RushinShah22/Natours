const express = require('express');
const {getUser, getAllUsers, deleteUser, updateUser} = require('./../Controllers/usersController');
const { protect, login, resetPassword, forgotpassword, signup, updatePassword } = require('./../Controllers/authController');

const router = express.Router();

// router.param('id', authController.protect);


router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotpassword);
router.route('/resetPassword/:token').post(resetPassword);

router.use(protect);

router.route('/').get(getAllUsers);
router
  .route('/:id')
  .get(getUser)
  .delete(deleteUser)
  .patch(updateUser);

router.route('/changePassword/:id').patch(updatePassword);
module.exports = router;

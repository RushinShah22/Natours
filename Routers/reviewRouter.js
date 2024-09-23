const { Router } = require('express');
const {
  getReviews,
  createReview,
} = require('./../Controllers/reviewController');

const {protect, restrictTo} = require("./../Controllers/authController")


const router = Router({mergeParams: true});

router.route('/').get(getReviews).post(protect, restrictTo('user'), createReview);

module.exports = router;

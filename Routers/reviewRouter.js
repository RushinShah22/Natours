const { Router } = require('express');
const {
  getReviewsOfTour,
  createReview,
  setIds,
  getReview
} = require('./../Controllers/reviewController');

const {protect, restrictTo} = require("./../Controllers/authController")


const router = Router({mergeParams: true});

router.route('/').get(getReviewsOfTour).post(protect, restrictTo('user'), setIds, createReview);
router.route("/:id").get(getReview)
module.exports = router;

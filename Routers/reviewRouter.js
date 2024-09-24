const { Router } = require('express');
const {
  getReviewsOfTour,
  createReview,
  setIds,
  getReview,
  updateReview,
  deleteReview
} = require('./../Controllers/reviewController');

const {protect, restrictTo} = require("./../Controllers/authController")


const router = Router({mergeParams: true});

router.use(protect);

router.route('/').get(getReviewsOfTour).post(restrictTo('user'), setIds, createReview);
router.route("/:id").get(getReview).patch(restrictTo('user', 'admin'), updateReview).delete(restrictTo('user', 'admin'), deleteReview);
module.exports = router;

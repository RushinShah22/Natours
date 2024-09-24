const {Router} = require('express');
const {getATour, getAllTours, monthlyPlan, patchTour, deleteTour, createTour, tourStats} = require('../Controllers/toursController');
const {protect, restrictTo} = require('./../Controllers/authController');
const reviewRouter = require("./reviewRouter");


const router = Router();

// router.param("id", toursController.checkID);

router.use("/:tourId/reviews", reviewRouter);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router.route('/tour-stats').get(protect, tourStats);
router.route('/monthly-plan/:year').get(monthlyPlan);

router
  .route('/:id')
  .get(getATour)
  .patch(
    protect,
    restrictTo('lead-guide', 'admin'),
    patchTour
  )
  .delete(
    protect,
    restrictTo('lead-guide', 'admin'),
    deleteTour
  );

module.exports = router;

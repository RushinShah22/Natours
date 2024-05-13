const express = require("express");
const toursController = require("../Controllers/toursController");

const router = express.Router();

// router.param("id", toursController.checkID);
router.route("/").get(toursController.getAllTours).post(toursController.createTour);
router.route("/tour-stats").get(toursController.tourStats);
router.route("/monthly-plan/:year").get(toursController.monthlyPlan);

router.route("/:id").get(toursController.getATour).patch(toursController.patchTour).delete(toursController.deleteTour);

module.exports = router;


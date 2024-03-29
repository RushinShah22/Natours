const express = require("express");
const userController = require("./../Controllers/usersController")

const router = express.Router();

router.param("id", userController.checkID);
router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getAUser).delete(userController.deleteAUser);

module.exports = router;
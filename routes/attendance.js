const express = require("express");
const userController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/userSignup", authController.userSignup);
router.post("/userLogin", authController.userLogin);


router.route("/");
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

router.route("/:id");
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;

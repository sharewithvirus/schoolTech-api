const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/adminSignup", authController.adminSignup);
router.post("/adminLogin", authController.adminLogin);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

// router.post("/updatePassword", authController.updatePassword);
// router.post("/updateMe", authController.protect, userController.updateMe);

// router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.route("/");
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

router.route("/:id");
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;

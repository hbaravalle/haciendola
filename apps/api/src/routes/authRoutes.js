const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/otp", authController.sendOTP);
router.post("/otp-check", authController.checkOTP);
router.post("/reset-password", authController.resetPassword);

module.exports = router;

const authController = require("../controllers/authController");
const { limitPerIp } = require("../middlewares/rateLimit");
const express = require("express");
const router = express.Router();

router.post("/otp", limitPerIp("otp", 10, 15), authController.requestCode);
router.post("/verify", limitPerIp("verify", 30, 15), authController.verifyCode);
router.post("/demo", limitPerIp("demo", 20, 15), authController.startDemo);

module.exports = router;

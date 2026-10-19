const response = require("../network/response");
const userService = require("../services/userService");
const nodemailer = require("nodemailer");

const optGenerator = require("otp-generator");
const { User } = require("../models");

const jwt = require("jsonwebtoken");
const { MailtrapClient } = require("mailtrap");

async function login(req, res) {
  try {
    const user = await userService.find(req.body.user);
    if (user && (await user.validatePassword(req.body.password))) {
      const token = jwt.sign(
        { sub: user.id, iat: Date.now() },
        process.env.JWT_SECRET
      );
      return response.success(req, res, { token, email: user.email }, 200);
    } else {
      return response.error(req, res, "Invalid credentials", 404);
    }
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function register(req, res) {
  try {
    console.log(req.body);
    await userService.create(req.body);
    return response.success(req, res, "User registered", 201);
  } catch (err) {
    console.log(err);
    return response.error(req, res, "Cannot create user", 500);
  }
}

async function sendOTP(req, res) {
  const otp = optGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: true,
    specialChars: false,
  });
  const email = req.body.email;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) return response.error(req, res, "Email not found", 404);

    const transporter = nodemailer.createTransport({
      name: "test.com",
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
      debug: true,
    });

    const mailOptions = {
      from: process.env.NODEMAILER_FROM,
      to: email,
      subject: "Password reset",
      text: `Your OTP code to reset your password is: ${otp}.\nIf you did not request this code, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    user.otp = otp;
    await user.save();
    return response.success(req, res, "ok", 200);
  } catch (err) {
    console.error(err);
    return response.error(req, res, "Server error", 500);
  }
}

async function checkOTP(req, res) {
  try {
    console.log(req.body);
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user.otp === req.body.otp && user.email === req.body.email) {
      return response.success(req, res, "ok", 200);
    } else {
      return response.error(req, res, "Invalid code", 401);
    }
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function __sendOTP(req, res) {
  const otp = optGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: true,
    specialChars: false,
  });
  const email = req.body.email;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) return response.error(req, res, "Email not found", 404);
    const client = new MailtrapClient({ token: "484063a0e1bada" });
    await client.send({
      from: { email: process.env.NODEMAILER_FROM },
      to: [{ email: email }],
      subject: "Password reset",
      text: `Your OTP code to reset your password is: ${otp}.\nIf you did not request this code, please ignore this email.`,
    });
    console.log("OK OK OK OK");
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function resetPassword(req, res) {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return response.error(req, res, "Email not found", 404);
    }
    if (user.otp !== req.body.otp) {
      return response.error(req, res, "Invalid code", 401);
    }

    user.password = req.body.newPassword;
    user.otp = null;

    await user.save();

    return response.success(req, res, "User updated", 200);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

module.exports = { login, register, sendOTP, checkOTP, resetPassword };

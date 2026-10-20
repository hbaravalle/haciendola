require("dotenv").config();
const cors = require("cors");
const express = require("express");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cronRoutes = require("./routes/cronRoutes");
const attachBaseUrl = require("./middlewares/attachBaseUrl");
const response = require("./network/response");

// The Express app, shared by the local server (server.js) and the Vercel
// function (api/index.js).
const app = express();

// On Vercel the request goes through its proxy, which puts the visitor's IP
// in X-Forwarded-For. Trusting one hop lets the IP rate limits see it, and
// staying off locally keeps that header from being spoofed.
if (process.env.VERCEL) app.set("trust proxy", 1);

// WEB_ORIGIN (comma-separated) limits which sites can call the API; without
// it, any origin can, which is what local development needs.
app.use(
  cors({
    origin: process.env.WEB_ORIGIN ? process.env.WEB_ORIGIN.split(",") : true,
  })
);
app.use(express.json());
app.use(attachBaseUrl);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cron", cronRoutes);

app.use((req, res) => {
  return response.error(req, res, "Not found", 404);
});

module.exports = app;

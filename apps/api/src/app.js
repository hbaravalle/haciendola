require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cronRoutes = require('./routes/cronRoutes');
const attachBaseUrl = require('./middlewares/attachBaseUrl');
const response = require('./network/response');

const app = express();

// On Vercel the request goes through its proxy, which puts the visitor's IP
// in X-Forwarded-For. Trusting one hop lets the IP rate limits see it, and
// staying off locally keeps that header from being spoofed.
if (process.env.VERCEL) app.set('trust proxy', 1);

// WEB_ORIGIN (comma-separated) limits which sites can call the API; without
// it, any origin can, which is what local development needs.
app.use(
  cors({
    origin: process.env.WEB_ORIGIN ? process.env.WEB_ORIGIN.split(',') : true,
  }),
);
// A demo project: keep every API URL out of search results.
app.use((req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  next();
});
app.use(express.json());
app.use(attachBaseUrl);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cron', cronRoutes);

const FAVICONS = {
  '/favicon.ico': path.join(__dirname, '../public/favicon.ico'),
  '/favicon.svg': path.join(__dirname, '../public/favicon.svg'),
};
app.get(Object.keys(FAVICONS), (req, res) => {
  res.set('Cache-Control', 'public, max-age=604800');
  res.sendFile(FAVICONS[req.path]);
});

app.use((req, res) => {
  return response.error(req, res, 'Not found', 404);
});

module.exports = app;

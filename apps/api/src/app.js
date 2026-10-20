import 'dotenv/config';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express from 'express';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cronRoutes from './routes/cronRoutes.js';
import attachBaseUrl from './middlewares/attachBaseUrl.js';
import * as response from './network/response.js';

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
  '/favicon.ico': fileURLToPath(new URL('../public/favicon.ico', import.meta.url)),
  '/favicon.svg': fileURLToPath(new URL('../public/favicon.svg', import.meta.url)),
};
app.get(Object.keys(FAVICONS), (req, res) => {
  res.set('Cache-Control', 'public, max-age=604800');
  res.sendFile(FAVICONS[req.path]);
});

app.use((req, res) => {
  return response.error(req, res, 'Not found', 404);
});

export default app;

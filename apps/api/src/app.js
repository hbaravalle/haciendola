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

// Trust Vercel's proxy so rate limits see the client IP (off locally: spoofable).
if (process.env.VERCEL) app.set('trust proxy', 1);

// Without WEB_ORIGIN any origin is allowed (local dev).
app.use(
  cors({
    origin: process.env.WEB_ORIGIN ? process.env.WEB_ORIGIN.split(',') : true,
  }),
);
// Keep the API out of search results.
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

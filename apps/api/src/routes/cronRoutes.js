import crypto from "crypto";
import express from "express";
import * as response from "../network/response.js";
import { deleteExpiredAccounts } from "../services/cleanupService.js";

const router = express.Router();

// Only Vercel Cron, sending "Bearer <CRON_SECRET>", can trigger it.
function isVercelCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(req.get("authorization") ?? "");
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

router.get("/cleanup", async (req, res) => {
  if (!isVercelCron(req)) return response.error(req, res, "Unauthorized", 401);
  try {
    const deleted = await deleteExpiredAccounts();
    return response.success(req, res, deleted);
  } catch (err) {
    console.error("[Cleanup]", err);
    return response.error(req, res);
  }
});

export default router;

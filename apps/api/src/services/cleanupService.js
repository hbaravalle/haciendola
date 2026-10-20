import { Op } from "sequelize";
import { DEMO_EMAIL } from "@haciendola/shared";
import { User, LoginCode, RateLimit } from "../models/index.js";

// Lifetime of email accounts, catalog included.
const ACCOUNT_HOURS = 24;
const SWEEP_MINUTES = 60;

function accountExpiresAt(user) {
  return new Date(user.createdAt.getTime() + ACCOUNT_HOURS * 3_600_000);
}

function isExpired(user) {
  return user.email !== DEMO_EMAIL && accountExpiresAt(user) <= new Date();
}

// Deletes expired accounts (catalogs cascade), unused codes and old rate limits.
async function deleteExpiredAccounts() {
  const cutoff = new Date(Date.now() - ACCOUNT_HOURS * 3_600_000);
  const now = new Date();
  const accounts = await User.destroy({
    where: { email: { [Op.ne]: DEMO_EMAIL }, createdAt: { [Op.lt]: cutoff } },
    force: true,
  });
  const codes = await LoginCode.destroy({ where: { expires_at: { [Op.lt]: now } } });
  const rateLimits = await RateLimit.destroy({ where: { reset_at: { [Op.lt]: now } } });
  if (accounts || codes) {
    console.log(`[Cleanup] Deleted ${accounts} expired accounts and ${codes} unused codes`);
  }
  return { accounts, codes, rateLimits };
}

// At most hourly per instance. Logins call it too, between Vercel's daily crons.
let lastSweep = 0;
async function sweepIfDue() {
  if (Date.now() - lastSweep < SWEEP_MINUTES * 60_000) return;
  lastSweep = Date.now();
  try {
    await deleteExpiredAccounts();
  } catch (err) {
    console.error("[Cleanup]", err);
  }
}

// Local server only: sweep now and every hour.
function scheduleCleanup() {
  sweepIfDue();
  setInterval(sweepIfDue, SWEEP_MINUTES * 60_000).unref();
}

export {
  accountExpiresAt,
  isExpired,
  deleteExpiredAccounts,
  sweepIfDue,
  scheduleCleanup,
};

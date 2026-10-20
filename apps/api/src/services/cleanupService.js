const { Op } = require("sequelize");
const { DEMO_EMAIL } = require("@haciendola/shared");
const { User, LoginCode, RateLimit } = require("../models");

// Accounts created with an email live this long, catalog included. Visitors
// try the app with real inboxes, so nothing they leave behind is kept.
const ACCOUNT_HOURS = 24;
const SWEEP_MINUTES = 60;

function accountExpiresAt(user) {
  return new Date(user.createdAt.getTime() + ACCOUNT_HOURS * 3_600_000);
}

function isExpired(user) {
  return user.email !== DEMO_EMAIL && accountExpiresAt(user) <= new Date();
}

// Deletes expired accounts for good (their products go with them through the
// foreign key), login codes nobody used and finished rate limit windows. The
// demo account has its own daily reset instead.
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

// Sweeps at most once an hour per running instance. Logins call it, so on
// Vercel expired accounts go away between the daily cron runs too.
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

// Local server: sweep now and then every hour while it's up.
function scheduleCleanup() {
  sweepIfDue();
  setInterval(sweepIfDue, SWEEP_MINUTES * 60_000).unref();
}

module.exports = {
  accountExpiresAt,
  isExpired,
  deleteExpiredAccounts,
  sweepIfDue,
  scheduleCleanup,
};

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OTP_LENGTH, OTP_RESEND_SECONDS, DEMO_EMAIL } = require("@haciendola/shared");
const { sequelize, User, LoginCode } = require("../models");
const mailService = require("./mailService");
const catalogService = require("./catalogService");
const cleanupService = require("./cleanupService");

const CODE_MINUTES_VALID = 10;
const MAX_ATTEMPTS = 5;
const SESSION_DAYS = 7;
const DEMO_RESET_HOURS = 24;

// Carries the HTTP status the controller should answer with.
class AuthError extends Error {
  constructor(message, status, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// HMAC with the server secret, so a leaked table doesn't reveal the codes and
// the same code for two emails never hashes the same.
function hashCode(email, code) {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${email}:${code}`)
    .digest("hex");
}

function codesMatch(email, code, storedHash) {
  const hash = Buffer.from(hashCode(email, String(code)), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return hash.length === stored.length && crypto.timingSafeEqual(hash, stored);
}

// Emails a new code to the address, whether or not it has an account yet: the
// account is created when the code is verified. Asking again replaces the
// previous code, once the resend wait is over.
async function requestCode(rawEmail) {
  const email = normalizeEmail(rawEmail);
  if (!isEmail(email)) throw new AuthError("Enter a valid email", 400);
  // The demo inbox doesn't exist, so a code sent there would only bounce.
  if (email === DEMO_EMAIL) {
    throw new AuthError("Use the demo button to try the demo account", 400);
  }

  const existing = await LoginCode.findByPk(email);
  if (existing) {
    const sentAt = existing.expires_at.getTime() - CODE_MINUTES_VALID * 60_000;
    const waitSeconds = Math.ceil(
      (sentAt + OTP_RESEND_SECONDS * 1000 - Date.now()) / 1000
    );
    if (waitSeconds > 0) {
      throw new AuthError(`Wait ${waitSeconds}s to ask for a new code`, 429, {
        retryAfter: waitSeconds,
      });
    }
  }

  const code = crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
  await LoginCode.upsert({
    email,
    code_hash: hashCode(email, code),
    expires_at: new Date(Date.now() + CODE_MINUTES_VALID * 60_000),
    attempts: 0,
  });

  try {
    await mailService.sendLoginCode(email, code, CODE_MINUTES_VALID);
  } catch (err) {
    await LoginCode.destroy({ where: { email } });
    throw err;
  }
}

// Checks the code and returns a session. A code works once, expires, and is
// locked after too many wrong tries so it can't be guessed.
async function verifyCode(rawEmail, code) {
  await cleanupService.sweepIfDue();
  const email = normalizeEmail(rawEmail);
  const invalid = new AuthError("Invalid or expired code", 401);

  const loginCode = await LoginCode.findByPk(email);
  if (!loginCode) throw invalid;

  if (loginCode.expires_at < new Date()) {
    await loginCode.destroy();
    throw invalid;
  }

  // A locked code stays stored, so asking for a new one still has to wait.
  const tooManyTries = new AuthError("Too many wrong tries. Ask for a new code", 401);
  if (loginCode.attempts >= MAX_ATTEMPTS) throw tooManyTries;

  if (!codesMatch(email, code, loginCode.code_hash)) {
    const attempts = loginCode.attempts + 1;
    await loginCode.update({ attempts });
    throw attempts >= MAX_ATTEMPTS ? tooManyTries : invalid;
  }

  // Only the request that deletes the code logs in, so two requests with the
  // same code can't both succeed.
  const deleted = await LoginCode.destroy({ where: { email } });
  if (!deleted) throw invalid;

  let user = await User.findOne({ where: { email }, paranoid: false });
  if (user && user.deletedAt) throw new AuthError("This account is disabled", 403);
  // An expired account the hourly cleanup hasn't reached yet starts over.
  if (user && cleanupService.isExpired(user)) {
    await user.destroy({ force: true });
    user = null;
  }
  if (!user) user = await createUserWithCatalog({ email });

  return createSession(user);
}

// A new account starts with its own copy of the catalog, created together
// with the user so there's never an account without products.
function createUserWithCatalog(fields) {
  return sequelize.transaction(async (transaction) => {
    const user = await User.create(fields, { transaction });
    await catalogService.seedCatalog(user, { transaction });
    return user;
  });
}

// Logs in to the shared demo account without an email, so visitors can try
// the catalog in one click. Every visitor shares its catalog, so it goes back
// to the seed products once a day.
async function startDemoSession() {
  await cleanupService.sweepIfDue();
  let user = await User.findOne({ where: { email: DEMO_EMAIL } });
  if (!user) {
    user = await createUserWithCatalog({ email: DEMO_EMAIL, name: "Demo" });
  } else if (
    Date.now() - (user.catalog_seeded_at?.getTime() ?? 0) >
    DEMO_RESET_HOURS * 3_600_000
  ) {
    await sequelize.transaction((transaction) =>
      catalogService.resetCatalog(user, { transaction })
    );
  }
  return createSession(user);
}

// A session never outlives its account: it ends when the account is deleted,
// or after SESSION_DAYS for the demo account, which is never deleted.
function createSession(user) {
  const isDemo = user.email === DEMO_EMAIL;
  const accountExpiresAt = isDemo ? null : cleanupService.accountExpiresAt(user);
  const sessionEnd = Math.min(
    Date.now() + SESSION_DAYS * 86_400_000,
    accountExpiresAt?.getTime() ?? Infinity
  );
  const token = jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      exp: Math.floor(sessionEnd / 1000),
    },
    process.env.JWT_SECRET
  );
  return {
    token,
    email: user.email,
    accountExpiresAt: accountExpiresAt?.toISOString() ?? null,
  };
}

module.exports = { AuthError, requestCode, verifyCode, startDemoSession };

import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  DEMO_EMAIL,
  emailSchema,
  otpSchema,
} from "@haciendola/shared";
import { sequelize, User, LoginCode } from "../models/index.js";
import * as mailService from "./mailService.js";
import * as catalogService from "./catalogService.js";
import * as cleanupService from "./cleanupService.js";

const CODE_MINUTES_VALID = 10;
const MAX_ATTEMPTS = 5;
const SESSION_DAYS = 7;
const DEMO_RESET_HOURS = 24;

// Carries the HTTP status to answer with.
class AuthError extends Error {
  constructor(message, status, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

// Normalized email, or null if invalid.
function readEmail(rawEmail) {
  const parsed = emailSchema.safeParse(rawEmail);
  return parsed.success ? parsed.data : null;
}

// Keyed HMAC: a leaked table doesn't reveal the codes.
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

// Works for new emails too: the account is created on verify.
async function requestCode(rawEmail) {
  const email = readEmail(rawEmail);
  if (!email) throw new AuthError("Enter a valid email", 400);
  // The demo inbox doesn't exist.
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

// Single use, expires, and locks after MAX_ATTEMPTS wrong tries.
async function verifyCode(rawEmail, code) {
  await cleanupService.sweepIfDue();
  // Malformed input doesn't use up a try.
  if (!otpSchema.safeParse(code).success) {
    throw new AuthError(`Enter the ${OTP_LENGTH}-digit code`, 400);
  }
  const email = readEmail(rawEmail);
  const invalid = new AuthError("Invalid or expired code", 401);
  if (!email) throw invalid;

  const loginCode = await LoginCode.findByPk(email);
  if (!loginCode) throw invalid;

  if (loginCode.expires_at < new Date()) {
    await loginCode.destroy();
    throw invalid;
  }

  // Kept stored so the resend wait still applies.
  const tooManyTries = new AuthError("Too many wrong tries. Ask for a new code", 401);
  if (loginCode.attempts >= MAX_ATTEMPTS) throw tooManyTries;

  if (!codesMatch(email, code, loginCode.code_hash)) {
    const attempts = loginCode.attempts + 1;
    await loginCode.update({ attempts });
    throw attempts >= MAX_ATTEMPTS ? tooManyTries : invalid;
  }

  // Deleting first keeps the code single-use under concurrent requests.
  const deleted = await LoginCode.destroy({ where: { email } });
  if (!deleted) throw invalid;

  let user = await User.findOne({ where: { email }, paranoid: false });
  if (user && user.deletedAt) throw new AuthError("This account is disabled", 403);
  // Expired but not swept yet: start over.
  if (user && cleanupService.isExpired(user)) {
    await user.destroy({ force: true });
    user = null;
  }
  if (!user) user = await createUserWithCatalog({ email });

  return createSession(user);
}

// User and catalog in one transaction.
function createUserWithCatalog(fields) {
  return sequelize.transaction(async (transaction) => {
    const user = await User.create(fields, { transaction });
    await catalogService.seedCatalog(user, { transaction });
    return user;
  });
}

// Shared demo account; its catalog resets once a day.
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

// The token never outlives the account (the demo's lasts SESSION_DAYS).
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

export { AuthError, requestCode, verifyCode, startDemoSession };

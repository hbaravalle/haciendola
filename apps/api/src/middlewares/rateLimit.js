const { rateLimit } = require("express-rate-limit");
const { sequelize, RateLimit } = require("../models");
const response = require("../network/response");

// express-rate-limit store backed by the rate_limits table, so the counts are
// shared by every instance of the API (Vercel runs many, each with its own
// memory). One atomic upsert per request: a finished window starts over.
class PostgresStore {
  constructor(prefix) {
    this.prefix = prefix;
  }

  init(options) {
    this.windowMs = options.windowMs;
  }

  async increment(key) {
    const [[row]] = await sequelize.query(
      `insert into rate_limits (key, hits, reset_at)
       values (:key, 1, now() + make_interval(secs => :seconds))
       on conflict (key) do update set
         hits = case when rate_limits.reset_at <= now() then 1 else rate_limits.hits + 1 end,
         reset_at = case when rate_limits.reset_at <= now() then excluded.reset_at else rate_limits.reset_at end
       returning hits, reset_at`,
      { replacements: { key: this.prefix + key, seconds: this.windowMs / 1000 } }
    );
    return { totalHits: row.hits, resetTime: new Date(row.reset_at) };
  }

  async decrement(key) {
    await RateLimit.decrement("hits", { where: { key: this.prefix + key } });
  }

  async resetKey(key) {
    await RateLimit.destroy({ where: { key: this.prefix + key } });
  }
}

// Limits by IP on top of the per-email limits in the login code flow, so one
// client can't spread guesses across many emails or flood the demo login.
// `name` keeps each route's counts apart.
function limitPerIp(name, limit, windowMinutes) {
  return rateLimit({
    windowMs: windowMinutes * 60_000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    store: new PostgresStore(`${name}:`),
    // If the database can't be reached, let the request through rather than
    // locking everyone out of the login.
    passOnStoreError: true,
    handler: (req, res) =>
      response.error(req, res, "Too many requests. Try again later", 429),
  });
}

module.exports = { limitPerIp };

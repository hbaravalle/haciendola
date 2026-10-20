# Haciendola — API

Express REST API for Haciendola: passwordless login with a one-time code sent by email through Resend, a one-click demo account, one catalog per account deleted 24 hours after sign-up, and paginated product management over PostgreSQL (Neon) with Sequelize.

See the [main README](../../README.md) for the endpoints, the reasoning behind the API and setup.

```bash
# from the repository root
pnpm db:init   # create the tables and 3 test users, each with the 263 products
pnpm dev:api   # http://localhost:3000/api
pnpm seed      # reset products and users to the seed data
pnpm db:app-role -- --write-env   # optional: connect with a role that can only read and write rows
```

| Env variable | Description |
|---|---|
| `APP_PORT` | Port the API listens on. Defaults to `3000` |
| `DATABASE_URL` | Postgres connection string the API uses, e.g. the one Neon shows under **Connect**. SSL is required |
| `DATABASE_ADMIN_URL` | Optional. Owner connection used only by the seeders. `pnpm db:app-role -- --write-env` moves the owner here and points `DATABASE_URL` at a role that can only read and write rows |
| `JWT_SECRET` | Secret used to sign the tokens and hash the login codes |
| `RESEND_API_KEY` | Resend API key. Leave it empty to print login codes in the console instead of emailing them |
| `WEB_ORIGIN` | Production only. The web app's URL (comma-separated for several); without it, any origin can call the API |
| `CRON_SECRET` | Production only. Secret Vercel Cron sends to `/api/cron/cleanup` |
| `MAIL_FROM` | Sender of the login email, e.g. `Haciendola <login@mail.yourdomain.com>` on a domain verified in Resend, or `onboarding@resend.dev` while testing |

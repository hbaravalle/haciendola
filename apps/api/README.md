# Haciendola — API

Express REST API for Haciendola: JWT authentication, password reset with a one-time code sent by email, and paginated product management over MySQL with Sequelize.

See the [main README](../../README.md) for the endpoints, the reasoning behind the API and setup.

```bash
# from the repository root
pnpm db:init   # create the database and load 263 products and 3 test users
pnpm dev:api   # http://localhost:3000/api
pnpm seed      # reset products and users to the seed data
```

| Env variable | Description |
|---|---|
| `APP_PORT` | Port the API listens on. Defaults to `3000` |
| `DB_DATABASE`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT` | MySQL connection |
| `DB_DIALECT` | `mysql` |
| `JWT_SECRET` | Secret used to sign the tokens |
| `SEEDER_USER_PASS` | Password for the three test users |
| `NODEMAILER_USER`, `NODEMAILER_PASS` | Mailtrap sandbox SMTP credentials, for the password reset email |
| `NODEMAILER_FROM` | Sender address for the reset email |

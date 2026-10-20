![Haciendola Product Manager](https://github.com/hbaravalle/backend-haciendola-challenge/assets/24690415/43f3f53c-3178-470e-8103-b52938d38821)

# Haciendola — Product Manager

A product catalog admin for an online store: try it in one click with a shared demo account, or log in with a code sent by email to get your own copy of the catalog for 24 hours, then browse, create, edit or delete products. The React front end and the Express API live together in one pnpm workspace. Built as my solution to the **Haciendola Full Stack Challenge**.

**Live demo:** [haciendola-web.vercel.app](https://haciendola-web.vercel.app)

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Sass](https://img.shields.io/badge/Sass_Modules-CC6699?style=flat-square&logo=sass&logoColor=white)
![React Bootstrap](https://img.shields.io/badge/React_Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=flat-square&logo=resend&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_workspaces-F69220?style=flat-square&logo=pnpm&logoColor=white)

## The challenge

Build a full stack app for managing an online store's products: users log in, see the catalog and create, edit or delete products. The challenge shipped with a catalog of **263 real products** from a stationery store, exported in a Shopify-style format (handle, SKU, barcode, grams, stock, price and compare-at price), which seeds the database. The original catalog was in Spanish; titles, handles and descriptions are now translated to English, keeping the HTML of each description and every SKU, barcode and price as they were.

## 🧑‍💻 User stories

- As an admin, I want to **log in with just my email**: I type it, get a code in my inbox and type the code. No password to remember or recover.
- As a new admin, I want **the same steps to create my account**, so there is no separate sign-up form.
- As a visitor checking out the project, I want to **try it in one click**, without giving out my email.
- As an admin who signs in with my email, I want **my own copy of the catalog**, so nobody else's changes get in the way.
- As a visitor who left my email, I want **my account deleted after a day**, so nothing I leave behind is kept.
- As an admin, I want to **browse the catalog ten products at a time**, newest first, with each product's title, prices, stock, SKU and barcode at a glance, and which ones are disabled.
- As an admin, I want to **create a product** from a form in a modal, without leaving the list.
- As an admin, I want to **edit a product** with its current data already filled in.
- As an admin, I want to **confirm before deleting a product**, seeing which one I'm about to delete.
- As an admin, I want **a short message after every action**, so I know whether it worked.
- As the store owner, I want **only logged-in users to read or change products**, and anyone else sent to the login page.
- As a developer, I want to **find a product by its SKU or by its handle**, the two IDs a store team uses.

## Design & interaction

**Admins never lose their place.** Creating, editing and deleting happen in modals on top of the list, opened from the **New product** button or each card's actions menu. After each change, the page you were on reloads from the API, so the list stays current without sending you back to page one. Deleting the last product of a page steps back to the previous one.

**A catalog that doesn't jump.** Products show as cards in two columns (one on narrow screens). While a page loads, skeleton cards with the same height as the real ones hold the layout; they only appear if the page takes more than 150 ms, so fast responses don't flash them, and an answer for a page you already left is ignored.

**One form for creating and editing.** The same modal handles both, grouped into details, identifiers, and pricing and inventory. Required fields are marked, numbers use numeric inputs with their unit (`$`, `g`) inside the field, Enter saves, and while creating, the handle is filled in from the title until you edit it. Errors from the API, such as a SKU already in the catalog, show their own message.

**A login that follows the browser.** The email and the code each have their own URL (`/login`, `/login/code`), so the back button moves between steps as users expect. The email is carried to the code step, so users type it once, and the code screen offers to resend it after a short wait.

**A code input built for codes.** The one-time code has one box per digit: typing moves to the next box, Backspace goes back, and pasting the code (or the phone's one-time-code autofill) fills every box at once. The last digit signs in without pressing the button. The number of boxes and the resend wait come from the shared package, the same values the API uses.

**Every action answers.** Each create, edit, delete or login step ends in a toast that says whether it worked, and deleting asks for confirmation first.

## The key decision: one repository

The front end and the API started in 2024 as two separate repositories. In 2026 I brought them together in one pnpm workspace, keeping the full history of both, for the same reason I did it in [Red Atlas](https://github.com/hbaravalle/red-atlas): the contract between the two apps belongs in one place.

That decision found a real bug. When editing a product, the web app sent `comparePrice` while the API expected `compare_price`, so **changes to the compare-at price were silently ignored**. Now `@haciendola/shared` defines the product fields, the page size, the length of the one-time code, the wait before asking for a new one and the demo account's email, and both apps read them from there.

The shared package is plain CommonJS. The API loads it with `require()`, which Node 24 accepts for an ES module locally but Vercel's runtime doesn't: the first deploy crashed with `ERR_REQUIRE_ESM`. Vite converts the package for the web app, so both still read one file.

## More decisions

**Every product route is protected.** Product endpoints require a valid JWT (`express-jwt`), and a dedicated middleware turns token errors into clean `401` answers. Only the login routes are public. A session lasts until its account is deleted, 24 hours after sign-up, or seven days for the demo account.

**No passwords at all.** The API emails a 6-digit code through [Resend](https://resend.com), and typing it is the only way in. With nothing to store, there is no password to leak, reuse or reset. The same request works for an email that has no account yet: the account is created when its code is verified, so there is no sign-up form and the API never tells anyone whether an email is registered.

**Codes that can't be guessed or reused.** Codes live in their own `login_codes` table, apart from users, and only an HMAC of each code is stored. A code expires after 10 minutes, works once (two requests with the same code can't both log in) and locks after 5 wrong tries. A new code for the same email can be asked for once a minute, so each minute allows at most 5 guesses, and every login route is also rate-limited by IP (`express-rate-limit`). Without a Resend key, the API prints the code in its console instead of emailing it, so the login can be tried locally without an email account.

**A catalog per account.** Every product belongs to a user, and every product query is filtered by the user in the token. A new account starts with its own copy of the 263 seed products, created in the same transaction as the user, so what one person creates, edits or deletes never reaches anyone else. Handles, SKUs and barcodes are unique within a catalog, ignoring deleted products, so every catalog can hold the same products and a deleted one can be created again.

**Accounts that delete themselves.** Accounts created with an email last 24 hours. An hourly sweep deletes expired accounts for good, with their catalogs (through an `ON DELETE CASCADE` foreign key), along with unused login codes and finished rate limit windows. Locally it runs on a timer inside the server; on Vercel, where nothing stays running, a daily cron job and the logins themselves run it instead (see [Deploying to Vercel](#-deploying-to-vercel)). Sessions never outlive their account: the token expires when the account does, and the web app sends the user back to the login when it gets a `401`. The sidebar shows when the account will be deleted.

**A database role that can only touch rows.** The API connects as `haciendola_app`, a role that can read and write the four tables (users, products, login codes and rate limits) but can't create or drop tables, create databases or roles, or bypass row security. The owner role is kept in `DATABASE_ADMIN_URL` for the seeders, which recreate the tables, and default privileges keep the grants on the recreated tables. `pnpm db:app-role` creates the role (or rotates its password) on each Neon branch. The owner connection never reaches production: the seeders and the role script run from a developer's machine.

**A demo that skips the inbox.** The login screen opens with a **Try the demo** button that signs in to a shared demo account, so anyone reviewing the project sees the catalog in one click without handing over an email. Its catalog is shared by every visitor, so it goes back to the seed products when someone opens the demo more than 24 hours after the last reset, with no scheduled job. Signing in with an email is what gets you a private catalog.

**Two ways to address a product.** Store teams think in SKUs and URLs think in handles, so `GET`, `PUT` and `DELETE /products/:product` accept either one. The API picks the column from the value (digits mean SKU), because comparing a handle with the numeric SKU column makes Postgres reject the query.

**No barcode, no sale.** A product without a barcode is saved as disabled (`enabled: false`): a model hook sets the flag on every save, so it always follows the barcode. The card shows a **Disabled** badge, and the form says so under the barcode field.

**Soft delete.** The product model is `paranoid`: deleting sets `deletedAt` instead of removing the row, so a mistake in the admin can be undone in the database while the account exists. Deleting an account, or resetting the demo, removes its products for good.

**One command to a working database.** `pnpm db:init` syncs the models against the Postgres database (a [Neon](https://neon.tech) project works out of the box) and creates three test users, each with their own copy of the 263 products. Like any account, they're deleted 24 hours later; `pnpm seed` brings them back.

**Out of search results.** It's a demo, so the web app has a `robots` meta tag and both apps send `X-Robots-Tag: noindex, nofollow` with every response. `robots.txt` doesn't block crawlers, on purpose: a crawler that can't read a page never sees its `noindex`.

## 🧱 Architecture

```
haciendola/
├── apps/
│   ├── web/                  # React 18 + Vite + Redux Toolkit + React Router + Sass modules + React Bootstrap
│   │   ├── public/           # Favicons and logo
│   │   └── src/
│   │       ├── config.js     # API base URL (VITE_API_URL)
│   │       ├── redux/        # Store, auth slice (session, account expiry, email waiting for its code)
│   │       │                 # and the RTK Query API slice (every request to the API)
│   │       ├── pages/        # Login (demo, email and code steps), ProductList
│   │       ├── components/   # ProductCard and its skeleton, ProductFormModal, DeleteProductModal,
│   │       │                 # FormGroup, FormGroupOTP, Paginate, Sidebar, ProtectedRoute
│   │       └── layouts/      # Shared layout for the auth screens
│   └── api/                  # Node.js + Express + Sequelize + PostgreSQL
│       ├── api/index.js      # Vercel function: the same Express app
│       ├── public/           # Favicons served at /favicon.ico and /favicon.svg
│       └── src/
│           ├── app.js        # Express app, shared by the local server and Vercel
│           ├── server.js     # Local server with the hourly cleanup
│           ├── routes/       # auth, product and cron routers (JWT on every product route)
│           ├── controllers/  # HTTP layer: read the request, call the model, pick the status
│           ├── services/     # Login codes and sessions, catalog copies, account cleanup, email
│           ├── models/       # User, LoginCode, Product (paranoid, one catalog per user), RateLimit
│           ├── middlewares/  # JWT error handler, rate limits by IP, base URL for pagination links
│           ├── network/      # One shape for every success and error response
│           ├── scripts/      # Create the API's database role
│           └── seeders/      # 263 seed products, copied into each test user's catalog
├── packages/
│   └── shared/               # Product fields, page size, login code rules, demo email and API types (CommonJS)
└── pnpm-workspace.yaml
```

**Global state only where it's shared.** Redux Toolkit holds the session (token, email and when the account is deleted), which the routes, the sidebar and every API call need. Everything else, such as the current page and the modals, stays local to the page that uses it.

**Server data in RTK Query.** Every request goes through one API slice, which adds the token, unwraps the API's `{ status, result }` answers and signs the user out on a `401` from an expired session. Pages are cached per page number and tagged as one list, so creating, editing or deleting a product refetches the page on screen and drops the rest, and an answer for a page you already left never reaches the screen. When the session changes, the cache is emptied, since every account has its own catalog.

**Layers in the API.** Routes map URLs and apply authentication, controllers deal with HTTP and pick the status code, services hold the login, catalog and cleanup rules, and one helper (`network/response.js`) gives every success (`{ status, result }`) and error (`{ status, message }`) the same shape.

## 📖 API reference

Base URL: `http://localhost:3000/api`

**Auth (public)**

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/otp` | Email a login code to `email`. An invalid email, or the demo account's, answers `400`; asking again within a minute answers `429` with `Retry-After` |
| `POST` | `/auth/verify` | Check `otp` for `email` and return `{ token, email, accountExpiresAt }`, creating the account and its catalog on first login. A wrong, expired, used or locked code answers `401` |
| `POST` | `/auth/demo` | Return `{ token, email, accountExpiresAt: null }` for the shared demo account, no email needed |

Every auth route is also limited by IP, per 15 minutes: 10 code requests, 30 verifications and 20 demo logins. Past the limit it answers `429`.

**Products (require `Authorization: Bearer <token>`, and only reach the catalog of the token's user)**

| Method | Route | Description |
|---|---|---|
| `GET` | `/products?page=1` | Ten products per page, newest first, with `count`, `totalPages`, `next` and `prev`. A page past the last answers `404` |
| `GET` | `/products/:product` | One product by SKU or handle |
| `POST` | `/products` | Create a product. A handle, SKU or barcode already in the catalog answers `409` |
| `PUT` | `/products/:product` | Update the fields sent, by SKU or handle. A handle, SKU or barcode already in the catalog answers `409` |
| `DELETE` | `/products/:product` | Soft-delete a product by SKU or handle |

Unknown products answer `404`, and a missing, invalid or expired token answers `401`. An empty catalog answers page 1 with no products. Each product comes with `enabled`, which is `false` when it has no barcode.

**Cron (requires `Authorization: Bearer <CRON_SECRET>`)**

| Method | Route | Description |
|---|---|---|
| `GET` | `/cron/cleanup` | Delete expired accounts, unused login codes and finished rate limit windows, and return how many of each as `{ accounts, codes, rateLimits }`. Without the secret it answers `401` |

## 🚀 Running locally

**Prerequisites:** Node.js 20.19+, [pnpm](https://pnpm.io/installation) and a PostgreSQL database, such as a free [Neon](https://neon.tech) project. To receive the login codes by email, a free [Resend](https://resend.com) account. Without it, the codes appear in the API console.

```bash
git clone https://github.com/hbaravalle/haciendola.git
cd haciendola
pnpm install

cp apps/api/.env.example apps/api/.env   # database, JWT secret, Resend (optional)
cp apps/web/.env.example apps/web/.env   # optional: VITE_API_URL

pnpm db:init   # create the tables and load products and test users
pnpm dev       # API on localhost:3000 and web app on localhost:5173
```

Optionally, `pnpm db:app-role -- --write-env` makes the API connect with a role that can only read and write rows, and keeps the owner connection for the seeders.

**Trying it:** the **Try the demo** button needs nothing else. The test users `leia@`, `luke@` and `han@starwars.com` don't have real inboxes, so log in as them without a Resend key and read the code in the API console, or log in with your own email.

| Script | Description |
|---|---|
| `pnpm dev` | Run web and API in parallel |
| `pnpm dev:web` / `pnpm dev:api` | Run one app |
| `pnpm build` | Build the web app |
| `pnpm lint` | Lint the web app |
| `pnpm db:init` | Create the tables and load the seed data |
| `pnpm db:app-role` | Create the API's database role on the current branch. Add `-- --write-env` to save it in `.env` |
| `pnpm seed` | Reset the database to the seed data. Like `db:init`, it drops every table first, so every account and catalog is lost |

## ▲ Deploying to Vercel

Both apps deploy to Vercel as two projects from this repository, with the database on Neon.

**Why the API changes shape there.** On Vercel the API runs as a function, not a server that stays up. The hourly cleanup has no server to run in, so a daily **Vercel Cron** job calls `/api/cron/cleanup` (protected by `CRON_SECRET`), and logins sweep too, at most once an hour, because the Hobby plan only allows daily crons. Many instances run at once, which is why the IP rate limits are counted in a `rate_limits` table they all share rather than in memory. And Express trusts Vercel's proxy, so those limits see the visitor's IP instead of the proxy's.

**1. Database (Neon `main` branch).** Copy the `main` branch's owner connection string from Neon, pooled (the host with `-pooler`, since functions open many short connections), and pass it on the command line so your local `.env` keeps pointing at `dev`:

```bash
DATABASE_ADMIN_URL="postgresql://neondb_owner:…@…-pooler…/neondb?sslmode=verify-full" pnpm db:init
DATABASE_ADMIN_URL="postgresql://neondb_owner:…@…-pooler…/neondb?sslmode=verify-full" pnpm db:app-role
```

The second command prints the `haciendola_app` connection string for the API. Run `db:init` only this once: like `pnpm seed`, it drops and recreates the tables.

**2. API project.** New Vercel project from the repo, with **Root Directory** `apps/api` and Node.js 22. `apps/api/vercel.json` routes every request to the function and schedules the cron. Environment variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | The `haciendola_app` connection string from step 1 |
| `JWT_SECRET` | A new long random string, different from development |
| `RESEND_API_KEY`, `MAIL_FROM` | As in development |
| `WEB_ORIGIN` | The web app's URL, without a trailing slash, e.g. `https://haciendola-web.vercel.app` |
| `CRON_SECRET` | A long random string; Vercel sends it to the cron route |

`DATABASE_ADMIN_URL` stays out of Vercel: the API never reads it.

**3. Web project.** New Vercel project from the repo, with **Root Directory** `apps/web` (Vite is detected). `apps/web/vercel.json` sends every route to `index.html`, so reloading `/login/code` works. Set `VITE_API_URL` to the API's URL plus `/api`, e.g. `https://haciendola-api.vercel.app/api`, for the **Production** environment. Vite writes it into the build, so it has to be there before the build runs: changing it later takes a redeploy, and a build without it calls `localhost:3000`. `apps/web/vercel.json` also sends the `noindex` header with every file.

**4. Wire them.** Once the web app has its final URL, put it in the API's `WEB_ORIGIN` and redeploy the API.

## 🔭 What's next

The first version was delivered in 2024. Moving to a monorepo fixed the configuration (API URL, ports), the field-name bug and the product lookup. These are the next steps:

- **Validate input** at the edge with Zod, reusing the shared package.
- **Keep the session across reloads** by persisting the token. Today a reload signs you out.
- **Add tests** for the auth flow and the product endpoints.

## 👤 Author

**Hernán Baravalle** — Design Engineer · Buenos Aires, Argentina
[Portfolio](https://hernanbaravalle.com) · [GitHub](https://github.com/hbaravalle)

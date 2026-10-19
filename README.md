![Haciendola Product Manager](https://github.com/hbaravalle/backend-haciendola-challenge/assets/24690415/43f3f53c-3178-470e-8103-b52938d38821)

# Haciendola — Product Manager

A product catalog admin for an online store: log in, browse the catalog and create, edit or delete products, with a full password recovery flow by email. The React front end and the Express API live together in one pnpm workspace. Built as my solution to the **Haciendola Full Stack Challenge**.

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Sass](https://img.shields.io/badge/Sass_Modules-CC6699?style=flat-square&logo=sass&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_workspaces-F69220?style=flat-square&logo=pnpm&logoColor=white)

## The challenge

Build a full stack app for managing an online store's products: users log in, see the catalog and create, edit or delete products. The challenge shipped with a catalog of **263 real products** from a stationery store, exported in a Shopify-style format (handle, SKU, barcode, grams, stock, price and compare-at price), which seeds the database.

## 🧑‍💻 User stories

- As a new admin, I want to **create an account**, so I can get into the catalog.
- As an admin, I want to **log in with my username or my email**.
- As an admin who forgot my password, I want to **recover it in three steps**: enter my email, type the code I received (or ask for a new one) and choose a new password.
- As an admin, I want to **browse the catalog ten products at a time**, newest first, with each product's title, SKU, barcode and prices at a glance.
- As an admin, I want to **create a product** from a form in a modal, without leaving the list.
- As an admin, I want to **edit a product** with its current data already filled in.
- As an admin, I want to **confirm before deleting a product**, and have deleted products kept in the database in case I need them back.
- As an admin, I want **a short message after every action**, so I know whether it worked.
- As the store owner, I want **only logged-in users to read or change products**, and anyone else sent to the login page.
- As a developer, I want to **find a product by its SKU or by its handle**, the two IDs a store team uses.

## Design & interaction

**Admins never lose their place.** Creating, editing and deleting happen in modals on top of the list. After each change, the page you were on reloads from the API, so the list stays current without sending you back to page one.

**Recovery that follows the browser.** Each step of the password recovery has its own URL (`/auth/forgot-password`, `/auth/forgot-password/otp`, `/auth/new-password`), so the back button moves between steps as users expect. The code screen offers to resend the email, and the email itself is carried from one step to the next, so users type it once.

**A code input built for codes.** The one-time code has one box per character and turns letters into capitals as you type, matching the codes the API sends. The form checks the code's length against the shared package, the same value the API uses to generate it.

**Every action answers.** Each create, edit, delete, login or recovery step ends in a toast that says whether it worked, and deleting asks for confirmation first.

## The key decision: one repository

The front end and the API started in 2024 as two separate repositories. In 2026 I brought them together in one pnpm workspace, keeping the full history of both, for the same reason I did it in [Red Atlas](https://github.com/hbaravalle/red-atlas): the contract between the two apps belongs in one place.

That decision found a real bug. When editing a product, the web app sent `comparePrice` while the API expected `compare_price`, so **changes to the compare-at price were silently ignored**. Now `@haciendola/shared` defines the product fields, the page size and the length of the one-time code, and both apps read them from there.

## More decisions

**Every product route is protected.** Product endpoints require a valid JWT (`express-jwt`), and a dedicated middleware turns token errors into clean `401` answers. Only registration, login and the password reset flow are public.

**Passwords never leave the model unhashed.** A Sequelize `beforeSave` hook hashes the password with bcrypt whenever it changes, so registration, seeders and password resets all go through the same path.

**Password reset with a one-time code.** Instead of a reset link, the API emails a 6-character code (Nodemailer, tested against a Mailtrap sandbox). The code is stored on the user, checked in a separate step so the UI can confirm it before asking for the new password, and cleared once the password changes.

**Two ways to address a product.** Store teams think in SKUs and URLs think in handles, so `GET`, `PUT` and `DELETE /products/:product` accept either one. The API picks the column from the value (digits mean SKU), because comparing a handle with the numeric SKU column makes MySQL reject updates and deletes.

**Soft delete.** The product model is `paranoid`: deleting sets `deletedAt` instead of removing the row, so a mistake in the admin can be undone in the database.

**One command to a working database.** `pnpm db:init` creates the MySQL database if it doesn't exist, syncs the models and loads the 263 products and three test users.

## 🧱 Architecture

```
haciendola/
├── apps/
│   ├── web/                  # React 18 + Vite + Redux Toolkit + React Router + Sass modules
│   │   └── src/
│   │       ├── config.js     # API base URL (VITE_API_URL)
│   │       ├── redux/        # Store and auth slice (token, email)
│   │       ├── pages/        # Login, Register, ResetPassword (steps), NewPassword, ProductList
│   │       ├── components/   # FormGroup, FormGroupOTP, Paginate, ProductCard, Sidebar, ProtectedRoute
│   │       └── layouts/      # Shared layout for the auth screens
│   └── api/                  # Node.js + Express + Sequelize + MySQL
│       └── src/
│           ├── routes/       # auth and product routers (JWT on every product route)
│           ├── controllers/  # HTTP layer: read the request, call the model, pick the status
│           ├── models/       # User (bcrypt hook) and Product (paranoid)
│           ├── middlewares/  # JWT error handler, base URL for pagination links
│           ├── scripts/      # Create the database if it doesn't exist
│           └── seeders/      # 263 products + 3 test users
├── packages/
│   └── shared/               # Product fields, page size, code length and API types
└── pnpm-workspace.yaml
```

**Global state only where it's shared.** Redux Toolkit holds the session (token and email), which the routes, the sidebar and every API call need. Everything else, such as the current page and the modals, stays local to the page that uses it.

**Layers in the API.** Routes map URLs and apply authentication, controllers deal with HTTP and pick the status code, and one helper (`network/response.js`) gives every success (`{ status, result }`) and error (`{ status, message }`) the same shape.

## 📖 API reference

Base URL: `http://localhost:3000/api`

**Auth (public)**

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a user (`name`, `username`, `email`, `password`) |
| `POST` | `/auth/login` | Log in with `user` (username or email) and `password`. Returns a JWT |
| `POST` | `/auth/otp` | Email a one-time code to `email` |
| `POST` | `/auth/otp-check` | Check that `otp` matches the code sent to `email` |
| `POST` | `/auth/reset-password` | Set `newPassword` for `email`, given a valid `otp` |

**Products (require `Authorization: Bearer <token>`)**

| Method | Route | Description |
|---|---|---|
| `GET` | `/products?page=1` | Ten products per page, newest first, with `count`, `totalPages`, `next` and `prev` |
| `GET` | `/products/:product` | One product by SKU or handle |
| `POST` | `/products` | Create a product |
| `PUT` | `/products/:product` | Update the fields sent, by SKU or handle |
| `DELETE` | `/products/:product` | Soft-delete a product by SKU or handle |

Unknown products answer `404`, and a missing or invalid token answers `401`.

## 🚀 Running locally

**Prerequisites:** Node.js 20.19+, [pnpm](https://pnpm.io/installation) and a MySQL server. To test the password reset, a free [Mailtrap](https://mailtrap.io) sandbox inbox.

```bash
git clone https://github.com/hbaravalle/haciendola.git
cd haciendola
pnpm install

cp apps/api/.env.example apps/api/.env   # database, JWT secret, test user password, Mailtrap
cp apps/web/.env.example apps/web/.env   # optional: VITE_API_URL

pnpm db:init   # create the database and load products and test users
pnpm dev       # API on localhost:3000 and web app on localhost:5173
```

**Test users** (password: the value of `SEEDER_USER_PASS`): `leiaorgana`, `lukeskywalker` and `hansolo`, or their emails `leia@`, `luke@` and `han@starwars.com`.

| Script | Description |
|---|---|
| `pnpm dev` | Run web and API in parallel |
| `pnpm dev:web` / `pnpm dev:api` | Run one app |
| `pnpm build` | Build the web app |
| `pnpm lint` | Lint the web app |
| `pnpm db:init` | Create the database and load the seed data |
| `pnpm seed` | Reset products and users to the seed data |

### Password reset demo

https://github.com/hbaravalle/backend-haciendola-challenge/assets/24690415/9cc698cc-ebc4-44e1-8b56-2fa2b033010a

## 🔭 What's next

The first version was delivered in 2024. Moving to a monorepo fixed the configuration (API URL, ports), the field-name bug and the product lookup. These are the next steps:

- **Validate input** at the edge with Zod, reusing the shared package.
- **Expire the one-time code** and limit attempts, so a code can't be guessed or reused later.
- **Keep the session across reloads** by persisting the token, and check its expiry.
- **Split `ProductList`** into smaller components and move form state into React Hook Form, with RTK Query for server data.
- **Add tests** for the auth flow and the product endpoints.
- **Deploy** with Postgres on Neon, as in Red Atlas, so there is a live demo.

## 👤 Author

**Hernán Baravalle** — Design Engineer · Buenos Aires, Argentina
[Portfolio](https://hernanbaravalle.com) · [GitHub](https://github.com/hbaravalle)

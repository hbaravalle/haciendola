# Haciendola — Web app

React 18 front end for Haciendola: a one-click demo or a passwordless login with a code sent by email, and a paginated product catalog in two columns, with loading skeletons and modals to create, edit and delete products.

See the [main README](../../README.md) for the full project, architecture and setup.

```bash
# from the repository root
pnpm dev:web   # http://localhost:5173
```

| Env variable | Description |
|---|---|
| `VITE_API_URL` | API base URL, including `/api`. Defaults to `http://localhost:3000/api`. Vite writes it into the app when it starts or builds: restart `pnpm dev` after changing it, and on Vercel redeploy, or production keeps calling the old URL |

# Haciendola — Web app

React 18 front end for Haciendola: login and registration, a three-step password recovery with a one-time code, and a paginated product catalog with create, edit and delete modals.

See the [main README](../../README.md) for the full project, architecture and setup.

```bash
# from the repository root
pnpm dev:web   # http://localhost:5173
```

| Env variable | Description |
|---|---|
| `VITE_API_URL` | API base URL, including `/api`. Defaults to `http://localhost:3000/api`. Vite reads it on startup, so restart `pnpm dev` after changing it |

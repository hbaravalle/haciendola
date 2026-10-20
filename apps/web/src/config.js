// Base URL of the Haciendola API. Set VITE_API_URL in .env to point the app at
// another server; without it, the app uses the API running locally.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
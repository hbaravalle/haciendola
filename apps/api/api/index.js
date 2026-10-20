// Vercel function: every request is rewritten here (see vercel.json) and
// handled by the Express app, which keeps its own /api/... routes.
module.exports = require("../src/app");

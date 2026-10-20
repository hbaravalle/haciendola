// Runs the API as a long-lived server for local development. On Vercel the
// same app runs as a function (api/index.js) and a cron job does the cleanup.
const app = require("./app");
const { scheduleCleanup } = require("./services/cleanupService");

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log("[Server] API running at", `http://localhost:${PORT}`);
  scheduleCleanup();
});

// Local server. On Vercel, api/index.js runs the app and a cron does the cleanup.
import app from "./app.js";
import { scheduleCleanup } from "./services/cleanupService.js";

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log("[Server] API running at", `http://localhost:${PORT}`);
  scheduleCleanup();
});

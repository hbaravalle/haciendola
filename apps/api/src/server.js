require("dotenv").config();
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const attachBaseUrl = require("./middlewares/attachBaseUrl");
const response = require("./network/response");
const express = require("express");

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(attachBaseUrl);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
  return response.error(req, res, "Not found", 404);
});

app.listen(3000, () =>
  console.log("[Server] API running at", `http://localhost:${PORT}`)
);

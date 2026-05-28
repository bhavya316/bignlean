const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./user/routes");
const adminRoutes = require("./admin/routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = new Set([
  "https://admin.bignlean.com",
  "https://bignlean.com",
  "https://www.bignlean.com",
]);

app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      /^https:\/\/([a-z0-9-]+\.)*bignlean\.com$/i.test(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", userRoutes);
app.use("/", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;

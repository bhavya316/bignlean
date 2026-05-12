const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./user/routes");
const adminRoutes = require("./admin/routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", userRoutes);
app.use("/", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;

const Sequelize = require("sequelize");
require("dotenv").config();

const requiredDatabaseEnv = ["DB_USER", "DB_PASSWORD"];
const missingDatabaseEnv = requiredDatabaseEnv.filter(
  (key) => process.env[key] === undefined
);

if (missingDatabaseEnv.length > 0) {
  throw new Error(
    `Missing required database environment variable(s): ${missingDatabaseEnv.join(
      ", "
    )}`
  );
}

const sequelize = new Sequelize({
  dialect: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "bignlean",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
});


module.exports = sequelize;

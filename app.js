require("dotenv").config();
const http = require("http");
const apis = require("./routes");
const sequelize = require("./config/database");
const logger = require("./utils/logger");

const bcrypt = require("bcrypt");
const Admin = require("./admin/model/admin");

const port = process.env.PORT || 3002;

const server = http.createServer(apis);

const quoteIdentifier = (value) => `\`${String(value).replace(/`/g, "``")}\``;

const cleanupDuplicateSingleColumnUniqueIndexes = async () => {
  const targetsByTable = {
    users: {
      phone: "users_phone_unique",
      firebaseUid: "users_firebase_uid_unique",
      googleId: "users_google_id_unique",
      facebookId: "users_facebook_id_unique",
    },
    admins: {
      phone: "admins_phone_unique",
      email: "admins_email_unique",
    },
    coupons: {
      coupon: "coupons_coupon_unique",
    },
  };

  for (const [tableName, targetColumns] of Object.entries(targetsByTable)) {
    let rows;
    try {
      [rows] = await sequelize.query(`SHOW INDEX FROM ${quoteIdentifier(tableName)}`);
    } catch (error) {
      if (error?.original?.code === "ER_NO_SUCH_TABLE") continue;
      throw error;
    }

    const indexesByName = rows.reduce((acc, row) => {
      if (row.Key_name === "PRIMARY" || Number(row.Non_unique) !== 0) return acc;
      if (!acc[row.Key_name]) acc[row.Key_name] = [];
      acc[row.Key_name].push(row);
      return acc;
    }, {});

    const indexesByColumn = {};
    Object.entries(indexesByName).forEach(([indexName, indexRows]) => {
      const columns = indexRows
        .slice()
        .sort((a, b) => Number(a.Seq_in_index) - Number(b.Seq_in_index))
        .map((row) => row.Column_name);

      if (columns.length !== 1 || !targetColumns[columns[0]]) return;
      if (!indexesByColumn[columns[0]]) indexesByColumn[columns[0]] = [];
      indexesByColumn[columns[0]].push(indexName);
    });

    for (const [columnName, indexNames] of Object.entries(indexesByColumn)) {
      const stableName = targetColumns[columnName];
      const dropNames = indexNames.filter((indexName) => indexName !== stableName);

      for (const indexName of dropNames) {
        await sequelize.query(
          `ALTER TABLE ${quoteIdentifier(tableName)} DROP INDEX ${quoteIdentifier(indexName)}`
        );
        logger.warn(
          { table: tableName, column: columnName, index: indexName },
          "Dropped duplicate generated unique index before sync"
        );
      }
    }
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await cleanupDuplicateSingleColumnUniqueIndexes();

    // Ensure all tables are synchronized and up-to-date with models
    await sequelize.sync({ alter: true });

    // Auto-seed default admin user if none exists
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);
      await Admin.create({
        name: "System Admin",
        phone: "1234567890",
        email: "admin@bignlean.com",
        password: hashedPassword,
      });
      logger.info("Default admin user seeded successfully.");
    }

    server.listen(port, () => {
      logger.info(`Server started on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Unable to start server");
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught exception");
  process.exit(1);
});

startServer();

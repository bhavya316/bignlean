require("dotenv").config();
const http = require("http");
const apis = require("./routes");
const sequelize = require("./config/database");
const logger = require("./utils/logger");

const port = process.env.PORT || 3002;

const server = http.createServer(apis);

const startServer = async () => {
  try {
    await sequelize.authenticate();
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

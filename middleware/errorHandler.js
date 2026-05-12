const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;
  const isServerError = statusCode >= 500;

  logger[isServerError ? "error" : "warn"](
    {
      err: error,
      method: req.method,
      path: req.originalUrl,
      statusCode,
    },
    error.message || "Request failed"
  );

  res.status(statusCode).json({
    status: false,
    message: isServerError ? "Internal Server Error" : error.message,
    ...(error.details ? { errors: error.details } : {}),
  });
};

module.exports = errorHandler;

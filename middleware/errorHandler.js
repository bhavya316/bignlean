const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message;

  if (error.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    const path = error.errors && error.errors[0] && error.errors[0].path ? String(error.errors[0].path).toLowerCase() : "value";
    if (path.includes("phone")) {
      message = "This phone number already exists.";
    } else if (path.includes("email")) {
      message = "This email address already exists.";
    } else {
      message = `This ${path} already exists.`;
    }
  }

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
    message: isServerError ? "Internal Server Error" : message,
    ...(error.details ? { errors: error.details } : {}),
  });
};

module.exports = errorHandler;

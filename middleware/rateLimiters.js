const rateLimit = require("express-rate-limit");

const createAuthLimiter = (message) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skip: (req, res) => {
      // Bypass rate limit for the test account
      if (req.body && req.body.phone === "9999999999") {
        return true;
      }
      return false;
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: false,
      message,
    },
  });

module.exports = {
  registerLimiter: createAuthLimiter("Too many registration attempts. Please try again later."),
  sendLoginOtpLimiter: createAuthLimiter("Too many login OTP requests. Please try again later."),
  verifyOtpLimiter: createAuthLimiter("Too many OTP verification attempts. Please try again later."),
  loginLimiter: createAuthLimiter("Too many login attempts. Please try again later."),
};

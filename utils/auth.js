const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required for authentication");
  }

  return process.env.JWT_SECRET;
};

const sanitizeUser = (user, extra = {}) => {
  const data = user && typeof user.toJSON === "function" ? user.toJSON() : { ...(user || {}) };

  delete data.password;
  delete data.otp;
  delete data.otpExpiry;

  return { ...data, ...extra };
};

const generateToken = (user) => {
  const userData = user && typeof user.toJSON === "function" ? user.toJSON() : user;

  return jwt.sign(
    {
      id: userData.id,
      phone: userData.phone || null,
      type: "user",
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
  );
};

module.exports = {
  generateToken,
  sanitizeUser,
};

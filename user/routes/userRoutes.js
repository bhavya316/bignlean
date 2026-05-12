const express = require("express");
const { body, param, validationResult } = require("express-validator");
const userController = require("../controllers/userController");
const checkUserBlocked = require("../middleware/checkUserBlocked");
const Transaction = require("../model/transaction");
const User = require("../model/user");
const { getTransactionsByUser } = require("../controllers/transactionController");
const {
  authMiddleware,
  requireSameUserParam,
} = require("../../middleware/authMiddleware");
const {
  loginLimiter,
  registerLimiter,
  sendLoginOtpLimiter,
  verifyOtpLimiter,
} = require("../../middleware/rateLimiters");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "ERROR",
      errors: errors.array(),
    });
  }

  next();
};

router.post(
  "/register",
  registerLimiter,
  [
    body("phone").notEmpty().withMessage("Phone is required"),
    body("name").optional(),
    body("email").optional(),
    body("gender").optional(),
    body("dob").optional(),
    body("height").optional(),
    body("weight").optional(),
  ],
  handleValidation,
  checkUserBlocked,
  userController.createUser
);

router.post(
  "/verify-otp",
  verifyOtpLimiter,
  [
    body("phone").notEmpty().withMessage("Phone is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  handleValidation,
  checkUserBlocked,
  userController.verifyOtp
);

router.post(
  "/send-login-otp",
  sendLoginOtpLimiter,
  [body("phone").notEmpty().withMessage("Phone is required")],
  handleValidation,
  checkUserBlocked,
  userController.sendLoginOtp
);

router.post(
  "/resend-otp",
  sendLoginOtpLimiter,
  [body("phone").notEmpty().withMessage("Phone is required")],
  handleValidation,
  checkUserBlocked,
  userController.resendOtp
);

router.post(
  "/login",
  loginLimiter,
  [
    body("phone").notEmpty().withMessage("Phone is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  handleValidation,
  checkUserBlocked,
  userController.loginUser
);

router.post(
  "/auth/firebase",
  loginLimiter,
  [body("idToken").notEmpty().withMessage("Firebase ID token is required")],
  handleValidation,
  userController.verifyFirebaseToken
);

router.post(
  "/auth/social",
  loginLimiter,
  [
    body("idToken").notEmpty().withMessage("ID token is required"),
    body("provider")
      .isIn(["google", "facebook"])
      .withMessage("Provider must be 'google' or 'facebook'"),
  ],
  handleValidation,
  userController.socialAuth
);

router.put(
  "/users/:id",
  authMiddleware,
  requireSameUserParam("id"),
  [
    param("id").notEmpty().withMessage("User ID is required"),
    body("name").optional(),
    body("phone").optional(),
    body("email").optional(),
    body("gender").optional(),
    body("dob").optional(),
    body("height").optional(),
    body("weight").optional(),
    body("image").optional(),
  ],
  handleValidation,
  userController.updateUser
);

router.get(
  "/user/:id",
  authMiddleware,
  requireSameUserParam("id"),
  param("id").notEmpty().withMessage("User ID is required"),
  handleValidation,
  userController.getUserDetailsById
);

router.get(
  "/user/wallet/:id",
  authMiddleware,
  requireSameUserParam("id"),
  param("id").notEmpty().withMessage("User ID is required"),
  handleValidation,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.id);
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      const transactions = await getTransactionsByUser(userId);
      const walletBalance =
        typeof Transaction.calculateFinalValueForUser === "function"
          ? await Transaction.calculateFinalValueForUser(userId)
          : 0;

      return res.status(200).json({
        status: true,
        transactions,
        walletBalance,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

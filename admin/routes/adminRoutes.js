const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const adminController = require("../controllers/adminController");

const createAdminValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

const loginAdminValidation = [
  body("identifier").notEmpty().withMessage("Email or phone is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const resetPasswordValidation = [
  body("identifier").notEmpty().withMessage("Email or phone is required"),
  body("newPassword").notEmpty().withMessage("New password is required"),
];

router.post("/admin", createAdminValidation, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  adminController.createAdmin(req, res, next);
});

router.post("/admin/login", loginAdminValidation, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  adminController.loginAdmin(req, res, next);
});

router.post("/admin/reset-password", resetPasswordValidation, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  adminController.resetPassword(req, res, next);
});

module.exports = router;

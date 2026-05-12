const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const userController = require("../../user/controllers/userController");
const referController = require("../controllers/referController");

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

router.get("/users", userController.getAllUsers);
router.get("/getReferrals", referController.getReferes);
router.put(
  "/users/:id/block",
  [
    param("id").notEmpty().withMessage("User ID is required"),
    body("isBlocked").isBoolean().withMessage("isBlocked must be a boolean"),
  ],
  handleValidation,
  userController.blockUser
);

module.exports = router;

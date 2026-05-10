const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const ratingController = require("../controllers/ratingController");

router.post(
  "/ratings",
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("product").notEmpty().withMessage("Product ID is required"),
    body("images").optional().isArray().withMessage("Images must be an array"),
    body("rate")
      .notEmpty()
      .withMessage("Rate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rate must be between 1 and 5"),
    body("tasteRate")
      .notEmpty()
      .withMessage("tasteRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("tasteRate must be between 1 and 5"),
    body("mixabilityRate")
      .notEmpty()
      .withMessage("mixabilityRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("mixabilityRate must be between 1 and 5"),
    body("efficacyRate")
      .notEmpty()
      .withMessage("efficacyRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("efficacyRate must be between 1 and 5"),
    body("valueForMoneyRate")
      .notEmpty()
      .withMessage("valueForMoneyRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("valueForMoneyRate must be between 1 and 5"),
    body("review").optional(),
  ],
  ratingController.addRating
);

router.get("/ratings/:id", ratingController.getAllRating);

router.put(
  "/ratings/:id",
  [
    param("id").notEmpty().withMessage("Rating ID is required"),
    body("user").optional(),
    body("product").optional(),
    body("images").optional().isArray().withMessage("Images must be an array"),
    body("rate")
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rate must be between 1 and 5"),
    body("tasteRate")
      .notEmpty()
      .withMessage("tasteRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("tasteRate must be between 1 and 5"),
    body("mixabilityRate")
      .notEmpty()
      .withMessage("mixabilityRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("mixabilityRate must be between 1 and 5"),
    body("efficacyRate")
      .notEmpty()
      .withMessage("efficacyRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("efficacyRate must be between 1 and 5"),
    body("valueForMoneyRate")
      .notEmpty()
      .withMessage("valueForMoneyRate is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("valueForMoneyRate must be between 1 and 5"),
    body("review").optional(),
  ],
  ratingController.updateRating
);

router.delete(
  "/ratings/:id",
  param("id").notEmpty().withMessage("Rating ID is required"),
  ratingController.deleteRating
);

module.exports = router;

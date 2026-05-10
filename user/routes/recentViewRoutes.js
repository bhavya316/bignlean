const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const recentViewController = require("../../user/controllers/recentViewController");

router.post(
  "/recentViews",
  [
    body("userId").notEmpty().withMessage("User ID is required").isInt().withMessage("User ID must be an integer"),
    body("productId").notEmpty().withMessage("Product ID is required").isInt().withMessage("Product ID must be an integer"),
  ],
  recentViewController.addRecentView
);

router.get("/recentViews", recentViewController.getAllRecentViews);

router.put(
  "/recentViews/:id",
  [
    param("id").notEmpty().withMessage("Recent View ID is required").isInt().withMessage("Recent View ID must be an integer"),
    body("userId").notEmpty().withMessage("User ID is required").isInt().withMessage("User ID must be an integer"),
    body("productId").notEmpty().withMessage("Product ID is required").isInt().withMessage("Product ID must be an integer"),
  ],
  recentViewController.updateRecentView
);

router.delete(
  "/recentViews/:id",
  param("id").notEmpty().withMessage("Recent View ID is required").isInt().withMessage("Recent View ID must be an integer"),
  recentViewController.deleteRecentView
);

module.exports = router;
const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const recentViewController = require("../../user/controllers/recentViewController");
const RecentView = require("../model/recentView");
const {
  authMiddleware,
  requireOwnedResource,
  requireSameUserBody,
  requireSameUserQuery,
} = require("../../middleware/authMiddleware");

router.post(
  "/recentViews",
  authMiddleware,
  [
    body("userId").notEmpty().withMessage("User ID is required").isInt().withMessage("User ID must be an integer"),
    body("productId").notEmpty().withMessage("Product ID is required").isInt().withMessage("Product ID must be an integer"),
  ],
  requireSameUserBody("userId"),
  recentViewController.addRecentView
);

router.get(
  "/recentViews",
  authMiddleware,
  requireSameUserQuery("userId", { defaultToAuthenticatedUser: true }),
  recentViewController.getAllRecentViews
);

router.put(
  "/recentViews/:id",
  authMiddleware,
  requireOwnedResource(RecentView, "id", "userId"),
  [
    param("id").notEmpty().withMessage("Recent View ID is required").isInt().withMessage("Recent View ID must be an integer"),
    body("userId").notEmpty().withMessage("User ID is required").isInt().withMessage("User ID must be an integer"),
    body("productId").notEmpty().withMessage("Product ID is required").isInt().withMessage("Product ID must be an integer"),
  ],
  requireSameUserBody("userId"),
  recentViewController.updateRecentView
);

router.delete(
  "/recentViews/:id",
  authMiddleware,
  param("id").notEmpty().withMessage("Recent View ID is required").isInt().withMessage("Recent View ID must be an integer"),
  requireOwnedResource(RecentView, "id", "userId"),
  recentViewController.deleteRecentView
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const subscriptionController = require("../controllers/subscriptionController");
const Subscription = require("../model/subscription");
const {
  authMiddleware,
  requireOwnedResource,
  requireSameUserBody,
  requireSameUserParam,
} = require("../../middleware/authMiddleware");

router.post(
  "/subscriptions",
  authMiddleware,
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("plan").notEmpty().withMessage("Plan ID is required"),
  ],
  requireSameUserBody("user"),
  subscriptionController.addSubscription
);

router.get(
  "/subscriptions/user/:user",
  authMiddleware,
  param("user").notEmpty().withMessage("User ID is required"),
  requireSameUserParam("user"),
  subscriptionController.getSubscriptionsByUser
);

router.delete(
  "/subscriptions/:id",
  authMiddleware,
  param("id").notEmpty().withMessage("Subscription ID is required"),
  requireOwnedResource(Subscription, "id", "user"),
  subscriptionController.deleteSubscription
);

module.exports = router;

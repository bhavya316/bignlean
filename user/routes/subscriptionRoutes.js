const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const subscriptionController = require("../controllers/subscriptionController");

router.post(
  "/subscriptions",
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("plan").notEmpty().withMessage("Plan ID is required"),
  ],
  subscriptionController.addSubscription
);

router.get(
  "/subscriptions/user/:user",
  param("user").notEmpty().withMessage("User ID is required"),
  subscriptionController.getSubscriptionsByUser
);

router.delete(
  "/subscriptions/:id",
  param("id").notEmpty().withMessage("Subscription ID is required"),
  subscriptionController.deleteSubscription
);

module.exports = router;

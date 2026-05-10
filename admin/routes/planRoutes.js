const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const planController = require("../controllers/planController");

router.post(
  "/plans",
  [
    body("duration").notEmpty().withMessage("Duration is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("benefits").notEmpty().withMessage("Benefits is required"),
  ],
  planController.addPlan
);

router.get("/plans", planController.getAllPlans);

router.put(
  "/plans/:id",
  [
    param("id").notEmpty().withMessage("Plan ID is required"),
    body("duration").notEmpty().withMessage("Duration is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("benefits").notEmpty().withMessage("Benefits is required"),
  ],
  planController.updatePlan
);

router.delete(
  "/plans/:id",
  param("id").notEmpty().withMessage("Plan ID is required"),
  planController.deletePlan
);

module.exports = router;

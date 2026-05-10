const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const dealController = require("../controllers/dealController");

router.post(
  "/deals",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("type").notEmpty().withMessage("Type is required"),
  ],
  dealController.addDeal
);

router.get("/deals", dealController.getAllDeals);

router.put(
  "/deals/:id",
  [
    param("id").notEmpty().withMessage("Deal ID is required"),
    body("products").optional(),
  ],
  dealController.updateDeal
);

router.delete(
  "/deals/:id",
  param("id").notEmpty().withMessage("Deal ID is required"),
  dealController.deleteDeal
);

router.delete(
  "/product/deals/:id/:product",
  [
    param("id").notEmpty().withMessage("Deal ID is required"),
    param("product").notEmpty().withMessage("Product ID is required"),
  ],
  dealController.deleteProfuctFromDeal
);

module.exports = router;

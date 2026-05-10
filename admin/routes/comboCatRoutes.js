const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const comboCatController = require("../controllers/comboCatController");

router.post(
  "/comboCategories",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("image").notEmpty().withMessage("Image is required"),
  ],
  comboCatController.addComboCategory
);

router.get("/comboCategories", comboCatController.getAllComboCategories);

router.put(
  "/comboCategories/:id",
  [
    param("id").notEmpty().withMessage("Combo Category ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("image").notEmpty().withMessage("Image is required"),
  ],
  comboCatController.updateComboCategory
);

router.delete(
  "/comboCategories/:id",
  param("id").notEmpty().withMessage("Combo Category ID is required"),
  comboCatController.deleteComboCategory
);

module.exports = router;

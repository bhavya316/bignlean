const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const comboSubCatController = require("../controllers/comboSubCatController");

router.post(
  "/comboSubCategories",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("catId").notEmpty().withMessage("Category ID is required"),
  ],
  comboSubCatController.addComboSubCategory
);

router.get(
  "/comboSubCategories/:categoryId",
  comboSubCatController.getAllComboSubCategories
);

router.put(
  "/comboSubCategories/:id",
  [
    param("id").notEmpty().withMessage("Combo Subcategory ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("catId").notEmpty().withMessage("Category ID is required"),
  ],
  comboSubCatController.updateComboSubCategory
);

router.delete(
  "/comboSubCategories/:id",
  param("id").notEmpty().withMessage("Combo Subcategory ID is required"),
  comboSubCatController.deleteComboSubCategory
);

module.exports = router;

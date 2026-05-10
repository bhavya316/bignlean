const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const comboController = require("../controllers/comboController");

router.post(
  "/comboProducts",
  [
    body("catId").notEmpty().withMessage("catId is required"),
    body("products").notEmpty().withMessage("Products is required"),
  ],
  comboController.addComboProduct
);

router.get("/comboProducts", comboController.getAllComboProducts);

router.put(
  "/comboProducts/:id",
  [
    param("id").notEmpty().withMessage("Combo Product ID is required"),
    body("catId").notEmpty().withMessage("catId is required"),
    body("products").notEmpty().withMessage("Products is required"),
  ],
  comboController.updateComboProduct
);

router.delete(
  "/comboProducts/:catId/:productId",
  param("catId").notEmpty().withMessage("Combo Product ID is required"),
  comboController.deleteComboProduct
);

router.get(
  "/comboProducts",
  [
    query("catId").notEmpty().withMessage("catId is required"),
    query("subCatId").notEmpty().withMessage("subCatId is required"),
  ],
  comboController.getComboProductsByCatAndSubCat
);

module.exports = router;

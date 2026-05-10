const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const brandController = require("../controllers/brandController");

router.post(
  "/brands",
  [
    body("image").notEmpty().withMessage("Image is required"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  brandController.addBrand
);

router.get("/brands", brandController.getAllBrands);

router.get("/brandsById", brandController.getBrandsBySubcatId);

router.put(
  "/brands/:id",
  [
    param("id").notEmpty().withMessage("Brand ID is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  brandController.updateBrand
);

router.delete(
  "/brands/:id",
  param("id").notEmpty().withMessage("Brand ID is required"),
  brandController.deleteBrand
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, param, query, validationResult } = require("express-validator");
const comboProductController = require("../controllers/comboProductController");

router.post(
  "/combo-products",
  [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("products").optional().isArray({ min: 2, max: 3 }).withMessage("Products must contain 2 or 3 product IDs"),
    body("varients").optional().isArray().withMessage("Variants must be an array"),
  ],
  comboProductController.addComboProduct
);

router.get("/combo-products", comboProductController.getAllComboProducts);

router.get(
  "/combo-products/all-products",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("brandId")
      .optional()
      .isInt()
      .withMessage("Brand ID must be an integer"),
    query("catId")
      .optional()
      .isInt()
      .withMessage("Category ID must be an integer"),
    query("subCatId")
      .optional()
      .isInt()
      .withMessage("Subcategory ID must be an integer"),
    query("subCatId2")
      .optional()
      .isInt()
      .withMessage("Subcategory 2 ID must be an integer"),
    query("comboCatId")
      .optional()
      .isInt()
      .withMessage("Combo Category ID must be an integer"),
    query("search")
      .optional()
      .isString()
      .withMessage("Search must be a string"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    comboProductController.getAllComboProductsPaginated(req, res);
  }
);

router.get(
  "/combo-products/category/:comboCatId",
  [
    param("comboCatId").notEmpty().withMessage("Combo Category ID is required"),
  ],
  comboProductController.getComboProductsByCategory
);

router.get(
  "/combo-categories-with-products",
  comboProductController.getAllComboCategoriesWithProducts
);

router.get(
  "/combo-product/:id",
  [
    param("id").notEmpty().withMessage("Combo Product ID is required"),
  ],
  comboProductController.getComboProductByIdWithDetails
);

router.put(
  "/combo-products/:id",
  [
    param("id").notEmpty().withMessage("Combo Product ID is required"),
  ],
  comboProductController.updateComboProduct
);

router.delete(
  "/combo-products/:id",
  [
    param("id").notEmpty().withMessage("Combo Product ID is required"),
  ],
  comboProductController.deleteComboProduct
);

module.exports = router;

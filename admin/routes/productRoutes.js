const express = require("express");
const router = express.Router();
const { body, param, query, validationResult } = require("express-validator");
const productController = require("../controllers/productController");

router.post(
  "/products",
  [ 
    body("catId").notEmpty().withMessage("Category ID is required"),
    body("subCatId").notEmpty().withMessage("Subcategory ID is required"),
    body("countryOfOrigin").optional(),
    body("isVeg").isBoolean().withMessage("isVeg must be a boolean"),
   
  ],
  productController.addProduct
);

router.get(
  "/products",
  [
    query("catId").notEmpty().withMessage("catId is required"),
    query("subCatId").notEmpty().withMessage("suCatId is required"),
    query("brandId").notEmpty().withMessage("brandId is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    productController.getProductsByCategoryAndSubCategory(req, res);
  }
);

router.put(
  "/products/:id",
  param("id").notEmpty().withMessage("Product ID is required"),
  productController.updateProduct
);

router.delete(
  "/products/:id",
  param("id").notEmpty().withMessage("Product ID is required"),
  productController.deleteProduct
);

router.put("/stock/update", productController.updateStock);
router.put("/toggle/bestSeller", productController.toggleBestSeller);
// Add this route to productRoutes.js
router.get(
  "/products-by-category",
  [
    query("catId").notEmpty().withMessage("catId is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    productController.getProductsByCategory(req, res);
  }
);
// Route to get related products
router.get(
  "/related-products",
  [
    query("productId").notEmpty().withMessage("productId is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    productController.getRelatedProducts(req, res);
  }
);

// Route to get out of stock products
router.get("/out-of-stock-products", productController.getOutOfStockProducts);


// New route for best-seller products
router.get(
  "/bestSellers",
  [
    query("user")
      .optional()
      .isInt()
      .withMessage("User ID must be an integer"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    productController.getBestSellerProducts(req, res);
  }
);

// New route for trending products
router.get(
  "/trending",
  [
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    productController.getTrendingProducts(req, res);
  }
);

// New route for best-selling products today
router.get(
  "/best-selling-products-today",
  [
    query("user")
      .optional()
      .isInt()
      .withMessage("User ID must be an integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    productController.getBestSellingProductsToday(req, res);
  }
);

// New route for best-selling product today by ID
router.get(
  "/best-selling-product-today/:id/:user?",
  [
    param("id").notEmpty().withMessage("Product ID is required"),
    param("user")
      .optional()
      .isInt()
      .withMessage("User ID must be an integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    productController.getBestSellingProductTodayById(req, res);
  }
);

// New route for paginated products with optional filters
router.get(
  "/all-products",
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
    productController.getAllProductsPaginated(req, res);
  }
);

module.exports = router;

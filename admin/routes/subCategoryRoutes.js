const express = require("express");
const router = express.Router();
const { query, body, validationResult } = require("express-validator");
const subCategoryController = require("../controllers/subCategoryController");

router.post(
  "/subcategories",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("catId").optional({ checkFalsy: true }).isInt().withMessage("Category ID must be a number"),
    body("categoryId").optional({ checkFalsy: true }).isInt().withMessage("Category ID must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    subCategoryController.createSubCategory(req, res);
  }
);

router.get(
  "/subcategories",
  subCategoryController.getAllSubCategories
);

router.get(
  "/subcategory/:id",
  subCategoryController.getSubCategoryById
);

router.get(
  "/subcategories/:categoryId",
  subCategoryController.getSubCategoriesByCategoryId
);

router.get(
  "/all-subcategories",
  subCategoryController.getAllSubCategories
);

router.delete(
  "/subcategories",
  [query("id").notEmpty().withMessage("ID is required")],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    subCategoryController.deleteSubCategory(req, res);
  }
);

router.put(
  "/subcategories",
  [
    body("id").notEmpty().withMessage("ID is required"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("catId").optional({ checkFalsy: true }).isInt().withMessage("Category ID must be a number"),
    body("categoryId").optional({ checkFalsy: true }).isInt().withMessage("Category ID must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    // Check if at least one field (name or catId) is provided for update
    if (!req.body.name && req.body.catId === undefined && req.body.categoryId === undefined) {
      return res
        .status(400)
        .json({ status: false, message: "At least one field (name or category ID) must be provided for update" });
    }

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    subCategoryController.updateSubCategory(req, res);
  }
);



router.post(
  "/subcategories2",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subCategoryId").optional({ checkFalsy: true }).isInt().withMessage("SubCategory ID must be a number"),
    body("subcategoryId").optional({ checkFalsy: true }).isInt().withMessage("SubCategory ID must be a number"),
    body("subCatId").optional({ checkFalsy: true }).isInt().withMessage("SubCategory ID must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    subCategoryController.createSubCategory2(req, res);
  }
);



router.get(
  "/subcategories2",
  subCategoryController.getAllSubCategories2
);

router.get(
  "/subcategory2/:id",
  subCategoryController.getSubCategory2ById
);

router.get(
  "/subcategories2/:subCategoryId",
  subCategoryController.getSubCategoriesByCategoryId2
);

router.delete(
  "/subcategories2",
  [query("id").notEmpty().withMessage("ID is required")],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    subCategoryController.deleteSubCategory2(req, res);
  }
);

router.put(
  "/subcategories2",
  [
    body("id").notEmpty().withMessage("ID is required"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("subCategoryId").optional({ checkFalsy: true }).isInt().withMessage("SubCategory ID must be a number"),
    body("subcategoryId").optional({ checkFalsy: true }).isInt().withMessage("SubCategory ID must be a number"),
    body("subCatId").optional({ checkFalsy: true }).isInt().withMessage("SubCategory ID must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    // Check if at least one field (name or subCategoryId) is provided for update
    if (
      !req.body.name &&
      req.body.subCategoryId === undefined &&
      req.body.subcategoryId === undefined &&
      req.body.subCatId === undefined
    ) {
      return res
        .status(400)
        .json({ status: false, message: "At least one field (name or subcategory ID) must be provided for update" });
    }

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    subCategoryController.updateSubCategory2(req, res);
  }
);

module.exports = router;

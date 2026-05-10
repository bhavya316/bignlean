const express = require("express");
const router = express.Router();
const { query, body, validationResult } = require("express-validator");
const subCategoryController = require("../controllers/subCategoryController");

router.post(
  "/subcategories",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("catId").notEmpty().withMessage("Category ID is required"),
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
  "/subcategories/:categoryId",
  subCategoryController.getSubCategoriesByCategoryId
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
    body("name").notEmpty().withMessage("Name is required"),
    body("catId").notEmpty().withMessage("Category ID is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

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
    body("subCategoryId").notEmpty().withMessage("subCategoryId ID is required"),
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
    body("name").notEmpty().withMessage("Name is required"),
    body("subCategoryId").notEmpty().withMessage("subCategoryId ID is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    subCategoryController.updateSubCategory2(req, res);
  }
);

module.exports = router;

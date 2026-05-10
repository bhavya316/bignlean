const express = require("express");
const router = express.Router();
const { query, body, validationResult } = require("express-validator");
const categoryController = require("../controllers/categoryController");

router.post(
  "/categories",
  [
    body("name").notEmpty().withMessage("Name is required"),
    // body("brandId").notEmpty().withMessage("brandId is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    categoryController.createCategory(req, res);
  }
);

router.get("/categories/:categoryId", categoryController.getAllCategories);


router.delete(
  "/categories",
  [query("id").notEmpty().withMessage("ID is required")],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    categoryController.deleteCategory(req, res);
  }
);

router.put(
  "/categories",
  [
    body("id").notEmpty().withMessage("ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("image")
      .notEmpty()
      .withMessage("Image is required")
      .isURL()
      .withMessage("Image must be a valid URL"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    categoryController.updateCategory(req, res);
  }
);

module.exports = router;

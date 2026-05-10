const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const blogController = require("../controllers/blogController");

router.post(
  "/blogs",
  [
    body("images")
      .notEmpty()
      .isArray()
      .withMessage("Images must be an array of URLs"),
    body("heading").notEmpty().withMessage("Heading is required"),
    body("bodyText").notEmpty().withMessage("Body text is required"),
    body("tags").notEmpty().isArray().withMessage("Tags must be an array"),
    body("duration").notEmpty().withMessage("Duration is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  blogController.addBlog
);

router.get("/blogs", blogController.getAllBlogs);

router.get(
  "/blogs/:id",
  param("id").notEmpty().withMessage("Blog ID is required"),
  blogController.getBlogById
);

router.put(
  "/blogs/:id",
  [
    param("id").notEmpty().withMessage("Blog ID is required"),
    body("images")
      .notEmpty()
      .isArray()
      .withMessage("Images must be an array of URLs"),
    body("heading").notEmpty().withMessage("Heading is required"),
    body("bodyText").notEmpty().withMessage("Body text is required"),
    body("tags").notEmpty().isArray().withMessage("Tags must be an array"),
    body("duration").notEmpty().withMessage("Duration is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  blogController.updateBlog
);

router.delete(
  "/blogs/:id",
  param("id").notEmpty().withMessage("Blog ID is required"),
  blogController.deleteBlog
);

module.exports = router;

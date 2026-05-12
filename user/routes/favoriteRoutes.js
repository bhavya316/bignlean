const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const favoriteController = require("../controllers/favoriteController");
const {
  authMiddleware,
  requireSameUserBody,
  requireSameUserParam,
} = require("../../middleware/authMiddleware");

router.post(
  "/favorites",
  authMiddleware,
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("product").notEmpty().withMessage("Product ID is required"),
  ],
  requireSameUserBody("user"),
  favoriteController.addFavorite
);

router.get(
  "/favorites/user/:user",
  authMiddleware,
  param("user").notEmpty().withMessage("User ID is required"),
  requireSameUserParam("user"),
  favoriteController.getFavoritesByUser
);

router.delete(
  "/favorites/user/:user/product/:product",
  authMiddleware,
  [
    param("user").notEmpty().withMessage("User ID is required"),
    param("product").notEmpty().withMessage("Product ID is required"),
  ],
  requireSameUserParam("user"),
  favoriteController.deleteFavorite
);

module.exports = router;

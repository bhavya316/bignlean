const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const favoriteController = require("../controllers/favoriteController");

router.post(
  "/favorites",
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("product").notEmpty().withMessage("Product ID is required"),
  ],
  favoriteController.addFavorite
);

router.get(
  "/favorites/user/:user",
  param("user").notEmpty().withMessage("User ID is required"),
  favoriteController.getFavoritesByUser
);

router.delete(
  "/favorites/user/:user/product/:product",
  [
    param("user").notEmpty().withMessage("User ID is required"),
    param("product").notEmpty().withMessage("Product ID is required"),
  ],
  favoriteController.deleteFavorite
);

module.exports = router;

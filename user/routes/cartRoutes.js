const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const cartController = require("../controllers/cartController");
const Cart = require("../model/cart");
const {
  authMiddleware,
  requireOwnedResource,
  requireSameUserBody,
  requireSameUserParam,
} = require("../../middleware/authMiddleware");

router.post(
  "/cart",
  authMiddleware,
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("product").notEmpty().withMessage("Product ID is required"),
    body("qty")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  requireSameUserBody("user"),
  cartController.addToCart
);

router.put(
  "/cart/:id",
  authMiddleware,
  requireOwnedResource(Cart, "id", "user"),
  [
    param("id").notEmpty().withMessage("Cart item ID is required"),
    body("qty")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  cartController.updateCartQty
);

router.delete(
  "/cart/:id",
  authMiddleware,
  param("id").notEmpty().withMessage("Cart item ID is required"),
  requireOwnedResource(Cart, "id", "user"),
  cartController.removeFromCart
);

router.delete(
  "/clear/cart/:user",
  authMiddleware,
  param("user").notEmpty().withMessage("User ID is required"),
  requireSameUserParam("user"),
  cartController.clearCart
);

router.get(
  "/cart/user/:user",
  authMiddleware,
  param("user").notEmpty().withMessage("User ID is required"),
  requireSameUserParam("user"),
  cartController.getCartByUser
);

module.exports = router;

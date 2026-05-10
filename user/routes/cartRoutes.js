const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const cartController = require("../controllers/cartController");

router.post(
  "/cart",
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("product").notEmpty().withMessage("Product ID is required"),
    body("qty")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  cartController.addToCart
);

router.put(
  "/cart/:id",
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
  param("id").notEmpty().withMessage("Cart item ID is required"),
  cartController.removeFromCart
);

router.delete(
  "/clear/cart/:user",
  param("user").notEmpty().withMessage("User ID is required"),
  cartController.clearCart
);

router.get(
  "/cart/user/:user",
  param("user").notEmpty().withMessage("User ID is required"),
  cartController.getCartByUser
);

module.exports = router;

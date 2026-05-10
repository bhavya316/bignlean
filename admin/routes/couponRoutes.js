const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const couponController = require("../controllers/couponController");

// Add a coupon
router.post(
  "/coupons",
  [
    body("coupon").notEmpty().withMessage("Coupon is required"),
    body("discount").notEmpty().withMessage("Discount is required"),
    body("qty").notEmpty().withMessage("Qty is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  couponController.addCoupon
);

// Get all coupons
router.get("/coupons", couponController.getAllCoupons);

// Update a coupon by ID
router.put(
  "/coupons/:id",
  [
    param("id").notEmpty().withMessage("Coupon ID is required"),
    body("coupon").notEmpty().withMessage("Coupon is required"),
    body("discount").notEmpty().withMessage("Discount is required"),
    body("qty").notEmpty().withMessage("Qty is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  couponController.updateCoupon
);

// Delete a coupon by ID
router.delete(
  "/coupons/:id",
  param("id").notEmpty().withMessage("Coupon ID is required"),
  couponController.deleteCoupon
);

module.exports = router;

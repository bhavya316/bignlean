  const express = require("express");
  const router = express.Router();
  const { body, param } = require("express-validator");
  const addressController = require("../controllers/addressController");
  const Address = require("../model/address");
  const {
    authMiddleware,
    requireOwnedResource,
    requireSameUserBody,
    requireSameUserParam,
  } = require("../../middleware/authMiddleware");

  router.post(
    "/addresses",
    authMiddleware,
    [
      body("user").notEmpty().withMessage("User ID is required"),
      body("flat").optional(),
      body("landmark").optional(),
      body("city").optional(),
      body("pincode").optional(),
      body("name").optional(),
      body("phone").optional(),
      body("type").optional(),
      body("isDefault").optional(),
    ],
    requireSameUserBody("user"),
    addressController.addAddress
  );

  router.get(
    "/addresses/user/:userId",
    authMiddleware,
    param("userId").notEmpty().withMessage("User ID is required"),
    requireSameUserParam("userId"),
    addressController.getAddressesByUser
  );

  router.put(
    "/addresses/:id",
    authMiddleware,
    requireOwnedResource(Address, "id", "user"),
    [
      param("id").notEmpty().withMessage("Address ID is required"),
      body("user").optional(),
      body("flat").optional(),
      body("landmark").optional(),
      body("city").optional(),
      body("pincode").optional(),
      body("name").optional(),
      body("phone").optional(),
      body("type").optional(),
      body("isDefault").optional(),
    ],
    requireSameUserBody("user", { optional: true }),
    addressController.updateAddress
  );

  router.delete(
    "/addresses/:id",
    authMiddleware,
    param("id").notEmpty().withMessage("Address ID is required"),
    requireOwnedResource(Address, "id", "user"),
    addressController.deleteAddress
  );

  module.exports = router;

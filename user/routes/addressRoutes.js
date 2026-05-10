  const express = require("express");
  const router = express.Router();
  const { body, param } = require("express-validator");
  const addressController = require("../controllers/addressController");

  router.post(
    "/addresses",
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
    addressController.addAddress
  );

  router.get(
    "/addresses/user/:userId",
    param("userId").notEmpty().withMessage("User ID is required"),
    addressController.getAddressesByUser
  );

  router.put(
    "/addresses/:id",
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
    addressController.updateAddress
  );

  router.delete(
    "/addresses/:id",
    param("id").notEmpty().withMessage("Address ID is required"),
    addressController.deleteAddress
  );

  module.exports = router;

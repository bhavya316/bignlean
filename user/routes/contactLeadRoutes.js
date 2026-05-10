const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const contactLeadController = require("../controllers/contactLeadController");

const addContactLeadValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("message").optional().isString().withMessage("Message must be a string"),
];

router.post("/contact", addContactLeadValidation, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  contactLeadController.addContactLead(req, res);
});

router.get("/contacts", contactLeadController.getAllContactLeads);

module.exports = router;

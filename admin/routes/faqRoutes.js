const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const faqController = require("../controllers/faqController");

router.post(
  "/faqs",
  [
    body("heading").notEmpty().withMessage("Heading is required"),
    body("question").notEmpty().withMessage("Question is required"),
    body("answer").notEmpty().withMessage("Answer is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    faqController.addFAQ(req, res);
  }
);

router.get("/faqs", faqController.getGroupedFAQs);
router.get("/faqs/headings", faqController.getAllHeadings);
router.get("/faq", faqController.getAllFAQs);

router.put(
  "/faqs/:id",
  [
    param("id").notEmpty().withMessage("FAQ ID is required"),
    body("heading").notEmpty().withMessage("Heading is required"),
    body("question").notEmpty().withMessage("Question is required"),
    body("answer").notEmpty().withMessage("Answer is required"),
  ],

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    faqController.updateFAQ(req, res);
  }
);

router.delete(
  "/faqs/:id",
  param("id").notEmpty().withMessage("FAQ ID is required"),
  faqController.deleteFAQ
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const gymGuideController = require("../controllers/gymGuideController");

const addGymGuideValidation = [
  body("file").isString().withMessage("File must be a string (URL)"),
  body("description").notEmpty().withMessage("Description is required"),
];

router.post("/gym-guide", addGymGuideValidation, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  gymGuideController.addGymGuide(req, res);
});

router.get("/gym-guides", gymGuideController.getAllGymGuides);

router.delete("/gym-guide/:id", (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  gymGuideController.deleteGymGuide(req, res);
});

module.exports = router;

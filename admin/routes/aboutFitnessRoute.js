const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const aboutFitnessController = require("../controllers/aboutFitnessController");

const addAboutFitnessValidation = [
  body("images").isArray().withMessage("Images must be a list"),
  body("description").notEmpty().withMessage("Description is required"),
  body("actors").isArray().withMessage("Actors must be a list"),
];

router.post("/about-fitness", addAboutFitnessValidation, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  aboutFitnessController.addAboutFitness(req, res);
});

router.get("/about-fitness", aboutFitnessController.getAllAboutFitness);

router.delete("/about-fitness/:id", (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, message: "ERROR", errors: errors.array() });
  }

  aboutFitnessController.deleteAboutFitness(req, res);
});

router.put("/about-fitness/:id", aboutFitnessController.updateAboutFitness);

module.exports = router;

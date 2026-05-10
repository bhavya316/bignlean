const Rating = require("../model/rating");
const { validationResult } = require("express-validator");

const addRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try { 
    const newRating = await Rating.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Rating added.", rating: newRating });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to add rating.",
      error: error.message,
    });
  }
};

const updateRating = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res
        .status(404)
        .json({ status: false, message: "Rating not found" });
    }

    const updatedRating = await rating.update(req.body);
    res.status(200).json({
      status: true,
      message: "Rating updated.",
      rating: updatedRating,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to update rating.",
      error: error.message,
    });
  }
};

const getAllRating = async (req, res) => {
  try {
    const id = req.params.id;
    const ratings = await Rating.findAll({ where: { user: id } });
    res.status(200).json({ status: true, message: "OK", ratings });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: "Unable to delete rating.",
      error: e.message,
    });
  }
};

const deleteRating = async (req, res) => {
  const { id } = req.params;

  try {
    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res
        .status(404)
        .json({ status: false, message: "Rating not found" });
    }

    await rating.destroy();
    res.status(200).json({ status: true, message: "Rating deleted." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to delete rating.",
      error: error.message,
    });
  }
};

module.exports = {
  addRating,
  updateRating,
  deleteRating,
  getAllRating,
};

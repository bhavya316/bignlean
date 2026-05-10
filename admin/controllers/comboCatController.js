const ComboCategory = require("../model/comboCat");
const { validationResult } = require("express-validator");

const addComboCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const comboCategory = await ComboCategory.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Combo category added.", comboCategory });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to add combo category." });
  }
};

const getAllComboCategories = async (req, res) => {
  try {
    const comboCategories = await ComboCategory.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", comboCategories });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve combo categories." });
  }
};

const updateComboCategory = async (req, res) => {
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
    const comboCategory = await ComboCategory.findByPk(id);
    if (!comboCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Combo category not found" });
    }

    const updatedComboCategory = await comboCategory.update(req.body);
    res.status(200).json({
      status: true,
      message: "Combo category updated.",
      comboCategory: updatedComboCategory,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update combo category." });
  }
};

const deleteComboCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const comboCategory = await ComboCategory.findByPk(id);
    if (!comboCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Combo category not found" });
    }

    await comboCategory.destroy();
    res.status(200).json({ status: true, message: "Combo category deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete combo category." });
  }
};

module.exports = {
  addComboCategory,
  getAllComboCategories,
  updateComboCategory,
  deleteComboCategory,
};

const ComboSubCategory = require("../model/comboSubCat");
const { validationResult } = require("express-validator");

const addComboSubCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const comboSubCategory = await ComboSubCategory.create(req.body);
    res.status(201).json({
      status: true,
      message: "Combo subcategory added.",
      comboSubCategory,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to add combo subcategory." });
  }
};

const getAllComboSubCategories = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const comboSubCategories = await ComboSubCategory.findAll({
      where: { catId: categoryId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", comboSubCategories });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve combo subcategories.",
    });
  }
};

const updateComboSubCategory = async (req, res) => {
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
    const comboSubCategory = await ComboSubCategory.findByPk(id);
    if (!comboSubCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Combo subcategory not found" });
    }

    const updatedComboSubCategory = await comboSubCategory.update(req.body);
    res.status(200).json({
      status: true,
      message: "Combo subcategory updated.",
      comboSubCategory: updatedComboSubCategory,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update combo subcategory." });
  }
};

const deleteComboSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const comboSubCategory = await ComboSubCategory.findByPk(id);
    if (!comboSubCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Combo subcategory not found" });
    }

    await comboSubCategory.destroy();
    res
      .status(200)
      .json({ status: true, message: "Combo subcategory deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete combo subcategory." });
  }
};

module.exports = {
  addComboSubCategory,
  getAllComboSubCategories,
  updateComboSubCategory,
  deleteComboSubCategory,
};

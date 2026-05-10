const SubCategory = require("../model/subCategory");
const SubCategory2 = require("../model/subCategory2");

const createSubCategory = async (req, res) => {
  try {
    const { name, catId } = req.body;
    await SubCategory.create({ name, catId });
    res.status(201).json({ status: true, message: "Subcategory added." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to create subcategory." });
  }
};

const getSubCategoriesByCategoryId = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const subcategories = await SubCategory.findAll({
      where: { catId: categoryId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", subcategories });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subcategories by category ID.",
    });
  }
};

const deleteSubCategory = async (req, res) => {
  const subCategoryId = req.query.id;

  try {
    const subcategory = await SubCategory.findByPk(subCategoryId);

    if (!subcategory) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });
    }

    await subcategory.destroy();
    res.status(200).json({ status: true, message: "Subcategory deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete subcategory." });
  }
};

const updateSubCategory = async (req, res) => {
  const { name, catId, id } = req.body;

  try {
    const subcategory = await SubCategory.findByPk(id);

    if (!subcategory) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });
    }

    subcategory.name = name;
    subcategory.catId = catId;
    await subcategory.save();

    res.status(200).json({ status: true, message: "Subcategory updated." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update subcategory." });
  }
};



const createSubCategory2 = async (req, res) => {
  try {
    const { name, subCategoryId } = req.body;
    await SubCategory2.create({ name, subCategoryId });
    res.status(201).json({ status: true, message: "Subcategory2 added." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to create subcategory2." });
  }
};


const getSubCategoriesByCategoryId2 = async (req, res) => {
  const subCategoryId = req.params.subCategoryId;

  try {
    const subcategories2 = await SubCategory2.findAll({
      where: { subCategoryId: subCategoryId }, // Corrected to match model field name
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", subcategories2 });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subcategories by subcategory ID.",
    });
  }
};

const deleteSubCategory2 = async (req, res) => {
  const SubCatId = req.query.id;

  try {
    const subcategory2 = await SubCategory2.findByPk(SubCatId);

    if (!subcategory2) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory2 not found" });
    }

    await subcategory2.destroy();
    res.status(200).json({ status: true, message: "Subcategory2 deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete subcategory2." });
  }
};

const updateSubCategory2 = async (req, res) => {
  const { name, subCategoryId, id } = req.body;

  try {
    const subcategory2 = await SubCategory2.findByPk(id);

    if (!subcategory2) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory2 not found" });
    }

    subcategory2.name = name;
    subcategory2.subCategoryId = subCategoryId;
    await subcategory2.save();

    res.status(200).json({ status: true, message: "Subcategory2 updated." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update subcategory2." });
  }
};


module.exports = {
  createSubCategory,
  getSubCategoriesByCategoryId,
  deleteSubCategory,
  updateSubCategory,
  createSubCategory2,
  getSubCategoriesByCategoryId2,
  deleteSubCategory2,
  updateSubCategory2,
};

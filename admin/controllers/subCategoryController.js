const SubCategory = require("../model/subCategory");
const SubCategory2 = require("../model/subCategory2");

const toNullableInt = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const firstDefined = (...values) => values.find((value) => value !== undefined);

const createSubCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = firstDefined(req.body.catId, req.body.categoryId, req.body.category);
    const subcategoryData = {
      name: String(name || "").trim(),
      catId: toNullableInt(categoryId),
    };
    const result = await SubCategory.create(subcategoryData);
    res.status(201).json({
      status: true,
      message: "Subcategory added.",
      subcategory: result,
      data: result,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to create subcategory.", error: error.message });
  }
};

const getSubCategoriesByCategoryId = async (req, res) => {
  const categoryId = req.params.categoryId || req.query.categoryId || req.query.catId;

  try {
    const subcategories = await SubCategory.findAll({
      where: { catId: categoryId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", subcategories, data: subcategories });
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
  const { name } = req.body;
  const categoryId = firstDefined(req.body.catId, req.body.categoryId, req.body.category);
  const id = req.body.id || req.params.id || req.query.id;

  try {
    const subcategory = await SubCategory.findByPk(id);

    if (!subcategory) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });
    }

    // Update only the fields that are provided
    if (name !== undefined) {
      subcategory.name = String(name).trim();
    }
    if (categoryId !== undefined) {
      subcategory.catId = toNullableInt(categoryId);
    }

    await subcategory.save();

    res.status(200).json({ status: true, message: "Subcategory updated.", subcategory, data: subcategory });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update subcategory." });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const categoryId = req.query.categoryId || req.query.catId;
    const where = categoryId ? { catId: categoryId } : {};

    // Get total count for pagination metadata
    const totalCount = await SubCategory.count({ where });

    const subcategories = await SubCategory.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: true,
      message: "OK",
      subcategories,
      data: subcategories,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve all subcategories.",
    });
  }
};



const createSubCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    const parentSubCategoryId = firstDefined(
      req.body.subCategoryId,
      req.body.subcategoryId,
      req.body.subCatId,
      req.body.parentId
    );
    const subcategoryData = {
      name: String(name || "").trim(),
      subCategoryId: toNullableInt(parentSubCategoryId),
    };
    const result = await SubCategory2.create(subcategoryData);
    res.status(201).json({
      status: true,
      message: "Subcategory2 added.",
      subcategory2: result,
      data: result,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to create subcategory2.", error: error.message });
  }
};


const getSubCategoriesByCategoryId2 = async (req, res) => {
  const subCategoryId = req.params.subCategoryId || req.query.subCategoryId || req.query.subCatId;

  try {
    const subcategories2 = await SubCategory2.findAll({
      where: { subCategoryId: subCategoryId }, // Corrected to match model field name
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", subcategories2, data: subcategories2 });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subcategories by subcategory ID.",
    });
  }
};

const getAllSubCategories2 = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const subCategoryId = req.query.subCategoryId || req.query.subcategoryId || req.query.subCatId;
    const where = subCategoryId ? { subCategoryId } : {};

    const totalCount = await SubCategory2.count({ where });
    const subcategories2 = await SubCategory2.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: true,
      message: "OK",
      subcategories2,
      data: subcategories2,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve all subcategories2.",
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
  const { name } = req.body;
  const parentSubCategoryId = firstDefined(
    req.body.subCategoryId,
    req.body.subcategoryId,
    req.body.subCatId,
    req.body.parentId
  );
  const id = req.body.id || req.params.id || req.query.id;

  try {
    const subcategory2 = await SubCategory2.findByPk(id);

    if (!subcategory2) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory2 not found" });
    }

    // Update only the fields that are provided
    if (name !== undefined) {
      subcategory2.name = String(name).trim();
    }
    if (parentSubCategoryId !== undefined) {
      subcategory2.subCategoryId = toNullableInt(parentSubCategoryId);
    }

    await subcategory2.save();

    res.status(200).json({ status: true, message: "Subcategory2 updated.", subcategory2, data: subcategory2 });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update subcategory2." });
  }
};


module.exports = {
  createSubCategory,
  getSubCategoriesByCategoryId,
  getAllSubCategories,
  deleteSubCategory,
  updateSubCategory,
  createSubCategory2,
  getAllSubCategories2,
  getSubCategoriesByCategoryId2,
  deleteSubCategory2,
  updateSubCategory2,
};

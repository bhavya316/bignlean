const SubCategory = require("../model/subCategory");
const SubCategory2 = require("../model/subCategory2");
const Category = require("../model/category");

const toNullableInt = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const firstPresent = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const toPlain = (item) => (item && typeof item.toJSON === "function" ? item.toJSON() : item);

const requireCategory = async (value) => {
  const categoryId = toNullableInt(value);
  if (!categoryId) {
    const error = new Error("Parent category is required.");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findByPk(categoryId);
  if (!category) {
    const error = new Error("Parent category not found.");
    error.statusCode = 404;
    throw error;
  }

  return categoryId;
};

const requireSubCategory = async (value) => {
  const subCategoryId = toNullableInt(value);
  if (!subCategoryId) {
    const error = new Error("Parent subcategory is required.");
    error.statusCode = 400;
    throw error;
  }

  const subcategory = await SubCategory.findByPk(subCategoryId);
  if (!subcategory) {
    const error = new Error("Parent subcategory not found.");
    error.statusCode = 404;
    throw error;
  }

  return subCategoryId;
};

const attachCategoryDetails = async (subcategories) => {
  const rows = subcategories.map(toPlain);
  const categories = await Category.findAll();
  const categoryById = categories.reduce((acc, item) => {
    const category = item.toJSON();
    acc[category.id] = category;
    return acc;
  }, {});

  return rows.map((subcategory) => {
    const category = categoryById[subcategory.catId] || null;
    return {
      ...subcategory,
      category,
      categoryId: subcategory.catId,
      parentCategoryId: subcategory.catId,
      categoryName: category ? category.name : null,
    };
  });
};

const attachSubCategory2Details = async (subcategories2) => {
  const rows = subcategories2.map(toPlain);
  const [subcategories, categories] = await Promise.all([
    SubCategory.findAll(),
    Category.findAll(),
  ]);
  const subcategoryById = subcategories.reduce((acc, item) => {
    const subcategory = item.toJSON();
    acc[subcategory.id] = subcategory;
    return acc;
  }, {});
  const categoryById = categories.reduce((acc, item) => {
    const category = item.toJSON();
    acc[category.id] = category;
    return acc;
  }, {});

  return rows.map((subcategory2) => {
    const subcategory = subcategoryById[subcategory2.subCategoryId] || null;
    const category = subcategory ? categoryById[subcategory.catId] || null : null;
    return {
      ...subcategory2,
      subcategory,
      subcategoryId: subcategory2.subCategoryId,
      parentSubCategoryId: subcategory2.subCategoryId,
      subcategoryName: subcategory ? subcategory.name : null,
      category,
      catId: subcategory ? subcategory.catId : null,
      categoryId: subcategory ? subcategory.catId : null,
      parentCategoryId: subcategory ? subcategory.catId : null,
      categoryName: category ? category.name : null,
    };
  });
};

const createSubCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = firstPresent(
      req.body.catId,
      req.body.categoryId,
      req.body.parentCategoryId,
      req.body.parentCatId,
      req.body.category
    );
    const linkedCategoryId = await requireCategory(categoryId);
    const subcategoryData = {
      name: String(name || "").trim(),
      catId: linkedCategoryId,
    };
    const result = await SubCategory.create(subcategoryData);
    const [linkedSubcategory] = await attachCategoryDetails([result]);
    res.status(201).json({
      status: true,
      message: "Subcategory added.",
      subcategory: linkedSubcategory,
      data: linkedSubcategory,
    });
  } catch (error) {
    res
      .status(error.statusCode || 400)
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
    const linkedSubcategories = await attachCategoryDetails(subcategories);
    res.status(200).json({ status: true, message: "OK", subcategories: linkedSubcategories, data: linkedSubcategories });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subcategories by category ID.",
    });
  }
};

const getSubCategoryById = async (req, res) => {
  const subCategoryId = req.params.id || req.query.id || req.query.subCatId;

  try {
    const subcategory = await SubCategory.findByPk(subCategoryId);

    if (!subcategory) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });
    }

    const [linkedSubcategory] = await attachCategoryDetails([subcategory]);
    res.status(200).json({ status: true, message: "OK", subcategory: linkedSubcategory, data: linkedSubcategory });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subcategory.",
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
  const categoryId = firstPresent(
    req.body.catId,
    req.body.categoryId,
    req.body.parentCategoryId,
    req.body.parentCatId,
    req.body.category
  );
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
      subcategory.catId = await requireCategory(categoryId);
    }

    await subcategory.save();
    const [linkedSubcategory] = await attachCategoryDetails([subcategory]);

    res.status(200).json({ status: true, message: "Subcategory updated.", subcategory: linkedSubcategory, data: linkedSubcategory });
  } catch (error) {
    res
      .status(error.statusCode || 400)
      .json({ status: false, message: "Unable to update subcategory.", error: error.message });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
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

    const linkedSubcategories = await attachCategoryDetails(subcategories);

    res.status(200).json({
      status: true,
      message: "OK",
      subcategories: linkedSubcategories,
      data: linkedSubcategories,
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
    const parentSubCategoryId = firstPresent(
      req.body.subCategoryId,
      req.body.subcategoryId,
      req.body.parentSubCategoryId,
      req.body.parentSubcategoryId,
      req.body.subCatId,
      req.body.parentId
    );
    const linkedSubCategoryId = await requireSubCategory(parentSubCategoryId);
    const subcategoryData = {
      name: String(name || "").trim(),
      subCategoryId: linkedSubCategoryId,
    };
    const result = await SubCategory2.create(subcategoryData);
    const [linkedSubcategory2] = await attachSubCategory2Details([result]);
    res.status(201).json({
      status: true,
      message: "Subcategory2 added.",
      subcategory2: linkedSubcategory2,
      data: linkedSubcategory2,
    });
  } catch (error) {
    res
      .status(error.statusCode || 400)
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
    const linkedSubcategories2 = await attachSubCategory2Details(subcategories2);
    res.status(200).json({ status: true, message: "OK", subcategories2: linkedSubcategories2, data: linkedSubcategories2 });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subcategories by subcategory ID.",
    });
  }
};

const getSubCategory2ById = async (req, res) => {
  const subCategory2Id = req.params.id || req.query.id || req.query.subCatId2;

  try {
    const subcategory2 = await SubCategory2.findByPk(subCategory2Id);

    if (!subcategory2) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory2 not found" });
    }

    const [linkedSubcategory2] = await attachSubCategory2Details([subcategory2]);
    res.status(200).json({ status: true, message: "OK", subcategory2: linkedSubcategory2, data: linkedSubcategory2 });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subcategory2.",
    });
  }
};

const getAllSubCategories2 = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
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

    const linkedSubcategories2 = await attachSubCategory2Details(subcategories2);

    res.status(200).json({
      status: true,
      message: "OK",
      subcategories2: linkedSubcategories2,
      data: linkedSubcategories2,
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
  const parentSubCategoryId = firstPresent(
    req.body.subCategoryId,
    req.body.subcategoryId,
    req.body.parentSubCategoryId,
    req.body.parentSubcategoryId,
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
      subcategory2.subCategoryId = await requireSubCategory(parentSubCategoryId);
    }

    await subcategory2.save();
    const [linkedSubcategory2] = await attachSubCategory2Details([subcategory2]);

    res.status(200).json({ status: true, message: "Subcategory2 updated.", subcategory2: linkedSubcategory2, data: linkedSubcategory2 });
  } catch (error) {
    res
      .status(error.statusCode || 400)
      .json({ status: false, message: "Unable to update subcategory2.", error: error.message });
  }
};


module.exports = {
  createSubCategory,
  getSubCategoryById,
  getSubCategoriesByCategoryId,
  getAllSubCategories,
  deleteSubCategory,
  updateSubCategory,
  createSubCategory2,
  getAllSubCategories2,
  getSubCategory2ById,
  getSubCategoriesByCategoryId2,
  deleteSubCategory2,
  updateSubCategory2,
};

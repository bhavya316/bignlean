const Category = require("../model/category");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const createCategory = async (req, res) => {
  try {
    const imageOn = req.body.imageOn || req.body.image || req.body.web || "";
    const imageOff = req.body.imageOff || req.body.image || req.body.web || imageOn;
    await Category.create({
      ...req.body,
      imageOn,
      imageOff,
    });
    res.status(201).json({ status: true, message: "Category added." });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to create category." });
  }
};

const getAllCategories = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const categories = await Category.findAll({
      where: { brandId: categoryId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", categories });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve categories." });
  }
};

const getCategories = async (req, res) => {
  try {
    // const categories = await Category.findAll({
    //   order: [["createdAt", "DESC"]],
    // });
    const categories = await Category.findAll({
      where: {
        id: {
          [Op.in]: Sequelize.literal(`(
            SELECT MIN(id)
            FROM categories
            GROUP BY name
          )`),
        },
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", categories });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve categories." });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.query.id;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    await category.destroy();
    res.status(200).json({ status: true, message: "Category deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete category." });
  }
};

const updateCategory = async (req, res) => {
  const { name, image, imageOn, imageOff } = req.body;
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    if (name !== undefined) category.name = name;
    const nextImageOn = imageOn || image;
    const nextImageOff = imageOff || image;
    if (nextImageOn !== undefined) category.imageOn = nextImageOn;
    if (nextImageOff !== undefined) category.imageOff = nextImageOff;
    await category.save();

    res.status(200).json({ status: true, message: "Category updated." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update category." });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getCategories,
};

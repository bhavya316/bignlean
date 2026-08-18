const Combo = require("../model/combo");
const Product = require("../model/product");
const ComboCategory = require("../model/comboCat");
const { validationResult } = require("express-validator");

const validateComboRule = async (catId, products) => {
  const category = await ComboCategory.findByPk(catId);
  if (!category) {
    return { status: false, code: 404, message: "Combo category not found" };
  }

  if (category.ruleExactlyTwo && (!Array.isArray(products) || products.length !== 2)) {
    return {
      status: false,
      code: 400,
      message: "This combo category requires exactly 2 products to be selected.",
    };
  }

  return { status: true };
};

const addComboProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const { catId, products } = req.body;

    const comboValidation = await validateComboRule(catId, products);
    if (!comboValidation.status) {
      return res
        .status(comboValidation.code)
        .json({ status: false, message: comboValidation.message });
    }

    let comboProduct = await Combo.findOne({
      where: { catId },
    });
    if (comboProduct) {
      await Combo.update({ products: products }, { where: { catId: catId } });
    } else {
      comboProduct = await Combo.create(req.body);
    }

    res
      .status(201)
      .json({ status: true, message: "Combo product added.", comboProduct });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to add combo product." });
  }
};

const getAllComboProducts = async (req, res) => {
  try {
    if (req.query.catId) {
      return getComboProductsByCatAndSubCat(req, res);
    }

    const comboProducts = await Combo.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", comboProducts });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve combo products." });
  }
};

const updateComboProduct = async (req, res) => {
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
    const comboProduct = await Combo.findByPk(id);
    if (!comboProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Combo product not found" });
    }

    const nextCatId = req.body.catId || comboProduct.catId;
    const nextProducts = req.body.products || comboProduct.products;
    const comboValidation = await validateComboRule(nextCatId, nextProducts);
    if (!comboValidation.status) {
      return res
        .status(comboValidation.code)
        .json({ status: false, message: comboValidation.message });
    }

    const updatedComboProduct = await comboProduct.update(req.body);
    res.status(200).json({
      status: true,
      message: "Combo product updated.",
      comboProduct: updatedComboProduct,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update combo product." });
  }
};

const deleteComboProduct = async (req, res) => {
  const { catId, productId } = req.params;

  try {
    const comboProduct = await Combo.findOne({ where: { catId } });
    if (!comboProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Combo product not found" });
    }

    const products = comboProduct.products;
    const productIndex = products.findIndex(p => p.toString() === productId.toString());

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found in combo" });
    }

    products.splice(productIndex, 1);

    await Combo.update({ products: products }, { where: { catId: catId } });

    res
      .status(200)
      .json({ status: true, message: "Product deleted from combo." });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ status: false, message: "Unable to delete product from combo." });
  }
};

const getComboProductsByCatAndSubCat = async (req, res) => {
  const { catId } = req.query;

  try {
    const comboProducts = await Combo.findAll({
      where: {
        catId,
      },
      order: [["createdAt", "DESC"]],
    });

    var final = [];
    for (const combo of comboProducts) {
      const ids = combo.products;
      for (const id of ids) {
        const product = await Product.findAll({
          where: { id },
        });
        final.push(product[0]);
      }
    }

    const result = final.map((combo) => {
      combo.images = combo.images;
      combo.overView = combo.overView;
      combo.details = combo.details;
      combo.tables = combo.tables;
      combo.information = combo.information;
      combo.certificates = combo.certificates;
      combo.supplements = combo.supplements;
      combo.brand = combo.brand;

      return combo;
    });

    res.status(200).json({
      status: true,
      message: "Combo products retrieved by catId and subCatId.",
      combo: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to retrieve combo products by catId and subCatId.",
    });
  }
};

module.exports = {
  addComboProduct,
  getAllComboProducts,
  updateComboProduct,
  deleteComboProduct,
  getComboProductsByCatAndSubCat,
};

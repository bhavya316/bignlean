const Favorite = require("../model/favorite");
const Rating = require("../model/rating");
const Product = require("../../admin/model/product");
const ComboProduct = require("../../admin/model/comboProduct");
const { validationResult } = require("express-validator");
const User = require("../model/user");

let favoriteTableReady = false;

const ensureFavoriteTable = async () => {
  if (favoriteTableReady) return;
  await Favorite.sync({ alter: true });
  favoriteTableReady = true;
};

const toBoolean = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

const addFavorite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    await ensureFavoriteTable();
    const { user, product, isCombo } = req.body;
    const isComboFavorite = toBoolean(isCombo);
    let productDetails = isComboFavorite
      ? await ComboProduct.findByPk(product)
      : await Product.findByPk(product);

    if (isComboFavorite && !productDetails) {
      productDetails = await Product.findByPk(product);
    }

    if (!productDetails) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    const existingFavorite = await Favorite.findOne({
      where: { user, product, isCombo: isComboFavorite },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ status: false, message: "Favorite already exists" });
    }

    const newFavorite = await Favorite.create({
      user,
      product,
      isCombo: isComboFavorite,
    });
    res.status(201).json({
      status: true,
      message: "Favorite added.",
      favorite: newFavorite,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to add favorite.",
      error: error.message,
    });
  }
};

const getFavoritesByUser = async (req, res) => {
  const { user } = req.params;

  try {
    await ensureFavoriteTable();
    const favorites = await Favorite.findAll({ where: { user } });

    const filteredList = [];
    for (const fav of favorites) {
      let product;
      if (fav.isCombo) {
        product = await ComboProduct.findByPk(fav.product);
        if (!product) {
          product = await Product.findByPk(fav.product);
        }
      } else {
        product = await Product.findByPk(fav.product);
      }
      if (!product) continue;

      const newItem = { ...product.dataValues };
      newItem.isCombo = Boolean(fav.isCombo);

      if (fav.isCombo) {
        const firstVariant =
          Array.isArray(newItem.varients) && newItem.varients.length > 0
            ? newItem.varients[0]
            : {};
        newItem.mrp = Number(newItem.mrp ?? firstVariant.mrp ?? 0);
        newItem.sellingPrice = Number(
          newItem.sellingPrice ??
            newItem.price ??
            firstVariant.sellingPrice ??
            firstVariant.premiumPrice ??
            firstVariant.price ??
            0
        );
        newItem.price = Number(newItem.price ?? newItem.sellingPrice ?? 0);
        newItem.averageRating = 0;
        newItem.totalRating = 0;
        newItem.ratings = [];
        newItem.myRating = [];
        newItem.varients = Array.isArray(newItem.varients) && newItem.varients.length > 0
          ? newItem.varients
          : [{
              id: 0,
              mrp: String(newItem.mrp || 0),
              sellingPrice: String(newItem.sellingPrice || newItem.price || 0),
              premiumPrice: String(newItem.price || newItem.sellingPrice || newItem.mrp || 0),
              price: String(newItem.price || newItem.sellingPrice || 0),
              units: "Combo",
              stock: "999",
              date: newItem.expiry_date || "",
              flavor: ["Combo"],
            }];
        newItem.discountPercentage = newItem.mrp > 0 && newItem.sellingPrice > 0
          ? ((newItem.mrp - newItem.sellingPrice) / newItem.mrp) * 100 : 0;
      } else {
        const ratings = await Rating.findAll({
          where: { product: product.id },
          order: [["createdAt", "DESC"]],
        });
        const totalRating = ratings.reduce(
          (sum, rating) => sum + rating.rate,
          0
        );
        newItem.averageRating =
          ratings.length > 0 ? totalRating / ratings.length : 0;
        newItem.totalRating = totalRating;

        const firstVariant = Array.isArray(product.varients) && product.varients[0] || {};
        newItem.discountPercentage =
          ((parseInt(firstVariant.mrp) -
            parseInt(firstVariant.sellingPrice)) /
            parseInt(firstVariant.mrp)) *
          100 || 0;

        const parsedRatings = await Promise.all(
          ratings.map(async (rating) => {
            const userDetails = await User.findByPk(rating.user);
            rating.user = userDetails;
            return {
              ...rating.dataValues,
              images: rating.images,
            };
          })
        );

        newItem.ratings = parsedRatings;
        newItem.myRating = parsedRatings.filter((r) => r.user?.id == user);
      }

      filteredList.push(newItem);
    }

    res.status(200).json({ status: true, message: "OK", filteredList });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve favorites.",
      error: error.message,
    });
  }
};

const deleteFavorite = async (req, res) => {
  const { user, product } = req.params;

  try {
    await ensureFavoriteTable();
    const hasComboFilter =
      req.query.isCombo !== undefined || req.body?.isCombo !== undefined;
    const where = { user, product };
    if (hasComboFilter) {
      where.isCombo = toBoolean(req.query.isCombo ?? req.body?.isCombo);
    }

    const favorite = await Favorite.findOne({ where });

    if (!favorite) {
      return res
        .status(404)
        .json({ status: false, message: "Favorite not found" });
    }

    await favorite.destroy();
    res.status(200).json({ status: true, message: "Favorite deleted." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to delete favorite.",
      error: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  getFavoritesByUser,
  deleteFavorite,
};

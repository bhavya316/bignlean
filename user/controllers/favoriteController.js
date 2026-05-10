const Favorite = require("../model/favorite");
const Rating = require("../model/rating");
const Product = require("../../admin/model/product");
const { validationResult } = require("express-validator");
const User = require("../model/user");

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
    const { user, product } = req.body;
    const existingFavorite = await Favorite.findOne({
      where: { user, product },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ status: false, message: "Favorite already exists" });
    }

    const newFavorite = await Favorite.create({ user, product });
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
    const favorites = await Favorite.findAll({ where: { user } });

    const filteredList = [];
    for (const fav of favorites) {
      const product = await Product.findByPk(fav.product);
      if (product) {
        const ratings = await Rating.findAll({
          where: { product: product.id },
          order: [["createdAt", "DESC"]],
        });
        const totalRating = ratings.reduce(
          (sum, rating) => sum + rating.rate,
          0
        );
        const averageRating =
          ratings.length > 0 ? totalRating / ratings.length : 0;

        const discountPercentage =
          ((parseInt(product.varients[0].mrp) -
            parseInt(product.varients[0].sellingPrice)) /
            parseInt(product.varients[0].mrp)) *
          100;

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

        const myRating = [];
        for (const rating of parsedRatings) {
          if (rating.user.id == user) {
            myRating.push(rating);
          }
        }

        const newItem = {
          ...product.dataValues,
          averageRating,
          discountPercentage,
          totalRating,
          ratings: parsedRatings,
          myRating,
        };

        filteredList.push(newItem);
      }
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
    const favorite = await Favorite.findOne({ where: { user, product } });

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

const RecentView = require("../model/recentView");
const User = require("../model/user"); // Assuming User model exists
const Product = require("../../admin/model/product");
const Brand = require("../../admin/model/brand");
const Rating = require("../model/rating");
const { validationResult } = require("express-validator");

const parseAmount = (v) => {
  try {
    const n = String(v ?? "").replace(/[^\d.]/g, "");
    return Number(n || 0);
  } catch {
    return 0;
  }
};

const addRecentView = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const recentView = await RecentView.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Recent view added.", recentView });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to add recent view." });
  }
};

const getAllRecentViews = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query parameter

    // Build the where clause based on userId presence
    const whereClause = userId ? { userId: parseInt(userId) } : {};

    // Fetch recent views, filtered by userId if provided, ordered by createdAt DESC
    const recentViews = await RecentView.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      raw: true, // Use raw to get plain objects for easier manipulation
    });

    if (!recentViews.length && userId) {
      return res.status(404).json({
        status: false,
        message: `No recent views found for userId ${userId}`,
      });
    }

    if (!recentViews.length) {
      return res.status(200).json({ status: true, message: "OK", recentViews: [] });
    }

    // Extract user IDs and product IDs
    const userIds = [...new Set(recentViews.map((view) => view.userId))];
    const productIds = [...new Set(recentViews.map((view) => view.productId))];

    // Fetch relevant users
    const users = await User.findAll({
      where: { id: userIds },
      raw: true,
      // attributes: ["id", "name", "email"], // Adjust fields based on your User model
    });

    // Fetch relevant products
    const products = await Product.findAll({
      where: { id: productIds },
      raw: true,
      // attributes: ["id", "name", "price"], // Adjust fields based on your Product model
    });

    // Extract brand IDs from products
    const brandIds = [
      ...new Set(products.map((product) => product.brandId).filter((id) => id)),
    ];

    // Fetch relevant brands
    const brands = await Brand.findAll({
      where: { id: brandIds },
      raw: true,
    });

    // Fetch ratings for these products
    const ratings = await Rating.findAll({
      where: { product: productIds },
      raw: true,
    });

    // Map users, products, brands, ratings to lookup objects/maps
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const brandMap = brands.reduce((acc, brand) => {
      acc[brand.id] = brand;
      return acc;
    }, {});

    // Group ratings by productId
    const ratingsMap = ratings.reduce((acc, rating) => {
      if (!acc[rating.product]) {
        acc[rating.product] = [];
      }
      acc[rating.product].push(rating);
      return acc;
    }, {});

    const productMap = products.reduce((acc, product) => {
      // Enrich product
      const productRatings = ratingsMap[product.id] || [];
      const brand = brandMap[product.brandId];

      const totalRating = productRatings.reduce(
        (sum, rating) => sum + rating.rate,
        0
      );
      const averageRating =
        productRatings.length > 0 ? totalRating / productRatings.length : 0;

      const tasteRate = productRatings.reduce(
        (sum, rating) => sum + rating.tasteRate,
        0
      );
      const averageTasteRate =
        productRatings.length > 0 ? tasteRate / productRatings.length : 0;

      const mixabilityRate = productRatings.reduce(
        (sum, rating) => sum + rating.mixabilityRate,
        0
      );
      const averageMixabilityRate =
        productRatings.length > 0 ? mixabilityRate / productRatings.length : 0;

      const efficacyRate = productRatings.reduce(
        (sum, rating) => sum + rating.efficacyRate,
        0
      );
      const averageEfficacyRate =
        productRatings.length > 0 ? efficacyRate / productRatings.length : 0;

      const valueForMoneyRate = productRatings.reduce(
        (sum, rating) => sum + rating.valueForMoneyRate,
        0
      );
      const averageValueForMoneyRate =
        productRatings.length > 0
          ? valueForMoneyRate / productRatings.length
          : 0;

      const mrp = parseAmount(product.varients?.[0]?.mrp);
      const sp = parseAmount(product.varients?.[0]?.sellingPrice);
      const discountPercentage = mrp > 0 ? ((mrp - sp) / mrp) * 100 : 0;

      const enrichedProduct = {
        ...product,
        brandName: brand ? brand.name : null,
        averageRating,
        averageTasteRate,
        averageMixabilityRate,
        averageEfficacyRate,
        averageValueForMoneyRate,
        totalRating: productRatings.length,
        discountPercentage,
      };

      acc[product.id] = enrichedProduct;
      return acc;
    }, {});

    // Enrich recentViews with user and product details
    const enrichedRecentViews = recentViews.map((view) => ({
      ...view,
      user: userMap[view.userId] || {
        id: view.userId,
        name: "Unknown",
        email: "N/A",
      }, // Fallback if user not found
      product: productMap[view.productId] || {
        id: view.productId,
        name: "Unknown",
        price: "N/A",
      }, // Fallback if product not found
    }));

    res
      .status(200)
      .json({ status: true, message: "OK", recentViews: enrichedRecentViews });
  } catch (error) {
    console.error(error); // Log error for debugging
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve recent views." });
  }
};

const updateRecentView = async (req, res) => {
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
    const recentView = await RecentView.findByPk(id);
    if (!recentView) {
      return res
        .status(404)
        .json({ status: false, message: "Recent view not found" });
    }

    const updatedRecentView = await recentView.update(req.body);
    res.status(200).json({
      status: true,
      message: "Recent view updated.",
      recentView: updatedRecentView,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update recent view." });
  }
};

const deleteRecentView = async (req, res) => {
  const { id } = req.params;

  try {
    const recentView = await RecentView.findByPk(id);
    if (!recentView) {
      return res
        .status(404)
        .json({ status: false, message: "Recent view not found" });
    }

    await recentView.destroy();
    res.status(200).json({ status: true, message: "Recent view deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete recent view." });
  }
};

module.exports = {
  addRecentView,
  getAllRecentViews,
  updateRecentView,
  deleteRecentView,
};
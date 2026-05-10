const Product = require("../model/product");
const Rating = require("../../user/model/rating");
const User = require("../../user/model/user");
const RecentSearches = require("../../user/controllers/recentSerches");
const { validationResult } = require("express-validator");
const Brand = require("../model/brand");
const Category = require("../model/category");
const Order = require("../../user/model/order")
const { Op } = require("sequelize");

const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ status: true, message: "Product added.", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to add product.",
    });
  }
};

// const getProductsByCategoryAndSubCategory = async (req, res) => {
//   const { catId, subCatId } = req.query;

//   try {
//     const products = await Product.findAll({
//       where: {
//         catId: catId,
//         subCatId: subCatId,
//       },
//       order: [["createdAt", "DESC"]],
//     });
//     const decoded = products.map((product) => {
//       product.images = product.images;
//       product.overView = product.overView;
//       product.details = product.details;
//       product.tables = product.tables;
//       product.information = product.information;
//       product.certificates = product.certificates;
//       product.supplements = product.supplements;
//       product.brand = product.brand;
//       return product;
//     });
//     res.status(200).json({ status: true, message: "OK", products: decoded });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .json({ status: false, message: "Unable to retrieve products." });
//   }
// };


const getProductsByCategoryAndSubCategory = async (req, res) => {
  const { catId, subCatId, subCatId2, brandId } = req.query; // Added brandId

  try {
    // Build the where clause dynamically
    const where = {
      catId: catId,
      subCatId: subCatId,
      brandId: brandId,
    };
    if (subCatId2) {
      where.subCatId2 = subCatId2; // Only include subCatId2 if provided
    }

    const products = await Product.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    const decoded = products.map((product) => {
      product.images = product.images;
      product.overView = product.overView;
      product.details = product.details;
      product.tables = product.tables;
      product.information = product.information;
      product.certificates = product.certificates;
      product.supplements = product.supplements;
      product.brand = product.brand;
      return product;
    });
    res.status(200).json({ status: true, message: "OK", products: decoded });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve products." });
  }
};

// Add this function to productController.js
const getProductsByCategory = async (req, res) => {
  const { catId } = req.query;

  try {
    const products = await Product.findAll({
      where: {
        catId: catId,
      },
      order: [["createdAt", "DESC"]],
    });
    
    const decoded = products.map((product) => {
      product.images = product.images;
      product.overView = product.overView;
      product.details = product.details;
      product.tables = product.tables;
      product.information = product.information;
      product.certificates = product.certificates;
      product.supplements = product.supplements;
      product.brand = product.brand;
      return product;
    });
    
    res.status(200).json({ status: true, message: "OK", products: decoded });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve products." });
  }
};

const getProductbyId = async (req, res) => {
  const { id, user } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    const productDetails = product.dataValues;
    const result = {
      ...productDetails,
      images: productDetails.images,
      overView: productDetails.overView,
      details: productDetails.details,
      tables: productDetails.tables,
      information: productDetails.information,
      certificates: productDetails.certificates,
      supplements: productDetails.supplements,
      brand: productDetails.brand,
    };
    const ratings = await Rating.findAll({
      where: { product: result.id },
      order: [["createdAt", "DESC"]],
    });

    const discountPercentage =
      ((productDetails.price - productDetails.sellingPrice) /
        productDetails.price) *
      100;

    //Rate
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    //tasteRate
    const tasteRate = ratings.reduce(
      (sum, rating) => sum + rating.tasteRate,
      0
    );
    const averageTasteRate =
      ratings.length > 0 ? tasteRate / ratings.length : 0;

    //mixabilityRate
    const mixabilityRate = ratings.reduce(
      (sum, rating) => sum + rating.mixabilityRate,
      0
    );
    const averageMixabilityRate =
      ratings.length > 0 ? mixabilityRate / ratings.length : 0;

    //efficacyRate
    const efficacyRate = ratings.reduce(
      (sum, rating) => sum + rating.efficacyRate,
      0
    );
    const averageEfficacyRate =
      ratings.length > 0 ? efficacyRate / ratings.length : 0;

    //valueForMoneyRate
    const valueForMoneyRate = ratings.reduce(
      (sum, rating) => sum + rating.valueForMoneyRate,
      0
    );
    const averageValueForMoneyRate =
      ratings.length > 0 ? valueForMoneyRate / ratings.length : 0;

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
    result.ratings = parsedRatings;
    const myRating = [];
    for (const rating of parsedRatings) {
      if (rating.user.id == user) {
        myRating.push(rating);
      }
    }
    result.userRating = myRating;
    result.averageRating = averageRating;
    result.averageTasteRate = averageTasteRate;
    result.averageMixabilityRate = averageMixabilityRate;
    result.averageEfficacyRate = averageEfficacyRate;
    result.averageValueForMoneyRate = averageValueForMoneyRate;
    result.discountPercentage = discountPercentage;
    result.totalRating = ratings.length;

    const similerProduct = [];
    const products = await Product.findAll({
      where: { catId: result.catId },
      order: [["createdAt", "DESC"]],
    });
    for (const item of products) {
      const ratings = await Rating.findAll({
        where: { product: item.id },
        order: [["createdAt", "DESC"]],
      });
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating =
        ratings.length > 0 ? totalRating / ratings.length : 0;
      const discountPercentage =
        ((item.dataValues.price - item.dataValues.sellingPrice) /
          item.dataValues.price) *
        100;
      const newItem = { ...item.dataValues, averageRating, discountPercentage };
      similerProduct.push(newItem);
    }

    res.status(200).json({
      status: true,
      message: "OK",
      result,
      similerProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Unable to get product." });
  }
};

const updateProduct = async (req, res) => {
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
    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    const updatedProduct = await product.update(req.body);
    res.status(200).json({
      status: true,
      message: "Product updated.",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update product." });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ status: true, message: "Product deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete product." });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      brands = [],
      priceRanges = [],
      discountPercent = 0,
      category = 0,
      minRating = 0,
      isBestSeller,
      id,
      query = "nothing",
      sorting = "nothing",
      user: userId = 0,
    } = req.query;

    if (id && query != "nothing") {
      await RecentSearches.addToRecentSearch(id, query);
    }

    let brandDetails = {};

    if (brands.length === 1) {
      brandDetails = await Brand.findByPk(brands[0]);
    }

    let brandsList = [];
    for (const brand of brands) {
      const categories = await Category.findAll({ where: { brandId: brand } });

      for (const cat of categories) {
        brandsList.push(cat.id);
      }
    }

    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });

    const filteredList = await Promise.all(
      products.map(async (product) => {
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

        let brandMatch = false;

        if (brandsList.length > 0) {
          for (const brand of brandsList) {
            console.log(brand, product.catId);

            if (brand === product.catId) {
              brandMatch = true;
              break;
            }
          }
        } else {
          brandMatch = true;
        }

        const priceMatch = checkPriceRanges(
          parseInt(product.varients[0].mrp),
          priceRanges
        );

        const catMatch = category === 0 || product.catId === category;
        const ratingMatch = minRating === 0 || averageRating >= minRating;
        const discountMatch = checkDiscountPercent(
          parseInt(product.varients[0].mrp),
          parseInt(product.varients[0].sellingPrice),
          discountPercent
        );
        const isBestSellerMatch =
          isBestSeller === undefined
            ? true
            : product.isBestSeller === (isBestSeller === "true");
        const queryMatched =
          query === "nothing" || (product.name && product.name.includes(query));

        const parsedRatings = await Promise.all(
          ratings.map(async (rating) => {
            const userDetails = await User.findByPk(rating.user);
            return {
              ...rating.dataValues,
              user: userDetails,
              images: rating.images,
            };
          })
        );

        const myRating = parsedRatings.filter(
          (rating) => rating.user.id == userId
        );
        if (
          brandMatch &&
          catMatch &&
          priceMatch &&
          discountMatch &&
          ratingMatch &&
          isBestSellerMatch &&
          queryMatched
        ) {
          return {
            ...product.dataValues,
            averageRating,
            discountPercentage,
            totalRating,
            ratings: parsedRatings,
            myRating,
          };
        }

        return null;
      })
    );

    const validProducts = filteredList.filter((product) => product !== null);

    let sortedList;
    switch (sorting) {
      case "P-lth":
        sortedList = validProducts.sort(
          (a, b) =>
            parseInt(a.varients[0].sellingPrice) -
            parseInt(b.varients[0].sellingPrice)
        );
        break;
      case "P-htl":
        sortedList = validProducts.sort(
          (a, b) =>
            parseInt(b.varients[0].sellingPrice) -
            parseInt(a.varients[0].sellingPrice)
        );
        break;
      case "D-lth":
        sortedList = validProducts.sort(
          (a, b) => a.discountPercentage - b.discountPercentage
        );
        break;
      case "D-htl":
        sortedList = validProducts.sort(
          (a, b) => b.discountPercentage - a.discountPercentage
        );
        break;
      case "Rating":
        sortedList = validProducts.sort(
          (a, b) => b.averageRating - a.averageRating
        );
        break;
      default:
        sortedList = validProducts;
    }

    res.status(200).json({
      status: true,
      message: "OK",
      products: sortedList,
      brandDetails,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to fetch product." });
  }
};

const getTrending = async (req, res) => {
  try {
    const trendingSearches = await Product.findAll({
      where: { isBestSeller: true },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ status: true, message: "OK", trendingSearches });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

const updateStock = async (req, res) => {
  const { id, qty } = req.query;

  try {
    if (!id || !qty) {
      return res
        .status(400)
        .json({ status: false, message: "id and qty is Required" });
    }
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "product not found",
      });
    }

    product.stock = product.stock + qty;
    await product.save();
    res.status(200).json({ status: true, message: "Stock Updated" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

const toggleBestSeller = async (req, res) => {
  const { id, value } = req.query;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "id and qty is Required" });
    }
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "product not found",
      });
    }
    isBestSeller.stock = value ?? false;
    res.status(200).json({ status: true, message: "Status Updated" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

const checkPriceRanges = (price, ranges) => {
  if (!ranges || !Array.isArray(ranges) || ranges.length === 0) {
    return true;
  }

  return ranges.some((range) => {
    const [min, max] = range
      .split("-")
      .map((value) =>
        value.trim().toLowerCase() === "above" ? Infinity : Number(value)
      );
    return price >= min && price <= max;
  });
};

const checkDiscountPercent = (originalPrice, sellingPrice, discountPercent) => {
  if (originalPrice <= 0 || sellingPrice <= 0 || discountPercent < 0) {
    return false;
  }

  const calculatedDiscount =
    ((originalPrice - sellingPrice) / originalPrice) * 100;

  return calculatedDiscount >= discountPercent;
};

const getRelatedProducts = async (req, res) => {
  const { productId } = req.query;

  try {
    // Find the product to get its category/subcategory
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ 
        status: false, 
        message: "Product not found" 
      });
    }

    // Find products with the same category but different ID
    const relatedProducts = await Product.findAll({
      where: {
        catId: product.catId,
        id: { [Op.ne]: productId } // Not equal to current product
      },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    const decoded = await Promise.all(relatedProducts.map(async (product) => {
      // Get ratings for each product
      const ratings = await Rating.findAll({
        where: { product: product.id }
      });
      
      // Calculate average rating
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
      
      // Calculate discount percentage
      const discountPercentage = 
        ((product.price - product.sellingPrice) / product.price) * 100;
      
      return {
        ...product.dataValues,
        images: product.images,
        averageRating,
        discountPercentage,
        totalRatings: ratings.length
      };
    }));
    
    res.status(200).json({ 
      status: true, 
      message: "OK", 
      relatedProducts: decoded 
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      status: false, 
      message: "Unable to retrieve related products." 
    });
  }
};

// Function to get out of stock products
const getOutOfStockProducts = async (req, res) => {
  try {
    // Find all products with stock = 0
    const outOfStockProducts = await Product.findAll({
      where: {
        stock: 0
      },
      order: [["updatedAt", "DESC"]],
    });
    
    const decoded = outOfStockProducts.map((product) => {
      return {
        ...product.dataValues,
        images: product.images,
        overView: product.overView,
        details: product.details,
        tables: product.tables,
        information: product.information,
        certificates: product.certificates,
        supplements: product.supplements,
        brand: product.brand
      };
    });
    
    res.status(200).json({ 
      status: true, 
      message: "OK", 
      products: decoded 
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      status: false, 
      message: "Unable to retrieve out of stock products." 
    });
  }
};


const getBestSellerProducts = async (req, res) => {
  try {
    const { user: userId = 0, limit = 10 } = req.query;
    console.log(`[DEBUG] Query params: user=${userId}, limit=${limit}`);

    // Step 1: Fetch all orders and extract product IDs from JSON product field
    const orders = await Order.findAll({
      attributes: ["id", "product"],
      raw: true,
    });
    console.log(`[DEBUG] Found ${orders.length} orders`);

    // Count occurrences of each product ID
    const productCountMap = {};
    let totalProductsProcessed = 0;
    orders.forEach((order) => {
      try {
        let productIds;
        if (typeof order.product === "string") {
          productIds = JSON.parse(order.product); // Parse stringified JSON
        } else if (Array.isArray(order.product)) {
          productIds = order.product; // Already an array
        } else {
          console.warn(`[DEBUG] Invalid product format in order ID ${order.id}:`, order.product);
          return;
        }
        if (Array.isArray(productIds)) {
          productIds.forEach((id) => {
            if (typeof id === "number" || !isNaN(parseInt(id))) {
              const productId = parseInt(id);
              productCountMap[productId] = (productCountMap[productId] || 0) + 1;
              totalProductsProcessed++;
            } else {
              console.warn(`[DEBUG] Invalid product ID in order ID ${order.id}:`, id);
            }
          });
        } else {
          console.warn(`[DEBUG] Product is not an array in order ID ${order.id}:`, productIds);
        }
      } catch (error) {
        console.error(`[DEBUG] Error parsing product JSON for order ID ${order.id}:`, error.message);
      }
    });
    console.log(`[DEBUG] Processed ${totalProductsProcessed} product IDs from orders`);
    console.log(`[DEBUG] Product count map:`, productCountMap);

    // Convert to array and sort by count (descending)
    const productCounts = Object.entries(productCountMap)
      .map(([productId, orderCount]) => ({
        productId: parseInt(productId),
        orderCount,
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, parseInt(limit));
    console.log(`[DEBUG] Top ${limit} product counts:`, productCounts);

    if (!productCounts.length) {
      console.log(`[DEBUG] No product IDs found in orders`);
      return res.status(200).json({
        status: true,
        message: "OK",
        products: [],
      });
    }

    // Step 2: Extract product IDs
    const productIds = productCounts.map((entry) => entry.productId);
    console.log(`[DEBUG] Product IDs to fetch:`, productIds);

    // Step 3: Fetch product details for the top products
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
      raw: true,
    });
    console.log(`[DEBUG] Found ${products.length} products`);

    // Step 4: Map products to include order count and enrich with ratings
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const orderCountEntry = productCounts.find(
          (entry) => entry.productId === product.id
        );
        const orderCount = orderCountEntry ? orderCountEntry.orderCount : 0;

        // Fetch ratings for the product
        const ratings = await Rating.findAll({
          where: { product: product.id },
          order: [["createdAt", "DESC"]],
          raw: true,
        });

        // Calculate average ratings
        const totalRating = ratings.reduce((sum, rating) => sum + (rating.rate || 0), 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

        const tasteRate = ratings.reduce((sum, rating) => sum + (rating.tasteRate || 0), 0);
        const averageTasteRate = ratings.length > 0 ? tasteRate / ratings.length : 0;

        const mixabilityRate = ratings.reduce((sum, rating) => sum + (rating.mixabilityRate || 0), 0);
        const averageMixabilityRate = ratings.length > 0 ? mixabilityRate / ratings.length : 0;

        const efficacyRate = ratings.reduce((sum, rating) => sum + (rating.efficacyRate || 0), 0);
        const averageEfficacyRate = ratings.length > 0 ? efficacyRate / ratings.length : 0;

        const valueForMoneyRate = ratings.reduce((sum, rating) => sum + (rating.valueForMoneyRate || 0), 0);
        const averageValueForMoneyRate = ratings.length > 0 ? valueForMoneyRate / ratings.length : 0;

        // Calculate discount percentage
        const discountPercentage =
          ((parseInt(product.varients[0].mrp) -
            parseInt(product.varients[0].sellingPrice)) /
            parseInt(product.varients[0].mrp)) *
          100;

        // Fetch user details for ratings
        const parsedRatings = await Promise.all(
          ratings.map(async (rating) => {
            const userDetails = await User.findByPk(rating.user, { raw: true });
            return {
              ...rating,
              user: userDetails || { id: rating.user, name: "Unknown", email: "N/A" },
              images: rating.images || [],
            };
          })
        );

        // Filter ratings for the current user (if userId provided)
        const myRating = parsedRatings.filter(
          (rating) => rating.user && rating.user.id == userId
        );

        return {
          ...product,
          images: product.images,
          overView: product.overView,
          details: product.details,
          tables: product.tables,
          information: product.information,
          certificates: product.certificates,
          supplements: product.supplements,
          brand: product.brand,
          orderCount,
          averageRating,
          averageTasteRate,
          averageMixabilityRate,
          averageEfficacyRate,
          averageValueForMoneyRate,
          discountPercentage,
          totalRating: ratings.length,
          ratings: parsedRatings,
          myRating,
        };
      })
    );

    // Step 5: Sort by orderCount
    const sortedProducts = enrichedProducts.sort(
      (a, b) => b.orderCount - a.orderCount
    );
    console.log(`[DEBUG] Final enriched products:`, sortedProducts.length);

    res.status(200).json({
      status: true,
      message: "OK",
      products: sortedProducts,
    });
  } catch (error) {
    console.error(`[DEBUG] Error in getBestSellerProducts:`, error);
    res
      .status(400)
      .json({ status: false, message: "Unable to fetch best seller products." });
  }
};

const getBestSellingProductsToday = async (req, res) => {
  try {
    const { user: userId = 0 } = req.query;
    console.log(`[DEBUG] Query params: user=${userId}`);

    // Get today's date range (start and end of today)
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    console.log(`[DEBUG] Today's date range: ${startOfDay} to ${endOfDay}`);

    // Step 1: Fetch orders from today only
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay
        }
      },
      attributes: ["id", "product"],
      raw: true,
    });
    console.log(`[DEBUG] Found ${orders.length} orders from today`);

    // Count occurrences of each product ID from today's orders
    const productCountMap = {};
    let totalProductsProcessed = 0;
    orders.forEach((order) => {
      try {
        let productIds;
        if (typeof order.product === "string") {
          productIds = JSON.parse(order.product); // Parse stringified JSON
        } else if (Array.isArray(order.product)) {
          productIds = order.product; // Already an array
        } else {
          console.warn(`[DEBUG] Invalid product format in order ID ${order.id}:`, order.product);
          return;
        }
        if (Array.isArray(productIds)) {
          productIds.forEach((id) => {
            if (typeof id === "number" || !isNaN(parseInt(id))) {
              const productId = parseInt(id);
              productCountMap[productId] = (productCountMap[productId] || 0) + 1;
              totalProductsProcessed++;
            } else {
              console.warn(`[DEBUG] Invalid product ID in order ID ${order.id}:`, id);
            }
          });
        } else {
          console.warn(`[DEBUG] Product is not an array in order ID ${order.id}:`, productIds);
        }
      } catch (error) {
        console.error(`[DEBUG] Error parsing product JSON for order ID ${order.id}:`, error.message);
      }
    });
    console.log(`[DEBUG] Processed ${totalProductsProcessed} product IDs from today's orders`);
    console.log(`[DEBUG] Product count map:`, productCountMap);

    // Convert to array and sort by count (descending) - limit to top 4 products
    const productCounts = Object.entries(productCountMap)
      .map(([productId, orderCount]) => ({
        productId: parseInt(productId),
        orderCount,
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 4); // Limit to top 4 products
    console.log(`[DEBUG] Top 4 product counts for today:`, productCounts);

    if (!productCounts.length) {
      console.log(`[DEBUG] No product IDs found in today's orders`);
      return res.status(200).json({
        status: true,
        message: "OK",
        products: [],
      });
    }

    // Step 2: Extract product IDs
    const productIds = productCounts.map((entry) => entry.productId);
    console.log(`[DEBUG] Product IDs to fetch:`, productIds);

    // Step 3: Fetch product details for the top products
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
      raw: true,
    });
    console.log(`[DEBUG] Found ${products.length} products`);

    // Step 4: Process each product with full details like getProductbyId
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const orderCountEntry = productCounts.find(
          (entry) => entry.productId === product.id
        );
        const orderCount = orderCountEntry ? orderCountEntry.orderCount : 0;

        // Get product details like in getProductbyId
        const productDetails = product.dataValues || product;
        const result = {
          ...productDetails,
          images: productDetails.images,
          overView: productDetails.overView,
          details: productDetails.details,
          tables: productDetails.tables,
          information: productDetails.information,
          certificates: productDetails.certificates,
          supplements: productDetails.supplements,
          brand: productDetails.brand,
        };

        // Fetch ratings for the product
        const ratings = await Rating.findAll({
          where: { product: result.id },
          order: [["createdAt", "DESC"]],
        });

        const discountPercentage =
          ((parseInt(result.varients[0]?.mrp || 0) - parseInt(result.varients[0]?.sellingPrice || 0)) /
            parseInt(result.varients[0]?.mrp || 1)) *
          100;

        //Rate
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

        //tasteRate
        const tasteRate = ratings.reduce(
          (sum, rating) => sum + rating.tasteRate,
          0
        );
        const averageTasteRate =
          ratings.length > 0 ? tasteRate / ratings.length : 0;

        //mixabilityRate
        const mixabilityRate = ratings.reduce(
          (sum, rating) => sum + rating.mixabilityRate,
          0
        );
        const averageMixabilityRate =
          ratings.length > 0 ? mixabilityRate / ratings.length : 0;

        //efficacyRate
        const efficacyRate = ratings.reduce(
          (sum, rating) => sum + rating.efficacyRate,
          0
        );
        const averageEfficacyRate =
          ratings.length > 0 ? efficacyRate / ratings.length : 0;

        //valueForMoneyRate
        const valueForMoneyRate = ratings.reduce(
          (sum, rating) => sum + rating.valueForMoneyRate,
          0
        );
        const averageValueForMoneyRate =
          ratings.length > 0 ? valueForMoneyRate / ratings.length : 0;

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
        result.ratings = parsedRatings;
        const myRating = [];
        for (const rating of parsedRatings) {
          if (rating.user.id == userId) {
            myRating.push(rating);
          }
        }
        result.userRating = myRating;
        result.averageRating = averageRating;
        result.averageTasteRate = averageTasteRate;
        result.averageMixabilityRate = averageMixabilityRate;
        result.averageEfficacyRate = averageEfficacyRate;
        result.averageValueForMoneyRate = averageValueForMoneyRate;
        result.discountPercentage = discountPercentage;
        result.totalRating = ratings.length;

        // Add order count for today
        result.orderCount = orderCount;

        return result;
      })
    );

    // Step 5: Sort by orderCount (most sold today first)
    const sortedProducts = enrichedProducts.sort(
      (a, b) => b.orderCount - a.orderCount
    );
    console.log(`[DEBUG] Final enriched products for today:`, sortedProducts.length);

    res.status(200).json({
      status: true,
      message: "OK",
      products: sortedProducts,
    });
  } catch (error) {
    console.error(`[DEBUG] Error in getBestSellingProductsToday:`, error);
    res
      .status(400)
      .json({ status: false, message: "Unable to fetch best selling products for today." });
  }
};

const getBestSellingProductTodayById = async (req, res) => {
  const { id, user } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }
  try {
    // Get today's date range (start and end of today)
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    console.log(`[DEBUG] Today's date range: ${startOfDay} to ${endOfDay}`);

    // Step 1: Fetch orders from today only
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay
        }
      },
      attributes: ["id", "product"],
      raw: true,
    });
    console.log(`[DEBUG] Found ${orders.length} orders from today`);

    // Count occurrences of the specific product ID from today's orders
    let orderCount = 0;
    orders.forEach((order) => {
      try {
        let productIds;
        if (typeof order.product === "string") {
          productIds = JSON.parse(order.product); // Parse stringified JSON
        } else if (Array.isArray(order.product)) {
          productIds = order.product; // Already an array
        } else {
          console.warn(`[DEBUG] Invalid product format in order ID ${order.id}:`, order.product);
          return;
        }
        if (Array.isArray(productIds)) {
          productIds.forEach((productId) => {
            if (typeof productId === "number" || !isNaN(parseInt(productId))) {
              const parsedId = parseInt(productId);
              if (parsedId === parseInt(id)) {
                orderCount++;
              }
            } else {
              console.warn(`[DEBUG] Invalid product ID in order ID ${order.id}:`, productId);
            }
          });
        } else {
          console.warn(`[DEBUG] Product is not an array in order ID ${order.id}:`, productIds);
        }
      } catch (error) {
        console.error(`[DEBUG] Error parsing product JSON for order ID ${order.id}:`, error.message);
      }
    });
    console.log(`[DEBUG] Product ${id} was sold ${orderCount} times today`);

    // Get product details like in getProductbyId
    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    const productDetails = product.dataValues;
    const result = {
      ...productDetails,
      images: productDetails.images,
      overView: productDetails.overView,
      details: productDetails.details,
      tables: productDetails.tables,
      information: productDetails.information,
      certificates: productDetails.certificates,
      supplements: productDetails.supplements,
      brand: productDetails.brand,
    };
    const ratings = await Rating.findAll({
      where: { product: result.id },
      order: [["createdAt", "DESC"]],
    });

    const discountPercentage =
      ((parseInt(result.varients[0]?.mrp || 0) - parseInt(result.varients[0]?.sellingPrice || 0)) /
        parseInt(result.varients[0]?.mrp || 1)) *
      100;

    //Rate
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    //tasteRate
    const tasteRate = ratings.reduce(
      (sum, rating) => sum + rating.tasteRate,
      0
    );
    const averageTasteRate =
      ratings.length > 0 ? tasteRate / ratings.length : 0;

    //mixabilityRate
    const mixabilityRate = ratings.reduce(
      (sum, rating) => sum + rating.mixabilityRate,
      0
    );
    const averageMixabilityRate =
      ratings.length > 0 ? mixabilityRate / ratings.length : 0;

    //efficacyRate
    const efficacyRate = ratings.reduce(
      (sum, rating) => sum + rating.efficacyRate,
      0
    );
    const averageEfficacyRate =
      ratings.length > 0 ? efficacyRate / ratings.length : 0;

    //valueForMoneyRate
    const valueForMoneyRate = ratings.reduce(
      (sum, rating) => sum + rating.valueForMoneyRate,
      0
    );
    const averageValueForMoneyRate =
      ratings.length > 0 ? valueForMoneyRate / ratings.length : 0;

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
    result.ratings = parsedRatings;
    const myRating = [];
    for (const rating of parsedRatings) {
      if (rating.user.id == user) {
        myRating.push(rating);
      }
    }
    result.userRating = myRating;
    result.averageRating = averageRating;
    result.averageTasteRate = averageTasteRate;
    result.averageMixabilityRate = averageMixabilityRate;
    result.averageEfficacyRate = averageEfficacyRate;
    result.averageValueForMoneyRate = averageValueForMoneyRate;
    result.discountPercentage = discountPercentage;
    result.totalRating = ratings.length;

    // Add today's order count
    result.todayOrderCount = orderCount;

    const similerProduct = [];
    const products = await Product.findAll({
      where: { catId: result.catId },
      order: [["createdAt", "DESC"]],
    });
    for (const item of products) {
      const ratings = await Rating.findAll({
        where: { product: item.id },
        order: [["createdAt", "DESC"]],
      });
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating =
        ratings.length > 0 ? totalRating / ratings.length : 0;
      const discountPercentage =
        ((parseInt(item.dataValues.varients[0]?.mrp || 0) - parseInt(item.dataValues.varients[0]?.sellingPrice || 0)) /
          parseInt(item.dataValues.varients[0]?.mrp || 1)) *
        100;
      const newItem = { ...item.dataValues, averageRating, discountPercentage };
      similerProduct.push(newItem);
    }

    res.status(200).json({
      status: true,
      message: "OK",
      result,
      todayOrderCount: orderCount,
      similerProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Unable to get best selling product today." });
  }
};

// New function for paginated products with optional filters
const getAllProductsPaginated = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      brandId,
      catId,
      subCatId,
      subCatId2,
      search,
    } = req.query;

    // Build dynamic where clause based on filters
    const where = {};
    if (brandId) where.brandId = brandId;
    if (catId) where.catId = catId;
    if (subCatId) where.subCatId = subCatId;
    if (subCatId2) where.subCatId2 = subCatId2;
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Fetch products with count for pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    // Enrich products with ratings and other calculated fields
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const ratings = await Rating.findAll({
          where: { product: product.id },
          order: [["createdAt", "DESC"]],
        });

        // Calculate average rating
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

        // Calculate discount percentage
        const discountPercentage =
          product.varients && product.varients[0]
            ? ((parseInt(product.varients[0].mrp || 0) -
              parseInt(product.varients[0].sellingPrice || 0)) /
              parseInt(product.varients[0].mrp || 1)) *
            100
            : 0;

        return {
          ...product.dataValues,
          averageRating,
          discountPercentage,
          totalRatings: ratings.length,
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / parseInt(limit));
    const currentPage = parseInt(page);

    res.status(200).json({
      status: true,
      message: "OK",
      data: {
        products: enrichedProducts,
        pagination: {
          total: count,
          currentPage: currentPage,
          totalPages: totalPages,
          limit: parseInt(limit),
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to fetch products.",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProductsByCategoryAndSubCategory,
  getProductsByCategory,
  getProductbyId,
  updateProduct,
  deleteProduct,
  getAllProductsPaginated,
  getAllProducts,
  updateStock,
  toggleBestSeller,
  getTrending,
  getRelatedProducts,     // Add this line
  getOutOfStockProducts,   // Add this line
  getBestSellerProducts,
  getBestSellingProductsToday,
  getBestSellingProductTodayById
};
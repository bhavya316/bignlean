const Product = require("../model/product");
const Rating = require("../../user/model/rating");
const User = require("../../user/model/user");
const RecentSearches = require("../../user/controllers/recentSerches");
const { validationResult } = require("express-validator");
const Brand = require("../model/brand");
const Category = require("../model/category");
const SubCategory = require("../model/subCategory");
const SubCategory2 = require("../model/subCategory2");
const Order = require("../../user/model/order")
const { Op } = require("sequelize");

const parseAmount = (v) => {
  try {
    const n = String(v ?? "").replace(/[^\d.]/g, "");
    return Number(n || 0);
  } catch {
    return 0;
  }
};

const parseBooleanFilter = (value) => {
  if (Array.isArray(value)) value = value[0];
  if (value === undefined || value === null || value === "") return undefined;
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;

  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return undefined;
};

const getFlavorLabel = (flavor) => {
  if (typeof flavor === "string") return flavor;
  return flavor?.name || flavor?.flavor || flavor?.label || "";
};

const getVariantFlavorOptions = (variant) => {
  if (Array.isArray(variant?.flavors)) return variant.flavors;
  if (Array.isArray(variant?.flavour)) return variant.flavour;
  if (Array.isArray(variant?.flavor)) return variant.flavor;
  return [];
};

const getBrandOriginCountry = (brand) =>
  brand?.originCountry || brand?.countryOfOrigin || null;

const getBrandOriginCode = (brand) => brand?.originCountryCode || null;

const applyBrandOriginToProductData = (productData, brandInfo) => {
  const originCountry = getBrandOriginCountry(brandInfo);
  const originCountryCode = getBrandOriginCode(brandInfo);

  return {
    ...productData,
    varients: normalizeVariants(productData?.varients) || productData?.varients,
    countryOfOrigin: originCountry || productData?.countryOfOrigin,
    brandOriginCountry: originCountry,
    brandOriginCountryCode: originCountryCode,
  };
};

const getProductExpiryDate = (productData) => {
  const variants = Array.isArray(productData?.varients) ? productData.varients : [];
  const variantWithDate = variants.find((variant) => variant?.date || variant?.expiryDate);
  return variantWithDate?.date || variantWithDate?.expiryDate || productData?.expiryDate || null;
};

const applyHierarchyToProductData = async (productData) => {
  const [category, subcategory, subcategory2] = await Promise.all([
    productData?.catId ? Category.findByPk(productData.catId) : null,
    productData?.subCatId ? SubCategory.findByPk(productData.subCatId) : null,
    productData?.subCatId2 ? SubCategory2.findByPk(productData.subCatId2) : null,
  ]);

  return {
    ...productData,
    category: category ? category.toJSON() : null,
    categoryName: category ? category.name : null,
    subcategory: subcategory ? subcategory.toJSON() : null,
    subcategoryName: subcategory ? subcategory.name : null,
    subcategory2: subcategory2 ? subcategory2.toJSON() : null,
    subcategory2Name: subcategory2 ? subcategory2.name : null,
    expiryDate: getProductExpiryDate(productData),
  };
};

const validateProductHierarchy = async ({ catId, subCatId, subCatId2 }) => {
  if (!catId || !subCatId) return null;

  const subcategory = await SubCategory.findByPk(subCatId);
  if (!subcategory) return "Selected subcategory does not exist";
  if (String(subcategory.catId) !== String(catId)) {
    return "Selected subcategory does not belong to selected category";
  }

  if (subCatId2 !== undefined && subCatId2 !== null && subCatId2 !== "") {
    const subcategory2 = await SubCategory2.findByPk(subCatId2);
    if (!subcategory2) return "Selected subcategory 2 does not exist";
    if (String(subcategory2.subCategoryId) !== String(subCatId)) {
      return "Selected subcategory 2 does not belong to selected subcategory";
    }
  }

  return null;
};

const normalizeQueryList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value === undefined || value === null || value === "") return [];
  return [value];
};

const getRequestedBrandIds = async (query) => {
  const requestedBrands = [
    ...normalizeQueryList(query.brands),
    ...normalizeQueryList(query["brands[]"]),
    ...normalizeQueryList(query.brandId),
  ].map(String).filter(Boolean);

  if (requestedBrands.length === 0) return [];

  const requestedBrandIds = requestedBrands.filter((brand) => /^\d+$/.test(brand));
  const requestedBrandNames = requestedBrands.filter((brand) => !/^\d+$/.test(brand));
  const brandRecordsByName = requestedBrandNames.length
    ? await Brand.findAll({ where: { name: { [Op.in]: requestedBrandNames } } })
    : [];

  const selectedBrandIds = [
    ...requestedBrandIds,
    ...brandRecordsByName.map((brand) => String(brand.id)),
  ].filter((brand, index, list) => list.indexOf(brand) === index);

  return selectedBrandIds.length > 0 ? selectedBrandIds : ["__NO_BRAND_MATCH__"];
};

const applyBrandOriginFallbackToRequest = async (body, currentBrandId = null) => {
  const brandId = body.brandId || currentBrandId;
  if (!brandId || body.countryOfOrigin) return;

  const brandInfo = await Brand.findByPk(brandId);
  const originCountry = getBrandOriginCountry(brandInfo);
  if (originCountry) {
    body.countryOfOrigin = originCountry;
  }
};

const normalizeVariant = (variant, index) => {
  const flavorOptions = getVariantFlavorOptions(variant);

  const normalizedFlavors = flavorOptions
    .map((flavor) => {
      const label = getFlavorLabel(flavor);
      const flavorData = flavor && typeof flavor === "object" ? flavor : null;
      return {
        name: label,
        stock: flavorData ? flavorData.stock ?? variant.stock ?? 0 : variant.stock ?? 0,
        mrp: flavorData ? flavorData.mrp ?? variant.mrp ?? 0 : variant.mrp ?? 0,
        sellingPrice:
          flavorData
            ? flavorData.sellingPrice ?? flavorData.price ?? variant.sellingPrice ?? 0
            : variant.sellingPrice ?? 0,
        premiumPrice:
          flavorData
            ? flavorData.premiumPrice ?? variant.premiumPrice ?? variant.mrp ?? 0
            : variant.premiumPrice ?? variant.mrp ?? 0,
      };
    })
    .filter((flavor) => flavor.name);
  const flavorLabels = normalizedFlavors.map((flavor) => flavor.name).filter(Boolean);

  return {
    ...variant,
    id: variant?.id ?? index + 1,
    flavor: flavorLabels,
    flavors: normalizedFlavors,
    stock: variant?.stock ?? normalizedFlavors?.[0]?.stock ?? 0,
    mrp: variant?.mrp ?? normalizedFlavors?.[0]?.mrp ?? 0,
    sellingPrice: variant?.sellingPrice ?? normalizedFlavors?.[0]?.sellingPrice ?? 0,
    premiumPrice:
      variant?.premiumPrice ??
      normalizedFlavors?.[0]?.premiumPrice ??
      variant?.mrp ??
      0,
  };
};

const normalizeVariants = (variants) =>
  Array.isArray(variants) ? variants.map(normalizeVariant) : variants;

const normalizeNullableJsonList = (value) => {
  if (value === undefined || value === null || value === "") return null;
  if (!Array.isArray(value)) return value;

  const cleanList = value.filter((item) => item !== undefined && item !== null && item !== "");
  return cleanList.length > 0 ? cleanList : null;
};

const hasSellableVariant = (variants) => {
  if (!Array.isArray(variants) || variants.length === 0) return false;

  return variants.some((variant) => {
    const hasVariantPrices =
      variant.units &&
      Number(variant.stock || 0) >= 0 &&
      Number(variant.mrp || 0) > 0 &&
      Number(variant.sellingPrice || 0) > 0;

    const flavorOptions = getVariantFlavorOptions(variant);
    const hasFlavorPrices = flavorOptions.some(
      (flavor) =>
        typeof flavor === "object" &&
        getFlavorLabel(flavor) &&
        Number(flavor.stock || 0) >= 0 &&
        Number(flavor.mrp || 0) > 0 &&
        Number(flavor.sellingPrice || flavor.price || 0) > 0
    );

    return hasVariantPrices || hasFlavorPrices;
  });
};

const addProduct = async (req, res) => {
  let { name, catId, subCatId, brandId, images, varients, details, countryOfOrigin, isVeg } = req.body;
  varients = normalizeVariants(varients);
  req.body.varients = varients;
  req.body.certificates = normalizeNullableJsonList(req.body.certificates);
  req.body.supplements = normalizeNullableJsonList(req.body.supplements);

  if (isVeg === 'true' || isVeg === true) isVeg = true;
  else if (isVeg === 'false' || isVeg === false) isVeg = false;
  else isVeg = null;

  req.body.isVeg = isVeg;

  // Server-side validation matching frontend mandatory fields
  if (!name) return res.status(400).json({ status: false, message: "Product Name is required" });
  if (!catId) return res.status(400).json({ status: false, message: "Category ID is required" });
  if (!subCatId) return res.status(400).json({ status: false, message: "Subcategory ID is required" });
  if (!brandId) return res.status(400).json({ status: false, message: "Brand ID is required" });
  if (!images || images.length === 0) return res.status(400).json({ status: false, message: "At least one product image is required" });
  if (!hasSellableVariant(varients)) {
    return res.status(400).json({ status: false, message: "Product variants with valid units, stock, mrp, and selling price are required" });
  }
  if (!details || details.length === 0 || !details[0].heading || !details[0].body) {
    return res.status(400).json({ status: false, message: "Product details with heading and body are required" });
  }

  try {
    const hierarchyError = await validateProductHierarchy(req.body);
    if (hierarchyError) {
      return res.status(400).json({ status: false, message: hierarchyError });
    }

    await applyBrandOriginFallbackToRequest(req.body);
    if (!req.body.countryOfOrigin) {
      return res.status(400).json({
        status: false,
        message: "Country of Origin is required or must be configured on the selected brand",
      });
    }
    const product = await Product.create(req.body);
    res.status(201).json({ status: true, message: "Product added.", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to add product.",
      error: error.message
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
  const { catId, subCatId, subCatId2, isOnFlashSale, flashSale, flash } = req.query;

  try {
    // Build the where clause dynamically
    const flashSaleFilter = parseBooleanFilter(isOnFlashSale ?? flashSale ?? flash);
    const where = {};
    if (catId) where.catId = catId;
    if (subCatId) where.subCatId = subCatId;
    if (subCatId2) where.subCatId2 = subCatId2;
    if (flashSaleFilter !== undefined) where.isOnFlashSale = flashSaleFilter;
    const selectedBrandIds = await getRequestedBrandIds(req.query);
    if (selectedBrandIds.length > 0) where.brandId = { [Op.in]: selectedBrandIds };

    const products = await Product.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    const decoded = products
      .filter((product) => hasStock(product))
      .map((product) => {
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
  const { catId, subCatId, subCatId2, isOnFlashSale, flashSale, flash } = req.query;

  try {
    const flashSaleFilter = parseBooleanFilter(isOnFlashSale ?? flashSale ?? flash);
    const where = {};
    if (catId) where.catId = catId;
    if (subCatId) where.subCatId = subCatId;
    if (subCatId2) where.subCatId2 = subCatId2;
    if (flashSaleFilter !== undefined) where.isOnFlashSale = flashSaleFilter;
    const selectedBrandIds = await getRequestedBrandIds(req.query);
    if (selectedBrandIds.length > 0) where.brandId = { [Op.in]: selectedBrandIds };

    const products = await Product.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    const decoded = products
      .filter((product) => hasStock(product))
      .map((product) => {
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

    // Fetch Brand Name
    const brandInfo = await Brand.findByPk(product.brandId);

    const productDetails = await applyHierarchyToProductData(product.dataValues);
    const result = {
      ...applyBrandOriginToProductData(productDetails, brandInfo),
      brandName: brandInfo ? brandInfo.name : null, // Added brandName
      isVeg: productDetails.isVeg,
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

    const dpMrp = parseAmount(productDetails?.varients?.[0]?.mrp);
    const dpSp = parseAmount(productDetails?.varients?.[0]?.sellingPrice);
    const discountPercentage = dpMrp > 0 ? ((dpMrp - dpSp) / dpMrp) * 100 : 0;

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
    const similarWhere = {
      catId: result.catId,
      id: { [Op.ne]: id }
    };
    if (result.subCatId) similarWhere.subCatId = result.subCatId;
    if (result.subCatId2) similarWhere.subCatId2 = result.subCatId2;
    const products = await Product.findAll({
      where: similarWhere,
      order: [["createdAt", "DESC"]],
    });
    for (const item of products) {
      if (!hasStock(item)) continue;
      const ratings = await Rating.findAll({
        where: { product: item.id },
        order: [["createdAt", "DESC"]],
      });
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating =
        ratings.length > 0 ? totalRating / ratings.length : 0;
      const mrp = parseAmount(item?.dataValues?.varients?.[0]?.mrp);
      const sp = parseAmount(item?.dataValues?.varients?.[0]?.sellingPrice);
      const discountPercentage = mrp > 0 ? ((mrp - sp) / mrp) * 100 : 0;

      // Fetch Brand Name for similar product
      const itemBrand = await Brand.findByPk(item.brandId);

      const newItem = {
        ...applyBrandOriginToProductData(item.dataValues, itemBrand),
        brandName: itemBrand ? itemBrand.name : null, // Added brandName here too
        isVeg: item.dataValues.isVeg,
        averageRating,
        discountPercentage
      };
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

    if (req.body.isVeg !== undefined) {
        if (req.body.isVeg === 'true' || req.body.isVeg === true) req.body.isVeg = true;
        else if (req.body.isVeg === 'false' || req.body.isVeg === false) req.body.isVeg = false;
        else req.body.isVeg = null;
    }

    if (req.body.varients !== undefined) {
      req.body.varients = normalizeVariants(req.body.varients);
      if (!hasSellableVariant(req.body.varients)) {
        return res.status(400).json({
          status: false,
          message: "Product variants with valid units, stock, mrp, and selling price are required",
        });
      }
    }

    if (req.body.certificates !== undefined) {
      req.body.certificates = normalizeNullableJsonList(req.body.certificates);
    }

    if (req.body.supplements !== undefined) {
      req.body.supplements = normalizeNullableJsonList(req.body.supplements);
    }

    const hierarchyError = await validateProductHierarchy({
      catId: req.body.catId !== undefined ? req.body.catId : product.catId,
      subCatId: req.body.subCatId !== undefined ? req.body.subCatId : product.subCatId,
      subCatId2: req.body.subCatId2 !== undefined ? req.body.subCatId2 : product.subCatId2,
    });
    if (hierarchyError) {
      return res.status(400).json({ status: false, message: hierarchyError });
    }

    await applyBrandOriginFallbackToRequest(req.body, product.brandId);

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
      const ComboProduct = require("../model/comboProduct");
      const comboProduct = await ComboProduct.findByPk(id);
      if (comboProduct) {
        await comboProduct.destroy();
        return res.status(200).json({ status: true, message: "Product deleted." });
      }

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
      brandId,
      priceRanges = [],
      discountPercent = 0,
      category = 0,
      minRating = 0,
      isBestSeller,
      isOnFlashSale,
      flashSale,
      flash,
      id,
      query = "nothing",
      sorting = "nothing",
      user: userId = 0,
    } = req.query;

    const normalizeQueryList = (value) => {
      if (Array.isArray(value)) return value.filter(Boolean);
      if (value === undefined || value === null || value === "") return [];
      return [value];
    };

    const requestedBrands = [
      ...normalizeQueryList(brands),
      ...normalizeQueryList(req.query["brands[]"]),
      ...normalizeQueryList(brandId),
    ].map(String);

    const requestedBrandNames = requestedBrands.filter(
      (brand) => !/^\d+$/.test(brand)
    );
    const brandRecordsByName = requestedBrandNames.length
      ? await Brand.findAll({ where: { name: { [Op.in]: requestedBrandNames } } })
      : [];
    const selectedBrandIds = [
      ...requestedBrands.filter((brand) => /^\d+$/.test(brand)),
      ...brandRecordsByName.map((brand) => String(brand.id)),
    ].filter((brand, index, list) => list.indexOf(brand) === index);
    const flashSaleFilter = parseBooleanFilter(isOnFlashSale ?? flashSale ?? flash);

    if (id && query != "nothing") {
      await RecentSearches.addToRecentSearch(id, query);
    }

    let brandDetails = {};

    if (selectedBrandIds.length === 1) {
      brandDetails = await Brand.findByPk(selectedBrandIds[0]);
    }

    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });

    const filteredList = await Promise.all(
      products.map(async (product) => {
        // Skip products that are out of stock for all variants
        if (!hasStock(product)) return null;
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

        const brandMatch =
          selectedBrandIds.length === 0 ||
          selectedBrandIds.includes(String(product.brandId));

        const priceMatch = checkPriceRanges(
          parseInt(product.varients[0].mrp),
          priceRanges
        );

        const selectedCategoryId = Number(category) || 0;
        const catMatch = selectedCategoryId === 0 || Number(product.catId) === selectedCategoryId;
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
        const flashSaleMatch =
          flashSaleFilter === undefined
            ? true
            : parseBooleanFilter(product.isOnFlashSale) === flashSaleFilter;
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
          flashSaleMatch &&
          queryMatched
        ) {
          const productBrandInfo = await Brand.findByPk(product.brandId);
          return {
            ...applyBrandOriginToProductData(product.dataValues, productBrandInfo),
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

const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const trendingSearches = await Product.findAll({
      order: [["hit", "DESC"]],
      limit: parseInt(limit),
    });

    res.status(200).json({ status: true, message: "OK", products: trendingSearches });
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

// Helper: Check if product has any variant with stock > 0
const hasStock = (product) => {
  try {
    const variants = product?.varients || [];
    return variants.some((v) => {
      const s = v?.stock;
      const n = typeof s === "string" ? parseInt(s, 10) : Number(s);
      if (n > 0) return true;

      return getVariantFlavorOptions(v).some((flavor) => {
        if (!flavor || typeof flavor !== "object") return false;
        const stock = flavor.stock;
        const stockValue =
          typeof stock === "string" ? parseInt(stock, 10) : Number(stock);
        return stockValue > 0;
      });
    });
  } catch {
    return false;
  }
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

    const relatedWhere = {
      catId: product.catId,
      id: { [Op.ne]: productId }
    };
    if (product.subCatId) relatedWhere.subCatId = product.subCatId;
    if (product.subCatId2) relatedWhere.subCatId2 = product.subCatId2;

    // Find products from the same category chain but different ID.
    const relatedProducts = await Product.findAll({
      where: relatedWhere,
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    const decoded = await Promise.all(relatedProducts.filter((p)=>hasStock(p)).map(async (product) => {
      // Get ratings for each product
      const ratings = await Rating.findAll({
        where: { product: product.id }
      });

      // Calculate average rating
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

      const mrp = parseAmount(product?.dataValues?.varients?.[0]?.mrp);
      const sp = parseAmount(product?.dataValues?.varients?.[0]?.sellingPrice);
      const discountPercentage = mrp > 0 ? ((mrp - sp) / mrp) * 100 : 0;
      const brandInfo = await Brand.findByPk(product.brandId);

      return {
        ...applyBrandOriginToProductData(product.dataValues, brandInfo),
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
      products.filter((p) => hasStock(p)).map(async (product) => {
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
        const brandInfo = await Brand.findByPk(product.brandId);

        return {
          ...applyBrandOriginToProductData(product, brandInfo),
          isVeg: product.isVeg,
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
      products.filter((p) => hasStock(p)).map(async (product) => {
        const orderCountEntry = productCounts.find(
          (entry) => entry.productId === product.id
        );
        const orderCount = orderCountEntry ? orderCountEntry.orderCount : 0;

        // Get product details like in getProductbyId
        const productDetails = product.dataValues || product;
        const brandInfo = await Brand.findByPk(productDetails.brandId);
        const result = {
          ...applyBrandOriginToProductData(productDetails, brandInfo),
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
    const brandInfo = await Brand.findByPk(product.brandId);
    const result = {
      ...applyBrandOriginToProductData(productDetails, brandInfo),
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
    const similarWhere = {
      catId: result.catId,
      id: { [Op.ne]: id }
    };
    if (result.subCatId) similarWhere.subCatId = result.subCatId;
    if (result.subCatId2) similarWhere.subCatId2 = result.subCatId2;
    const products = await Product.findAll({
      where: similarWhere,
      order: [["createdAt", "DESC"]],
    });
    for (const item of products) {
      if (!hasStock(item)) continue;
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
      isOnFlashSale,
      flashSale,
      flash,
    } = req.query;

    // Build dynamic where clause based on filters
    const flashSaleFilter = parseBooleanFilter(isOnFlashSale ?? flashSale ?? flash);
    const where = {};
    if (brandId) where.brandId = brandId;
    if (catId) where.catId = catId;
    if (subCatId) where.subCatId = subCatId;
    if (subCatId2) where.subCatId2 = subCatId2;
    if (flashSaleFilter !== undefined) where.isOnFlashSale = flashSaleFilter;
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
        const brandInfo = await Brand.findByPk(product.brandId);

        const productWithHierarchy = await applyHierarchyToProductData(product.dataValues);

        return {
          ...applyBrandOriginToProductData(productWithHierarchy, brandInfo),
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
  getAllProducts,
  getAllProductsPaginated,  // New function
  updateStock,
  toggleBestSeller,
  getTrendingProducts,
  getRelatedProducts,     // Add this line
  getOutOfStockProducts,   // Add this line
  getBestSellerProducts,
  getBestSellingProductsToday,
  getBestSellingProductTodayById
};

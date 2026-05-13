const ComboProduct = require("../model/comboProduct");
const Brand = require("../model/brand");
const Category = require("../model/category");
const SubCategory = require("../model/subCategory");
const Combo = require("../model/combo");
const Product = require("../model/product");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

const firstVariant = (product) =>
  Array.isArray(product?.varients) && product.varients.length > 0
    ? product.varients[0]
    : {};

const numberOr = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeComboPricingPayload = (payload) => {
  const firstPayloadVariant =
    Array.isArray(payload?.varients) && payload.varients.length > 0
      ? payload.varients[0]
      : {};
  const mrp = numberOr(payload?.mrp, numberOr(firstPayloadVariant.mrp, 0));
  const sellingPrice = numberOr(
    payload?.sellingPrice ?? payload?.price,
    numberOr(firstPayloadVariant.sellingPrice ?? firstPayloadVariant.price, 0)
  );

  return {
    ...payload,
    mrp,
    sellingPrice,
    price: payload?.price == null || payload.price === "" ? sellingPrice : payload.price,
    varients: [],
  };
};

const buildComboFromProducts = async (body) => {
  const productIds = Array.isArray(body.products)
    ? body.products.map((id) => Number(id)).filter(Boolean)
    : [];

  if (productIds.length < 2 || productIds.length > 3) {
    return {
      status: false,
      code: 400,
      message: "Combo must include 2 or 3 products.",
    };
  }

  const products = await Product.findAll({ where: { id: productIds } });
  if (products.length !== productIds.length) {
    return {
      status: false,
      code: 404,
      message: "One or more selected products were not found.",
    };
  }

  const brandIds = [...new Set(products.map((product) => product.brandId))];
  if (brandIds.length !== 1) {
    return {
      status: false,
      code: 400,
      message: "Combo products must belong to the same brand.",
    };
  }

  const variants = products.map((product) => firstVariant(product));
  const mrp = variants.reduce((sum, variant) => sum + Number(variant.mrp || 0), 0);
  const sellingPrice = variants.reduce(
    (sum, variant) => sum + Number(variant.sellingPrice || 0),
    0
  );
  const comboMrp = numberOr(body.mrp, mrp);
  const comboSellingPrice = numberOr(body.sellingPrice ?? body.price, sellingPrice);
  const firstProduct = products[0];
  const description =
    body.description ||
    `Combo includes ${products.map((product) => product.name).join(", ")}.`;

  return {
    status: true,
    data: {
      catId: body.catId || firstProduct.catId,
      comboCatId: body.comboCatId,
      subCatId: body.subCatId || firstProduct.subCatId,
      subCatId2: body.subCatId2 || firstProduct.subCatId2 || null,
      brandId: firstProduct.brandId,
      name: body.name || products.map((product) => product.name).join(" + "),
      mrp: comboMrp,
      sellingPrice: comboSellingPrice,
      price: comboSellingPrice,
      images: body.images || products.flatMap((product) => product.images || []).slice(0, 6),
      overView: body.overView || [],
      details: body.details || [{ heading: "Description", body: description }],
      tables: body.tables || [],
      information: body.information || [],
      certificates: body.certificates || [],
      supplements: body.supplements || [],
      brand: body.brand || {},
      selectedProductIds: productIds,
      varients: [],
      expiry_date: body.expiry_date || null,
    },
  };
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
    // Ensure table exists
    await ComboProduct.sync({ alter: true });

    if (req.body.comboCategoryId && !req.body.comboCatId) {
      req.body.comboCatId = req.body.comboCategoryId;
    }

    let payload = req.body;
    if (Array.isArray(req.body.products)) {
      const comboBuild = await buildComboFromProducts(req.body);
      if (!comboBuild.status) {
        return res
          .status(comboBuild.code)
          .json({ status: false, message: comboBuild.message });
      }
      payload = comboBuild.data;
    }
    payload = normalizeComboPricingPayload(payload);

    const requiredFields = ["catId", "comboCatId", "subCatId", "brandId", "name", "mrp", "sellingPrice"];
    const missingField = requiredFields.find(
      (field) =>
        payload[field] === undefined ||
        payload[field] === null ||
        payload[field] === "" ||
        (["mrp", "sellingPrice"].includes(field) && Number(payload[field]) <= 0)
    );
    if (missingField) {
      return res.status(400).json({
        status: false,
        message: `${missingField} is required`,
      });
    }

    const comboProduct = await ComboProduct.create(payload);
    res.status(201).json({ status: true, message: "Combo product added.", comboProduct });
  } catch (error) {
    console.log("Combo Product Error:", error);
    console.log("Error details:", error.errors || error.message);
    res.status(400).json({
      status: false,
      message: "Unable to add combo product.",
      error: error.message || "Database error"
    });
  }
};

const getAllComboProducts = async (req, res) => {
  try {
    const comboProducts = await ComboProduct.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", comboProducts });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve combo products.",
    });
  }
};

const getComboProductsByCategory = async (req, res) => {
  const { comboCatId } = req.params;

  try {
    const comboProducts = await ComboProduct.findAll({
      where: {
        comboCatId: comboCatId,
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", comboProducts });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve combo products.",
    });
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
    const comboProduct = await ComboProduct.findByPk(id);
    if (!comboProduct) {
      return res.status(404).json({
        status: false,
        message: "Combo product not found",
      });
    }

    const updatedComboProduct = await comboProduct.update(
      normalizeComboPricingPayload(req.body)
    );
    res.status(200).json({
      status: true,
      message: "Combo product updated.",
      comboProduct: updatedComboProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to update combo product.",
    });
  }
};

const deleteComboProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const comboProduct = await ComboProduct.findByPk(id);

    if (!comboProduct) {
      return res.status(404).json({
        status: false,
        message: "Combo product not found",
      });
    }

    await comboProduct.destroy();
    res.status(200).json({ status: true, message: "Combo product deleted." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to delete combo product.",
    });
  }
};

const previewComboFromProducts = async (req, res) => {
  const comboBuild = await buildComboFromProducts(req.body);
  if (!comboBuild.status) {
    return res.status(comboBuild.code).json(comboBuild);
  }
  res.status(200).json({ status: true, data: comboBuild.data });
};

const getAllComboProductsPaginated = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      brandId,
      catId,
      subCatId,
      subCatId2,
      comboCatId,
      search,
    } = req.query;

    const where = {};
    if (brandId) where.brandId = brandId;
    if (catId) where.catId = catId;
    if (subCatId) where.subCatId = subCatId;
    if (subCatId2) where.subCatId2 = subCatId2;
    if (comboCatId) where.comboCatId = comboCatId;
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: comboProducts } = await ComboProduct.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const enrichedComboProducts = comboProducts.map((comboProduct) => {
      const data = comboProduct.dataValues;

      const comboMrp = Number(data.mrp || 0);
      const comboSellingPrice = Number(data.sellingPrice || data.price || 0);
      const discountPercentage =
        comboMrp > 0 && comboSellingPrice > 0
          ? ((comboMrp - comboSellingPrice) / comboMrp) * 100
          : 0;

      return {
        ...data,
        discountPercentage,
      };
    });

    const totalPages = Math.ceil(count / parseInt(limit));
    const currentPage = parseInt(page);

    res.status(200).json({
      status: true,
      message: "OK",
      data: {
        products: enrichedComboProducts,
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
    console.error("Error fetching paginated combo products:", error);
    res.status(400).json({
      status: false,
      message: "Unable to retrieve combo products.",
      error: error.message,
    });
  }
};

const getAllComboCategoriesWithProducts = async (req, res) => {
  try {
    // Get all unique combo categories that have products
    const comboCategories = await ComboProduct.findAll({
      attributes: [
        [ComboProduct.sequelize.fn('DISTINCT', ComboProduct.sequelize.col('comboCatId')), 'comboCatId']
      ],
      raw: true
    });

    const comboCatIds = comboCategories.map(item => item.comboCatId);

    // For each combo category, get all products
    const result = [];

    for (const comboCatId of comboCatIds) {
      // Get combo category info (assuming combo categories are in comboCat table)
      const comboCatInfo = await require("../model/comboCat").findByPk(comboCatId);

      // Get all products for this combo category
      const products = await ComboProduct.findAll({
        where: { comboCatId },
        include: [
          {
            model: Brand,
            as: 'brandInfo',
            attributes: ['id', 'name', 'image', 'banner', 'description'],
            required: false
          },
          {
            model: Category,
            as: 'categoryInfo',
            attributes: ['id', 'name', 'imageOn', 'imageOff'],
            required: false
          },
          {
            model: SubCategory,
            as: 'subCategoryInfo',
            attributes: ['id', 'name'],
            required: false
          }
        ],
        order: [["createdAt", "DESC"]],
      });

      // Transform products data
      const productsWithDetails = products.map(product => {
        const productData = product.toJSON();
        return {
          id: productData.id,
          catId: productData.catId,
          comboCatId: productData.comboCatId,
          subCatId: productData.subCatId,
          subCatId2: productData.subCatId2,
          brandId: productData.brandId,
          name: productData.name,
          isBestSeller: productData.isBestSeller,
          isOnFlashSale: productData.isOnFlashSale,
          mrp: productData.mrp || 0,
          sellingPrice: productData.sellingPrice || productData.price || 0,
          price: productData.price || productData.sellingPrice || 0,
          images: productData.images || [],
          overView: productData.overView || [],
          details: productData.details || [],
          tables: productData.tables || [],
          information: productData.information || [],
          certificates: productData.certificates || [],
          supplements: productData.supplements || [],
          brand: productData.brand || {},
          hit: productData.hit || 0,
          varients: productData.varients || [],
          expiry_date: productData.expiry_date,
          createdAt: productData.createdAt,
          updatedAt: productData.updatedAt,
          brandInfo: productData.brandInfo || null,
          categoryInfo: productData.categoryInfo || null,
          subCategoryInfo: productData.subCategoryInfo || null
        };
      });

      result.push({
        comboCategoryId: comboCatId,
        comboCategoryInfo: comboCatInfo ? {
          id: comboCatInfo.id,
          name: comboCatInfo.name,
          image: comboCatInfo.image
        } : null,
        products: productsWithDetails,
        productCount: productsWithDetails.length
      });
    }

    res.status(200).json({
      status: true,
      message: "All combo categories with products retrieved successfully",
      comboCategories: result,
      totalCategories: result.length
    });

  } catch (error) {
    console.error("Error fetching combo categories with products:", error);
    res.status(400).json({
      status: false,
      message: "Unable to retrieve combo categories with products.",
      error: error.message
    });
  }
};

const getComboProductByIdWithDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const comboProduct = await ComboProduct.findByPk(id, {
      include: [
        {
          model: Brand,
          as: 'brandInfo',
          attributes: ['id', 'name', 'image', 'banner', 'description'],
          required: false
        },
        {
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'name', 'imageOn', 'imageOff'],
          required: false
        },
        {
          model: SubCategory,
          as: 'subCategoryInfo',
          attributes: ['id', 'name'],
          required: false
        }
      ],
    });

    if (!comboProduct) {
      return res.status(404).json({
        status: false,
        message: "Combo product not found",
      });
    }

    // Transform the data to match the regular product API format
    const productData = comboProduct.toJSON();
    const result = {
      id: productData.id,
      catId: productData.catId,
      comboCatId: productData.comboCatId,
      subCatId: productData.subCatId,
      subCatId2: productData.subCatId2,
      brandId: productData.brandId,
      name: productData.name,
      isBestSeller: productData.isBestSeller,
      isOnFlashSale: productData.isOnFlashSale,
      mrp: productData.mrp || 0,
      sellingPrice: productData.sellingPrice || productData.price || 0,
      price: productData.price || productData.sellingPrice || 0,
      images: productData.images || [],
      overView: productData.overView || [],
      details: productData.details || [],
      tables: productData.tables || [],
      information: productData.information || [],
      certificates: productData.certificates || [],
      supplements: productData.supplements || [],
      brand: productData.brand || {},
      hit: productData.hit || 0,
      varients: productData.varients || [],
      expiry_date: productData.expiry_date,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
      // Rating related fields (set to defaults for combo products)
      ratings: [],
      userRating: [],
      averageRating: 0,
      averageTasteRate: 0,
      averageMixabilityRate: 0,
      averageEfficacyRate: 0,
      averageValueForMoneyRate: 0,
      discountPercentage: null,
      totalRating: 0
    };

    // Find similar combo products from the same combo category
    const similarComboProducts = [];
    const similarCombos = await ComboProduct.findAll({
      where: {
        comboCatId: result.comboCatId,
        id: { [Op.ne]: id } // Exclude current product
      },
      limit: 10, // Limit to 10 similar products
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Brand,
          as: 'brandInfo',
          attributes: ['id', 'name', 'image', 'banner', 'description'],
          required: false
        },
        {
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'name', 'imageOn', 'imageOff'],
          required: false
        },
        {
          model: SubCategory,
          as: 'subCategoryInfo',
          attributes: ['id', 'name'],
          required: false
        }
      ],
    });

    // Transform similar combo products data
    for (const combo of similarCombos) {
      const comboData = combo.toJSON();
      const transformedCombo = {
        id: comboData.id,
        catId: comboData.catId,
        comboCatId: comboData.comboCatId,
        subCatId: comboData.subCatId,
        subCatId2: comboData.subCatId2,
        brandId: comboData.brandId,
        name: comboData.name,
        isBestSeller: comboData.isBestSeller,
        isOnFlashSale: comboData.isOnFlashSale,
        mrp: comboData.mrp || 0,
        sellingPrice: comboData.sellingPrice || comboData.price || 0,
        price: comboData.price || comboData.sellingPrice || 0,
        images: comboData.images || [],
        overView: comboData.overView || [],
        details: comboData.details || [],
        tables: comboData.tables || [],
        information: comboData.information || [],
        certificates: comboData.certificates || [],
        supplements: comboData.supplements || [],
        brand: comboData.brand || {},
        hit: comboData.hit || 0,
        varients: comboData.varients || [],
        expiry_date: comboData.expiry_date,
        createdAt: comboData.createdAt,
        updatedAt: comboData.updatedAt,
        brandInfo: comboData.brandInfo || null,
        categoryInfo: comboData.categoryInfo || null,
        subCategoryInfo: comboData.subCategoryInfo || null,
        // Rating related fields (set to defaults for combo products)
        ratings: [],
        userRating: [],
        averageRating: 0,
        averageTasteRate: 0,
        averageMixabilityRate: 0,
        averageEfficacyRate: 0,
        averageValueForMoneyRate: 0,
        discountPercentage: null,
        totalRating: 0
      };
      similarComboProducts.push(transformedCombo);
    }

    res.status(200).json({
      status: true,
      message: "OK",
      result: result,
      similarComboProducts: similarComboProducts
    });

  } catch (error) {
    console.error("Error fetching combo product by ID:", error);
    res.status(400).json({
      status: false,
      message: "Unable to retrieve combo product with details.",
      error: error.message
    });
  }
};

module.exports = {
  addComboProduct,
  getAllComboProducts,
  getComboProductsByCategory,
  updateComboProduct,
  deleteComboProduct,
  previewComboFromProducts,
  getAllComboProductsPaginated,
  getAllComboCategoriesWithProducts,

  getComboProductByIdWithDetails,
};

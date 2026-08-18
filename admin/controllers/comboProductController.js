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

let comboProductTableReady = false;

const ensureComboProductTable = async () => {
  if (comboProductTableReady) return;
  await ComboProduct.sync({ alter: true });
  comboProductTableReady = true;
};

const serializeComboProduct = (comboProduct) => {
  const data =
    typeof comboProduct?.toJSON === "function"
      ? comboProduct.toJSON()
      : comboProduct?.dataValues || comboProduct || {};
  const mrp = numberOr(data.mrp, 0);
  const sellingPrice = numberOr(data.sellingPrice ?? data.price, 0);
  const price = numberOr(data.price, sellingPrice);
  const discountPercentage =
    mrp > 0 && sellingPrice > 0 ? ((mrp - sellingPrice) / mrp) * 100 : 0;
  const existingVariants = Array.isArray(data.varients) ? data.varients : [];
  const fallbackVariant = {
    id: 0,
    mrp: String(mrp),
    sellingPrice: String(sellingPrice),
    premiumPrice: String(price || sellingPrice),
    price: String(price || sellingPrice),
    units: "Combo",
    stock: data.stock == null ? "" : String(data.stock),
    date: data.expiry_date || "",
    flavor: ["Combo"],
  };

  return {
    ...data,
    mrp,
    sellingPrice,
    price,
    isCombo: true,
    varients: existingVariants.length ? existingVariants : [fallbackVariant],
    discountPercentage,
  };
};

const serializeLegacyComboProduct = (product, comboCatId = null) => {
  const data =
    typeof product?.toJSON === "function"
      ? product.toJSON()
      : product?.dataValues || product || {};
  const variant = firstVariant(data);
  const mrp = numberOr(data.mrp, numberOr(variant.mrp, 0));
  const sellingPrice = numberOr(
    data.sellingPrice ?? data.price,
    numberOr(variant.sellingPrice ?? variant.premiumPrice ?? variant.price, 0)
  );
  const price = numberOr(data.price, sellingPrice);
  const discountPercentage =
    mrp > 0 && sellingPrice > 0 ? ((mrp - sellingPrice) / mrp) * 100 : 0;

  return {
    ...data,
    comboCatId,
    mrp,
    sellingPrice,
    price,
    isCombo: true,
    products: [data.id].filter(Boolean),
    selectedProductIds: [data.id].filter(Boolean),
    varients: Array.isArray(data.varients) ? data.varients : [],
    discountPercentage,
    isLegacyComboProduct: true,
  };
};

const getLegacyComboProductsForCategory = async (comboCatId, flashSaleFilter) => {
  const legacyCombos = await Combo.findAll({
    where: { catId: comboCatId },
    order: [["createdAt", "DESC"]],
  });
  const productIds = [
    ...new Set(
      legacyCombos.flatMap((combo) =>
        Array.isArray(combo.products)
          ? combo.products.map((id) => Number(id)).filter(Boolean)
          : []
      )
    ),
  ];

  if (!productIds.length) return [];

  const productWhere = { id: productIds };
  if (flashSaleFilter !== undefined) productWhere.isOnFlashSale = flashSaleFilter;

  const products = await Product.findAll({
    where: productWhere,
  });
  const productOrder = new Map(productIds.map((id, index) => [id, index]));

  return products
    .sort(
      (a, b) =>
        (productOrder.get(Number(a.id)) || 0) -
        (productOrder.get(Number(b.id)) || 0)
    )
    .map((product) => serializeLegacyComboProduct(product, comboCatId));
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
      products: productIds,
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
    await ensureComboProductTable();

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
    res.status(201).json({
      status: true,
      message: "Combo product added.",
      comboProduct: serializeComboProduct(comboProduct),
    });
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
    await ensureComboProductTable();
    const flashSaleFilter = parseBooleanFilter(
      req.query.isOnFlashSale ?? req.query.flashSale ?? req.query.flash
    );
    const where = {};
    if (flashSaleFilter !== undefined) where.isOnFlashSale = flashSaleFilter;

    const comboProducts = await ComboProduct.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      status: true,
      message: "OK",
      comboProducts: comboProducts.map(serializeComboProduct),
    });
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
    await ensureComboProductTable();
    const flashSaleFilter = parseBooleanFilter(
      req.query.isOnFlashSale ?? req.query.flashSale ?? req.query.flash
    );
    const where = { comboCatId };
    if (flashSaleFilter !== undefined) where.isOnFlashSale = flashSaleFilter;

    const comboProducts = await ComboProduct.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    const serializedComboProducts = comboProducts.map(serializeComboProduct);
    const products =
      serializedComboProducts.length > 0
        ? serializedComboProducts
        : await getLegacyComboProductsForCategory(comboCatId, flashSaleFilter);

    res.status(200).json({
      status: true,
      message: "OK",
      comboProducts: products,
      combo: products,
    });
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
    await ensureComboProductTable();
    const comboProduct = await ComboProduct.findByPk(id);
    if (!comboProduct) {
      return res.status(404).json({
        status: false,
        message: "Combo product not found",
      });
    }

    let payload = req.body;
    if (Array.isArray(req.body.products)) {
      const comboBuild = await buildComboFromProducts({
        ...comboProduct.toJSON(),
        ...req.body,
      });
      if (!comboBuild.status) {
        return res
          .status(comboBuild.code)
          .json({ status: false, message: comboBuild.message });
      }
      payload = comboBuild.data;
    }

    const updatedComboProduct = await comboProduct.update(
      normalizeComboPricingPayload(payload)
    );
    res.status(200).json({
      status: true,
      message: "Combo product updated.",
      comboProduct: serializeComboProduct(updatedComboProduct),
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
    await ensureComboProductTable();
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
  res.status(200).json({ status: true, data: serializeComboProduct(comboBuild.data) });
};

const getAllComboProductsPaginated = async (req, res) => {
  try {
    await ensureComboProductTable();
    const {
      page = 1,
      limit = 20,
      brandId,
      catId,
      subCatId,
      subCatId2,
      comboCatId,
      search,
      isOnFlashSale,
      flashSale,
      flash,
    } = req.query;

    const flashSaleFilter = parseBooleanFilter(isOnFlashSale ?? flashSale ?? flash);
    const where = {};
    if (brandId) where.brandId = brandId;
    if (catId) where.catId = catId;
    if (subCatId) where.subCatId = subCatId;
    if (subCatId2) where.subCatId2 = subCatId2;
    if (comboCatId) where.comboCatId = comboCatId;
    if (flashSaleFilter !== undefined) where.isOnFlashSale = flashSaleFilter;
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

    const enrichedComboProducts = comboProducts.map(serializeComboProduct);

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
    await ensureComboProductTable();
    // Get all unique combo categories that have products
    const comboCategories = await ComboProduct.findAll({
      attributes: [
        [ComboProduct.sequelize.fn('DISTINCT', ComboProduct.sequelize.col('comboCatId')), 'comboCatId']
      ],
      raw: true
    });

    const comboCatIds = comboCategories
      .map(item => item.comboCatId)
      .filter(Boolean);

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
            attributes: ['id', 'name', 'image', 'banner', 'description', 'originCountry', 'originCountryCode'],
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
        const productData = serializeComboProduct(product);
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
          products: productData.products || productData.selectedProductIds || [],
          selectedProductIds: productData.selectedProductIds || productData.products || [],
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

    const legacyCombos = await Combo.findAll({ order: [["createdAt", "DESC"]] });
    const legacyComboCatIds = [
      ...new Set(
        legacyCombos
          .map((combo) => combo.catId)
          .filter(Boolean)
      ),
    ];

    for (const legacyComboCatId of legacyComboCatIds) {
      const hasNewProducts = result.some(
        (category) =>
          String(category.comboCategoryId) === String(legacyComboCatId)
      );
      if (hasNewProducts) continue;

      const productsWithDetails = await getLegacyComboProductsForCategory(
        legacyComboCatId
      );
      if (!productsWithDetails.length) continue;

      const comboCatInfo = await require("../model/comboCat").findByPk(
        legacyComboCatId
      );

      result.push({
        comboCategoryId: legacyComboCatId,
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
    await ensureComboProductTable();
    const comboProduct = await ComboProduct.findByPk(id, {
      include: [
        {
          model: Brand,
          as: 'brandInfo',
          attributes: ['id', 'name', 'image', 'banner', 'description', 'originCountry', 'originCountryCode'],
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
      const legacyProduct = await Product.findByPk(id);
      if (!legacyProduct) {
        return res.status(404).json({
          status: false,
          message: "Combo product not found",
        });
      }

      const productData = serializeLegacyComboProduct(legacyProduct);
      const [brandInfo, categoryInfo, subCategoryInfo] = await Promise.all([
        productData.brandId ? Brand.findByPk(productData.brandId) : null,
        productData.catId ? Category.findByPk(productData.catId) : null,
        productData.subCatId ? SubCategory.findByPk(productData.subCatId) : null,
      ]);

      return res.status(200).json({
        status: true,
        message: "OK",
        result: {
          ...productData,
          brandInfo: brandInfo || null,
          categoryInfo: categoryInfo || null,
          subCategoryInfo: subCategoryInfo || null,
          ratings: [],
          userRating: [],
          averageRating: 0,
          averageTasteRate: 0,
          averageMixabilityRate: 0,
          averageEfficacyRate: 0,
          averageValueForMoneyRate: 0,
          totalRating: 0,
        },
        similarComboProducts: [],
      });
    }

    // Transform the data to match the regular product API format
    const productData = serializeComboProduct(comboProduct);
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
      products: productData.products || productData.selectedProductIds || [],
      selectedProductIds: productData.selectedProductIds || productData.products || [],
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
      brandOriginCountry: comboProduct.brandInfo?.originCountry || null,
      brandOriginCountryCode: comboProduct.brandInfo?.originCountryCode || null,
      countryOfOrigin: comboProduct.countryOfOrigin || comboProduct.brandInfo?.originCountry || null,
      // Rating related fields (set to defaults for combo products)
      ratings: [],
      userRating: [],
      averageRating: 0,
      averageTasteRate: 0,
      averageMixabilityRate: 0,
      averageEfficacyRate: 0,
      averageValueForMoneyRate: 0,
      discountPercentage: productData.discountPercentage,
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
          attributes: ['id', 'name', 'image', 'banner', 'description', 'originCountry', 'originCountryCode'],
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
      const comboData = serializeComboProduct(combo);
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
        products: comboData.products || comboData.selectedProductIds || [],
        selectedProductIds: comboData.selectedProductIds || comboData.products || [],
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
        brandOriginCountry: combo.brandInfo?.originCountry || null,
        brandOriginCountryCode: combo.brandInfo?.originCountryCode || null,
        countryOfOrigin: combo.countryOfOrigin || combo.brandInfo?.originCountry || null,
        // Rating related fields (set to defaults for combo products)
        ratings: [],
        userRating: [],
        averageRating: 0,
        averageTasteRate: 0,
        averageMixabilityRate: 0,
        averageEfficacyRate: 0,
        averageValueForMoneyRate: 0,
        discountPercentage: comboData.discountPercentage,
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

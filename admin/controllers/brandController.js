const Brand = require("../model/brand");
const { validationResult } = require("express-validator");

const normalizeBanner = (banner) => {
  if (Array.isArray(banner)) return banner;
  if (typeof banner === "string" && banner.trim() !== "") return [banner.trim()];
  return [];
};

const normalizeBrandPayload = (body, existingBrand = {}) => ({
  ...body,
  banner:
    body.banner === undefined
      ? existingBrand.banner
      : normalizeBanner(body.banner),
  description: body.description || existingBrand.description || " ",
  originCountry: body.originCountry || body.countryOfOrigin || existingBrand.originCountry || null,
  originCountryCode: body.originCountryCode || existingBrand.originCountryCode || null,
});

const addBrand = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const newBrand = await Brand.create(normalizeBrandPayload(req.body));
    res
      .status(201)
      .json({ status: true, message: "Brand added.", brand: newBrand });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to add brand.",
      error: error.message,
    });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ status: true, message: "OK", brands });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve brands.",
      error: error.message,
    });
  }
};

const updateBrand = async (req, res) => {
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
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res
        .status(404)
        .json({ status: false, message: "Brand not found" });
    }

    const updatedBrand = await brand.update(normalizeBrandPayload(req.body, brand));
    res
      .status(200)
      .json({ status: true, message: "Brand updated.", brand: updatedBrand });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to update brand.",
      error: error.message,
    });
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res
        .status(404)
        .json({ status: false, message: "Brand not found" });
    }

    await brand.destroy();
    res.status(200).json({ status: true, message: "Brand deleted." });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to delete brand.",
      error: error.message,
    });
  }
};

const getBrandsBySubcatId = async (req, res) => {
  const { subcatId, subcatId2 } = req.query;

  try {
    // Build the where clause dynamically
    const where = {};
    if (subcatId) where.subcatId = subcatId;
    if (subcatId2) where.subcatId2 = subcatId2;

    // If neither subcatId nor subcatId2 is provided, return an error
    if (!subcatId && !subcatId2) {
      return res.status(400).json({
        status: false,
        message: "At least one of subcatId or subcatId2 is required.",
      });
    }

    const brands = await Brand.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    if (brands.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No brands found for the provided subcategory ID(s).",
      });
    }

    res.status(200).json({ status: true, message: "OK", brands });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: "Unable to retrieve brands.",
      error: error.message,
    });
  }
};

module.exports = {
  addBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandsBySubcatId
};

const Rating = require("../../user/model/rating");
const User = require("../../user/model/user");
const Offer = require("../model/offer");
const Product = require("../model/product");
const { DataTypes } = require("sequelize");

let offerBannerColumnReady = false;
const ensureOfferBannerColumn = async () => {
  if (offerBannerColumnReady) return;

  const queryInterface = Offer.sequelize.getQueryInterface();
  const table = await queryInterface.describeTable("offers");

  if (!table.banner) {
    await queryInterface.addColumn("offers", "banner", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

  offerBannerColumnReady = true;
};

const normalizeOfferProductIds = (products) => {
  if (!products) return [];

  let parsedProducts = products;
  if (typeof products === "string") {
    try {
      parsedProducts = JSON.parse(products);
    } catch (error) {
      parsedProducts = products.split(",");
    }
  }

  if (!Array.isArray(parsedProducts)) return [];

  return parsedProducts
    .map((item) => {
      if (item && typeof item === "object") {
        return Number(item.id || item.productId);
      }
      return Number(item);
    })
    .filter(Boolean);
};

const buildOfferProduct = async (productId, userId) => {
  const product = await Product.findByPk(productId);
  if (!product) return null;

  const productJson = product.toJSON();
  const firstVariant = Array.isArray(productJson.varients)
    ? productJson.varients[0]
    : null;
  const mrp = Number(firstVariant?.mrp || 0);
  const sellingPrice = Number(firstVariant?.sellingPrice || 0);
  const discountPercentage =
    mrp > 0 && sellingPrice > 0 ? ((mrp - sellingPrice) / mrp) * 100 : 0;

  const ratings = await Rating.findAll({
    where: { product: product.id },
    order: [["createdAt", "DESC"]],
  });
  const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
  const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

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
    (rating) => rating.user && String(rating.user.id) === String(userId || 0)
  );

  return {
    ...productJson,
    averageRating,
    discountPercentage,
    totalRating,
    ratings: parsedRatings,
    myRating,
  };
};

const buildOfferResponse = async (offer, userId) => {
  const json = offer.toJSON();
  const productIds = normalizeOfferProductIds(json.products);
  const products = await Promise.all(
    productIds.map((productId) => buildOfferProduct(productId, userId))
  );

  json.products = products.filter(Boolean);
  return json;
};

const addOffer = async (req, res) => {
  try {
    await ensureOfferBannerColumn();

    const { name } = req.body;
    const image = req.body.image || req.body.logo;
    const banner = req.body.banner || req.body.bannerImage || image;
    const products = normalizeOfferProductIds(req.body.products);

    if (!name || !image || products.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields." });
    }

    await Offer.create({ name, image, banner, products });
    res.status(201).json({ status: true, message: "Offer added." });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to add offer." });
  }
};

const deleteOffer = async (req, res) => {
  const { id } = req.params;

  try {
    await ensureOfferBannerColumn();

    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res
        .status(404)
        .json({ status: false, message: "Offer not found." });
    }
    await offer.destroy();
    res.status(200).json({ status: true, message: "Offer deleted." });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to delete offer." });
  }
};

const getAllOffers = async (req, res) => {
  try {
    await ensureOfferBannerColumn();

    const offers = await Offer.findAll();
    const finalOffers = await Promise.all(
      offers.map((offer) => buildOfferResponse(offer, req.query.user))
    );

    res.status(200).json({ status: true, offers: finalOffers });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to get offers." });
  }
};

const getOfferById = async (req, res) => {
  const { id } = req.params;

  try {
    await ensureOfferBannerColumn();

    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res
        .status(404)
        .json({ status: false, message: "Offer not found." });
    }

    const json = await buildOfferResponse(offer, req.query.user);

    res.status(200).json({ status: true, offer: json });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to get offer." });
  }
};

module.exports = {
  addOffer,
  deleteOffer,
  getAllOffers,
  getOfferById,
};

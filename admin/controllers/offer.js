const Rating = require("../../user/model/rating");
const User = require("../../user/model/user");
const Offer = require("../model/offer");
const Product = require("../model/product");

const addOffer = async (req, res) => {
  try {
    const { name, image, products } = req.body;

    if (!name || !image || !products) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields." });
    }

    await Offer.create({ name, image, products });
    res.status(201).json({ status: true, message: "Offer added." });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to add offer." });
  }
};

const deleteOffer = async (req, res) => {
  const { id } = req.params;

  try {
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
    const offers = await Offer.findAll();

    const finalOffers = [];
    for (const offer of offers) {
      const json = offer.toJSON();
      const products = [];
      for (const id of json.products) {
        const product = await Product.findByPk(id);
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
            if (rating.user.id == req.query.user || 0) {
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
          products.push(newItem);
        }
      }
      json.products = products;
      finalOffers.push(json);
    }

    res.status(200).json({ status: true, offers: finalOffers });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to get offers." });
  }
};

const getOfferById = async (req, res) => {
  const { id } = req.params;

  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res
        .status(404)
        .json({ status: false, message: "Offer not found." });
    }

    const json = offer.toJSON();
    const products = [];
    for (const id of json.products) {
      const product = await Product.findByPk(id);
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
          if (rating.user.id == req.query.user || 0) {
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
        products.push(newItem);
      }
    }
    json.products = products;

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

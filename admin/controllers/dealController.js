const Deal = require("../model/deal");
const Product = require("../model/product");
const ComboCat = require("../model/comboCat");
const { validationResult } = require("express-validator");
const Rating = require("../../user/model/rating");
const User = require("../../user/model/user");

const addDeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const { type } = req.body;

    if (type !== "Single" && type !== "Combo") {
      return res.status(400).json({
        status: false,
        message: `${type} not allowed in type`,
      });
    }

    const newDeal = await Deal.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Deal added.", deal: newDeal });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to add deal.",
    });
  }
};

const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.findAll({ order: [["createdAt", "DESC"]] });

    const filtered = [];
    for (const deal of deals) {
      if (deal.type === "Single") {
        if (deal.products && deal.products != []) {
          const ids = deal.products;
          const items = [];
          for (const id of ids) {
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

              items.push(newItem);
            }
          }
          deal.products = items;
        } else {
          deal.products = [];
        }

        filtered.push(deal);
      } else if (deal.type === "Combo") {
        if (deal.products && deal.products != []) {
          const ids = deal.products;
          const items = [];
          for (const id of ids) {
            const comboCategory = await ComboCat.findByPk(id);
            if (comboCategory) {
              items.push({
                id: comboCategory.id,
                image: comboCategory.image,
                name: comboCategory.name,
              });
            }
          }
          deal.products = items;
        } else {
          deal.products = [];
        }
        filtered.push(deal);
      }
    }

    res.status(200).json({ status: true, message: "OK", data: filtered });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to retrieve deals.",
    });
  }
};

const updateDeal = async (req, res) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { products } = req.body;

    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({ status: false, message: "Deal not found" });
    }

    var uniqueProducts = [];
    if (deal.products) {
      uniqueProducts = [...new Set([...deal.products, ...products])];
    } else {
      uniqueProducts = [...new Set(products)];
    }

    for (const id of uniqueProducts) {
      if (deal.type === "Single") {
        const validation = await Product.findByPk(id);
        if (!validation) {
          return res
            .status(404)
            .json({ status: false, message: `Product not found of id ${id}` });
        }
      } else {
        const validation = await ComboCat.findByPk(id);
        if (!validation) {
          return res.status(404).json({
            status: false,
            message: `Combo category not found of id ${id}`,
          });
        }
      }
    }

    deal.products = uniqueProducts;
    await deal.save();

    res.status(200).json({ status: true, message: "Deal updated.", deal });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to update deal.",
    });
  }
};

const deleteDeal = async (req, res) => {
  const { id } = req.params;

  try {
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({ status: false, message: "Deal not found" });
    }

    await deal.destroy();
    res.status(200).json({ status: true, message: "Deal deleted." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to delete deal.",
    });
  }
};

const deleteProfuctFromDeal = async (req, res) => {
  const { id, product } = req.params;

  try {
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({ status: false, message: "Deal not found" });
    }

    const products = deal.products;
    const filteredProducts = products.filter((number) => number != product);
    deal.products = filteredProducts;
    await deal.save();
    res.status(200).json({ status: true, message: "Product deleted." });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to delete product.",
    });
  }
};

module.exports = {
  addDeal,
  getAllDeals,
  updateDeal,
  deleteDeal,
  deleteProfuctFromDeal,
};

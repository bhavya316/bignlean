const Product = require("../../admin/model/product");
const Cart = require("../model/cart");
const { validationResult } = require("express-validator");
const Rating = require("../model/rating");

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

const resolveVariantPricing = (variant, selectedFlavour) => {
  const flavors = getVariantFlavorOptions(variant);
  const selectedFlavorData = flavors.find(
    (flavor) => getFlavorLabel(flavor) === selectedFlavour
  );

  if (!selectedFlavorData || typeof selectedFlavorData === "string") {
    return variant;
  }

  return {
    ...variant,
    stock: selectedFlavorData.stock ?? variant.stock,
    mrp: selectedFlavorData.mrp ?? variant.mrp,
    sellingPrice:
      selectedFlavorData.sellingPrice ??
      selectedFlavorData.price ??
      variant.sellingPrice,
    premiumPrice: selectedFlavorData.premiumPrice ?? variant.premiumPrice,
  };
};

const addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const { user, product, qty, varientId, flavour } = req.body;
    const productDetails = await Product.findByPk(product);
    if (!productDetails) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

      // Validate product has variants
      if (!productDetails.varients || !Array.isArray(productDetails.varients) || productDetails.varients.length === 0) {
        return res.status(400).json({
          status: false,
          message: "This product is not available for purchase at the moment.",
        });
      }

      // Find the selected variant
      const selectedVariant = productDetails.varients.find(
        (item) => `${item.id}` === `${varientId}`
      );

      if (!selectedVariant) {
        return res.status(404).json({
          status: false,
          message: "Selected variant is not available for this product.",
        });
      }

      // Validate variant has flavors array
      const flavorOptions = getVariantFlavorOptions(selectedVariant);
      if (!Array.isArray(flavorOptions)) {
        return res.status(400).json({
          status: false,
          message: "No flavors available for this variant.",
        });
      }

      // If no flavor is selected but variants have flavors, use the first one
      let selectedFlavour = flavour;
      if (!flavour && flavorOptions.length > 0) {
        selectedFlavour = getFlavorLabel(flavorOptions[0]);
      }

      // Validate the selected flavor exists
      const selectedFlavorExists = flavorOptions.length === 0 ||
        flavorOptions.some(
          (flavor) => getFlavorLabel(flavor) === selectedFlavour
        );
      if (!selectedFlavorExists) {
        return res.status(404).json({
          status: false,
          message: "Selected flavor is not available for this variant.",
        });
      }

      const selectedVariantPricing = resolveVariantPricing(
        selectedVariant,
        selectedFlavour
      );

      const availableStock = Number(selectedVariantPricing.stock || 0);
      if (availableStock <= 0) {
        return res.status(400).json({
          status: false,
          message: "Selected variant is out of stock.",
        });
      }

      const existingCartItem = await Cart.findOne({
        where: { user, product, varientId, flavour: selectedFlavour },
      });

      if (existingCartItem) {
        const nextQty = existingCartItem.qty + qty;
        if (nextQty > availableStock) {
          return res.status(400).json({
            status: false,
            message: "Requested quantity exceeds available stock.",
          });
        }

        existingCartItem.qty = nextQty;
        existingCartItem.mrp = parseFloat(selectedVariantPricing.mrp || 0);
        existingCartItem.sellingPrice = parseFloat(selectedVariantPricing.sellingPrice || 0);
        existingCartItem.premiumPrice = parseFloat(selectedVariantPricing.premiumPrice || selectedVariantPricing.mrp || 0);
        await existingCartItem.save();
        return res.status(200).json({
          status: true,
          message: "Cart updated successfully.",
          cartItem: existingCartItem,
        });
      }

      // Validate and parse price values
      const mrp = selectedVariantPricing.mrp ? parseFloat(selectedVariantPricing.mrp) : null;
      const sellingPrice = selectedVariantPricing.sellingPrice ? parseFloat(selectedVariantPricing.sellingPrice) : null;
      const premiumPrice = selectedVariantPricing.premiumPrice ? parseFloat(selectedVariantPricing.premiumPrice) : mrp;

      // Validate that at least one price is available
      if (!mrp && !sellingPrice && !premiumPrice) {
        return res.status(400).json({
          status: false,
          message: "Product pricing information is not available. Please try again later.",
        });
      }

      // Create new cart item
      const newCartItem = await Cart.create({
        user,
        product,
        qty,
        varientId,
        flavour: selectedFlavour,
        mrp: mrp,
        sellingPrice: sellingPrice,
        premiumPrice: premiumPrice,
      });

      res.status(201).json({
        status: true,
        message: "Product added to cart successfully.",
        cartItem: newCartItem,
      });
    
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(400).json({
      status: false,
      message: "Unable to add product to cart. Please try again.",
      error: error.message,
    });
  }
};

const updateCartQty = async (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }
  try {
    const cartItem = await Cart.findByPk(id);

    if (!cartItem) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    cartItem.qty = qty;
    await cartItem.save();

    res
      .status(200)
      .json({ status: true, message: "Cart item quantity updated.", cartItem });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to update cart item quantity.",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
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
    const cartItem = await Cart.findByPk(id);

    if (!cartItem) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    await cartItem.destroy();

    res
      .status(200)
      .json({ status: true, message: "Product removed from cart." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to remove product from cart.",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  const { user } = req.params;

  try {
    const cartItems = await Cart.findAll({ where: { user } });

    await Promise.all(
      cartItems.map(async (cartItem) => {
        await cartItem.destroy();
      })
    );

    res.status(200).json({ status: true, message: "Cart cleared." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to clear cart.",
      error: error.message,
    });
  }
};

const getCartByUser = async (req, res) => {
  const { user } = req.params;

  try {
    const cartItems = await Cart.findAll({ where: { user } });

    const filteredList = [];
    for (const item of cartItems) {
      const product = await Product.findByPk(item.product);

      const ratings = await Rating.findAll({
        where: { product: product.id },
      });
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating =
        ratings.length > 0 ? totalRating / ratings.length : 0;
      const discountPercentage =
        ((product.dataValues.price - product.dataValues.sellingPrice) /
          product.dataValues.price) *
        100;
      const newItem = {
        ...product.dataValues,
        averageRating,
        discountPercentage,
      };
      item.product = newItem;

      filteredList.push(item);
    }

    let semilerProduct = [];

    if (filteredList.length > 0) {
      semilerProduct = await Product.findAll({
        where: { catId: filteredList[0].product.catId },
        limit: 5,
        order: [["createdAt", "DESC"]],
      });
    }

    res.status(200).json({
      status: true,
      message: "OK",
      cartItems: filteredList,
      semilerProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve cart items.",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  getCartByUser,
};

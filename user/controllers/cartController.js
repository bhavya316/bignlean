const Product = require("../../admin/model/product");
const ComboProduct = require("../../admin/model/comboProduct");
const Cart = require("../model/cart");
const { validationResult } = require("express-validator");
const Rating = require("../model/rating");

const getFlavorLabel = (flavor) => {
  if (typeof flavor === "string") return flavor;
  return flavor?.name || flavor?.flavor || flavor?.label || "";
};

const firstVariant = (product) => {
  const variants = Array.isArray(product?.varients)
    ? product.varients
    : Array.isArray(product?.dataValues?.varients)
    ? product.dataValues.varients
    : [];
  return variants.length > 0 ? variants[0] : {};
};

const getVariantFlavorOptions = (variant) => {
  if (Array.isArray(variant?.flavors)) return variant.flavors;
  if (Array.isArray(variant?.flavour)) return variant.flavour;
  if (Array.isArray(variant?.flavor)) return variant.flavor;
  return [];
};

const toBoolean = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

const isComboCartSignal = ({ isCombo, varientId, flavour }) => {
  const normalizedFlavour = String(flavour || "").toLowerCase();
  return (
    toBoolean(isCombo) ||
    normalizedFlavour === "combo" ||
    (Number(varientId) === 0 && normalizedFlavour !== "")
  );
};

const buildComboVariant = (productDetails, cartItem = {}) => ({
  id: 0,
  mrp: String(cartItem.mrp ?? productDetails.mrp ?? 0),
  sellingPrice: String(
    cartItem.sellingPrice ?? productDetails.sellingPrice ?? productDetails.price ?? 0
  ),
  premiumPrice: String(
    cartItem.premiumPrice ??
      productDetails.price ??
      productDetails.sellingPrice ??
      productDetails.mrp ??
      0
  ),
  price: String(cartItem.sellingPrice ?? productDetails.price ?? productDetails.sellingPrice ?? 0),
  units: "Combo",
  stock: "999",
  date: productDetails.expiry_date || "",
  flavor: ["Combo"],
});

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
    const { user, product, qty, varientId, flavour, isCombo: isComboInput } = req.body;

    const isCombo = isComboCartSignal({ isCombo: isComboInput, varientId, flavour });
    const selectedVarientId = isCombo ? 0 : varientId;
    let productDetails;
    if (isCombo) {
      productDetails = await ComboProduct.findByPk(product);
      if (!productDetails) {
        productDetails = await Product.findByPk(product);
      }
    } else {
      productDetails = await Product.findByPk(product);
    }
    if (!productDetails) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    let mrp, sellingPrice, premiumPrice, selectedFlavour;

    if (isCombo) {
      const comboVariant = firstVariant(productDetails);
      mrp = parseFloat(productDetails.mrp ?? comboVariant.mrp ?? 0);
      sellingPrice = parseFloat(
        productDetails.sellingPrice ??
          productDetails.price ??
          comboVariant.sellingPrice ??
          comboVariant.premiumPrice ??
          comboVariant.price ??
          0
      );
      premiumPrice = parseFloat(
        productDetails.price ?? comboVariant.premiumPrice ?? mrp
      );
      selectedFlavour = "Combo";
    } else {
      if (!productDetails.varients || !Array.isArray(productDetails.varients) || productDetails.varients.length === 0) {
        return res.status(400).json({
          status: false,
          message: "This product is not available for purchase at the moment.",
        });
      }

      const selectedVariant = productDetails.varients.find(
        (item) => `${item.id}` === `${selectedVarientId}`
      );

      if (!selectedVariant) {
        return res.status(404).json({
          status: false,
          message: "Selected variant is not available for this product.",
        });
      }

      const flavorOptions = getVariantFlavorOptions(selectedVariant);
      if (!Array.isArray(flavorOptions)) {
        return res.status(400).json({
          status: false,
          message: "No flavors available for this variant.",
        });
      }

      selectedFlavour = flavour;
      if (!flavour && flavorOptions.length > 0) {
        selectedFlavour = getFlavorLabel(flavorOptions[0]);
      }

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

      mrp = selectedVariantPricing.mrp ? parseFloat(selectedVariantPricing.mrp) : null;
      sellingPrice = selectedVariantPricing.sellingPrice ? parseFloat(selectedVariantPricing.sellingPrice) : null;
      premiumPrice = selectedVariantPricing.premiumPrice ? parseFloat(selectedVariantPricing.premiumPrice) : mrp;

      if (!mrp && !sellingPrice && !premiumPrice) {
        return res.status(400).json({
          status: false,
          message: "Product pricing information is not available. Please try again later.",
        });
      }
    }

    const existingCartItem = await Cart.findOne({
      where: { user, product, varientId: selectedVarientId, flavour: selectedFlavour },
    });

    if (existingCartItem) {
      existingCartItem.qty = existingCartItem.qty + qty;
      existingCartItem.mrp = mrp;
      existingCartItem.sellingPrice = sellingPrice;
      existingCartItem.premiumPrice = premiumPrice;
      await existingCartItem.save();
      return res.status(200).json({
        status: true,
        message: "Cart updated successfully.",
        cartItem: existingCartItem,
      });
    }

    const newCartItem = await Cart.create({
      user, product, qty, varientId: selectedVarientId,
      flavour: selectedFlavour,
      mrp, sellingPrice, premiumPrice,
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
      const isComboItem = isComboCartSignal(item);
      let product;
      if (isComboItem) {
        product = await ComboProduct.findByPk(item.product);
        if (!product) {
          product = await Product.findByPk(item.product);
        }
      } else {
        product = await Product.findByPk(item.product);
      }
      if (!product) continue;

      const newItem = { ...product.dataValues };

      if (isComboItem) {
        const comboVariant = firstVariant(product);
        newItem.mrp = Number(product.mrp ?? comboVariant.mrp ?? item.mrp ?? 0);
        newItem.sellingPrice = Number(
          product.sellingPrice ??
            product.price ??
            comboVariant.sellingPrice ??
            comboVariant.premiumPrice ??
            comboVariant.price ??
            item.sellingPrice ??
            0
        );
        newItem.price = Number(product.price ?? newItem.sellingPrice ?? 0);
        newItem.isCombo = true;
        newItem.averageRating = 0;
        newItem.discountPercentage = newItem.mrp > 0 && newItem.sellingPrice > 0
          ? ((newItem.mrp - newItem.sellingPrice) / newItem.mrp) * 100 : 0;
        newItem.varients = [buildComboVariant(newItem, item)];
      } else {
        const ratings = await Rating.findAll({ where: { product: product.id } });
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
        newItem.averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
        const firstVariant = Array.isArray(product.varients) && product.varients[0] || {};
        newItem.discountPercentage =
          ((parseInt(firstVariant.mrp) - parseInt(firstVariant.sellingPrice)) /
            parseInt(firstVariant.mrp)) * 100 || 0;
      }
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

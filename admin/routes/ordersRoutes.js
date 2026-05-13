// const express = require("express");
// const router = express.Router();
// const Order = require("../../user/model/order");
// const Address = require("../../user/model/address");
// const User = require("../../user/model/user");
// const Product = require("../model/product");

// function formatDate(inputDate) {
//   const date = new Date(inputDate);
//   const options = { weekday: "short", day: "numeric", month: "short" };
//   const formattedDate = date.toLocaleDateString("en-US", options);
//   return formattedDate;
// }

// router.get("/orders", async (req, res) => {
//   try {
//     const orders = await Order.findAll();
//     const active = [];
//     const completed = [];
//     for (const order of orders) {
//       const productIds = order.product;
//       const productQty = order.qty;
//       let finalProductList = [];

//       for (var i = 0; i < productIds.length; i++) {
//         const product = await Product.findByPk(productIds[i]);
//         console.log(productIds[i]);
//         if (product) {
//           const newProduct = {
//             ...product.dataValues,
//             qty: productQty[i],
//           };
//           finalProductList.push(newProduct);
//         }
//       }

//       delete order.qty;
//       delete order.usedCoupon;
//       delete order.coupon;
//       delete order.amount;
//       delete order.updatedAt;
//       order.product = finalProductList;
//       const orderDate = formatDate(order.createdAt);
//       order.createdAt = orderDate;

//       order.address = await Address.findByPk(order.address);
//       order.user = await User.findByPk(order.user);

//       if (order.status == "Completed") {
//         completed.push(order);
//       } else {
//         active.push(order);
//       }
//     }

//     res.status(200).json({ status: true, message: "OK", active, completed });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Order = require("../../user/model/order");
const Address = require("../../user/model/address");
const User = require("../../user/model/user");
const Product = require("../model/product");
const ComboProduct = require("../model/comboProduct");

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { weekday: "short", day: "numeric", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

const parseAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const getFlavorLabel = (flavor) => {
  if (flavor == null) return "";
  if (typeof flavor === "string" || typeof flavor === "number") return String(flavor);
  return String(flavor.name || flavor.flavor || flavor.label || "");
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

const getOrderItemProductId = (orderItem, fallbackId) =>
  orderItem?.productId || orderItem?.product || orderItem?.id || fallbackId;

const isComboOrderItem = (orderItem = {}) => {
  const flavour = String(orderItem.flavour || orderItem.flavor || "").toLowerCase();
  return orderItem.isCombo === true || flavour === "combo" || (Number(orderItem.varientId) === 0 && flavour !== "");
};

const getVariantPrice = (product, orderItem = {}) => {
  if (isComboOrderItem(orderItem)) {
    const firstVariant =
      Array.isArray(product?.varients) && product.varients.length > 0
        ? product.varients[0]
        : {};
    const mrp = parseAmount(orderItem.mrp ?? product.mrp ?? firstVariant.mrp);
    const sellingPrice = parseAmount(
      orderItem.sellingPrice ??
        product.sellingPrice ??
        product.price ??
        firstVariant.sellingPrice ??
        firstVariant.premiumPrice ??
        firstVariant.price
    );
    const premiumPrice = parseAmount(
      orderItem.premiumPrice ?? product.price ?? firstVariant.premiumPrice ?? sellingPrice ?? mrp
    );
    const unitPrice = parseAmount(orderItem.unitPrice) || sellingPrice || premiumPrice || mrp;
    const variant = {
      id: 0,
      units: "Combo",
      stock: 999,
      mrp,
      sellingPrice,
      premiumPrice,
      price: sellingPrice || premiumPrice || mrp,
      flavor: ["Combo"],
    };

    return {
      mrp,
      sellingPrice: sellingPrice || premiumPrice || mrp,
      premiumPrice,
      unitPrice,
      variant,
      flavour: "Combo",
      units: "Combo",
    };
  }

  const variants = Array.isArray(product?.varients) ? product.varients : [];
  const requestedVariantId =
    orderItem.varientId || orderItem.variantId || orderItem.variant?.id;
  const variant =
    variants.find((item) => `${item.id}` === `${requestedVariantId}`) ||
    variants[0] ||
    {};
  const selectedFlavour = orderItem.flavour || orderItem.flavor;
  const variantPricing = resolveVariantPricing(variant, selectedFlavour);
  const mrp = parseAmount(orderItem.mrp ?? variantPricing.mrp);
  const sellingPrice = parseAmount(
    orderItem.sellingPrice ?? variantPricing.sellingPrice ?? variantPricing.price
  );
  const premiumPrice = parseAmount(orderItem.premiumPrice ?? variantPricing.premiumPrice);
  const unitPrice = parseAmount(orderItem.unitPrice) || sellingPrice || premiumPrice || mrp;

  return {
    mrp,
    sellingPrice: sellingPrice || premiumPrice || mrp,
    premiumPrice,
    unitPrice,
    variant,
    flavour: selectedFlavour || getFlavorLabel(getVariantFlavorOptions(variant)[0]),
    units: orderItem.units || variant.units || "",
  };
};

const buildVariantSummary = (pricing) => {
  const parts = [];
  if (pricing.units) parts.push(`Variant: ${pricing.units}`);
  if (pricing.flavour) parts.push(`Flavor: ${pricing.flavour}`);
  if (pricing.unitPrice) parts.push(`Unit price: ₹${pricing.unitPrice}`);
  if (pricing.mrp) parts.push(`MRP: ₹${pricing.mrp}`);
  return parts.join(" | ");
};

const withVariantDetails = (details, summary) => {
  const existingDetails = Array.isArray(details) ? details : [];
  if (!summary) return existingDetails;
  const firstDetail = existingDetails[0] || {};
  return [
    {
      ...firstDetail,
      heading: firstDetail.heading || "Variant",
      body: [summary, firstDetail.body].filter(Boolean).join(" | "),
    },
    ...existingDetails.slice(1),
  ];
};

const buildOrderSummary = (order) => {
  const subtotal = parseAmount(order.amount);
  const couponDiscount = parseAmount(order.couponDiscount);
  const walletDiscount = parseAmount(order.bglCash);
  const shipping = parseAmount(order.shiping);
  const payable = Math.max(0, parseAmount(order.totalAmount) + shipping);

  return {
    subtotal,
    couponDiscount,
    walletDiscount,
    shipping,
    payable,
    totalAmount: parseAmount(order.totalAmount),
    earnedBglCash: parseAmount(order.earnedBglCash),
  };
};

// router.get("/orders", async (req, res) => {
//   try {
//     // Fetch orders sorted by createdAt in descending order
//     const orders = await Order.findAll({
//       order: [['createdAt', 'DESC']]
//     });
//     const active = [];
//     const completed = [];
//     for (const order of orders) {
//       const productIds = order.product;
//       const productQty = order.qty;
//       let finalProductList = [];

//       for (let i = 0; i < productIds.length; i++) {
//         const product = await Product.findByPk(productIds[i]);
//         console.log(productIds[i]);
//         if (product) {
//           const newProduct = {
//             ...product.dataValues,
//             qty: productQty[i],
//           };
//           finalProductList.push(newProduct);
//         }
//       }

//       delete order.qty;
//       delete order.usedCoupon;
//       delete order.coupon;
//       delete order.amount;
//       delete order.updatedAt;
//       order.product = finalProductList;
//       const orderDate = formatDate(order.createdAt);
//       order.createdAt = orderDate;

//       order.address = await Address.findByPk(order.address);
//       order.user = await User.findByPk(order.user);

//       if (order.status === "Completed") {
//         completed.push(order);
//       } else {
//         active.push(order);
//       }
//     }

//     res.status(200).json({ status: true, message: "OK", active, completed });
//   } catch (error) {
//     console.error("Error in /orders endpoint:", error.message, error.stack);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

router.get("/orders", async (req, res) => {
  try {
    // Fetch orders sorted by createdAt in descending order
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });

    // Process orders in parallel to improve performance
    const orderPromises = orders.map(async (order) => {
      const productIds = order.product || []; // Ensure product is an array
      const productQty = order.qty || []; // Ensure qty is an array
      const orderItems = Array.isArray(order.items) ? order.items : [];
      const itemSource = orderItems.length
        ? orderItems
        : productIds.map((productId, index) => ({
            productId,
            qty: productQty[index],
          }));

      // Fetch products in parallel
      const productPromises = itemSource.map(async (orderItem, index) => {
        const id = getOrderItemProductId(orderItem, productIds[index]);
        let isCombo = isComboOrderItem(orderItem);
        let product = isCombo
          ? await ComboProduct.findByPk(id)
          : await Product.findByPk(id);
        if (isCombo && !product) {
          product = await Product.findByPk(id);
        }
        if (!isCombo && !product) {
          product = await ComboProduct.findByPk(id);
          isCombo = Boolean(product);
        }
        if (!product) return null;

        const productData = product.toJSON();
        const qty = parseAmount(orderItem.qty || productQty[index] || 0);
        const pricing = getVariantPrice(productData, orderItem);
        const lineAmount = parseAmount(orderItem.lineTotal || orderItem.amount) || pricing.unitPrice * qty;
        const variantSummary = buildVariantSummary(pricing);

        return {
          ...productData,
          isCombo,
          productType: isCombo ? "combo" : "product",
          details: withVariantDetails(productData.details, variantSummary),
          qty,
          amount: lineAmount,
          lineTotal: lineAmount,
          unitPrice: pricing.unitPrice,
          sellingPrice: pricing.sellingPrice,
          mrp: pricing.mrp,
          premiumPrice: pricing.premiumPrice,
          selectedVariant: pricing.variant,
          selectedVariantId: orderItem.varientId || orderItem.variantId || pricing.variant?.id,
          selectedFlavour: pricing.flavour,
          selectedFlavor: pricing.flavour,
          selectedUnits: pricing.units,
          weight: isCombo ? "Combo" : productData.weight,
          flavor: isCombo ? "Combo" : productData.flavor,
          varients: isCombo ? [pricing.variant] : productData.varients,
          createdAt: order.createdAt,
        };
      });

      const products = (await Promise.all(productPromises)).filter((p) => p !== null);

      const orderJson = order.toJSON();
      const orderSummary = buildOrderSummary(orderJson);
      const { updatedAt, ...orderData } = orderJson;

      // Format order with necessary data
      orderData.product = products;
      orderData.createdAt = order.createdAt;
      orderData.formattedCreatedAt = formatDate(order.createdAt);
      orderData.subtotalAmount = orderSummary.subtotal;
      orderData.amount = orderSummary.payable;
      orderData.finalAmount = orderSummary.payable;
      orderData.orderSummary = orderSummary;
      orderData.payableAmount = orderSummary.payable;
      orderData.walletDiscount = orderSummary.walletDiscount;
      orderData.shippingCharge = orderSummary.shipping;
      orderData.address = await Address.findByPk(order.address);
      orderData.user = await User.findByPk(order.user);

      return orderData;
    });

    const processedOrders = await Promise.all(orderPromises);
    const active = [];
    const completed = [];

    processedOrders.forEach((orderData) => {
      if (orderData.status === "Delivered") {
        completed.push(orderData);
      } else {
        active.push(orderData);
      }
    });

    res.status(200).json({ status: true, message: "OK", active, completed });
  } catch (error) {
    console.error("Error in /orders endpoint:", error.message, error.stack);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;

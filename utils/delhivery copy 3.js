
const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../user/model/user");
const Address = require("../user/model/address");
const Cart = require("../user/model/cart");
const Subscription = require("../user/model/subscription");
const Order = require("../user/model/order");
const Product = require("../admin/model/product");
const Coupon = require("../admin/model/coupon");
const { generateRandomId } = require("./functions");
const { addTransaction } = require("../user/controllers/transactionController");

async function loginUserAndGetToken(retries = 3, delay = 1000) {
  const apiUrl = "https://shipment.xpressbees.com/api/users/login";

  const requestData = {
    email: "orders@bignlean.com",
    password: "Carry@2525",
  };

  const headers = {
    "Content-Type": "application/json",
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(apiUrl, requestData, {
        headers,
        timeout: 15000, // Increased timeout to 15 seconds
      });
      console.log("Login response:", JSON.stringify(response.data, null, 2));
      if (response && response.data && response.data.data) {
        const token = response.data.data;
        return token;
      } else {
        console.error(`Attempt ${attempt}: Unexpected response:`, response.data);
        throw new Error("Failed to get token from the API.");
      }
    } catch (error) {
      console.error(`Attempt ${attempt}: Error during API call:`, {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      if (attempt < retries) {
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`Failed to make API call after ${retries} attempts: ${error.message}`);
    }
  }
}

async function getCourierServiceabilityDetails(
  origin,
  destination,
  paymentType,
  orderAmount,
  weight,
  token
) {
  console.log("Weight for serviceability:", weight);
  const apiUrl = "https://shipment.xpressbees.com/api/courier/serviceability";

  const requestData = {
    origin: origin,
    destination: destination,
    payment_type: paymentType,
    order_amount: orderAmount,
    weight: weight ?? 500,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(apiUrl, requestData, { headers, timeout: 15000 });
    if (response && response.data) {
      const serviceabilityDetails = response.data;
      return serviceabilityDetails;
    } else {
      console.error("Unexpected response:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error during API call:", error.message, error.response?.data);
    return [];
  }
}

async function manifestShipments(awbs, token) {
  const apiUrl = "https://shipment.xpressbees.com/api/shipments2/manifest";

  const requestData = {
    awbs: [awbs],
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(apiUrl, JSON.stringify(requestData), {
      headers,
      timeout: 15000,
    });
    console.log("Manifest response:", response.data);
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false };
    }
  } catch (error) {
    console.error("Error during API call:", error.message, error.response?.data);
    return { status: false };
  }
}

async function calculateCartDetails(user, coupon, addressId) {
  try {
    const userData = await User.findByPk(user);
    const cartItems = await Cart.findAll({ where: { user } });
    const subscription = await Subscription.findOne({ where: { user } });
    let userAddress = {};
    if (addressId == 0) {
      userAddress = await Address.findOne({ where: { isDefault: true } });
    } else {
      userAddress = await Address.findByPk(addressId);
    }

    if (!userData) {
      throw new Error("User or address not found.");
    }

    const isPremium = subscription != null;
    let totalPrice = 0;
    let totalWeight = 0;
    let totalDiscount = 0;
    let totalCouponDiscount = 0;

    for (const cartItem of cartItems) {
      const product = await Product.findByPk(cartItem.product);

      if (product) {
        const varients = product.varients;
        const selectedVariant = varients.find(
          (item) => `${item.id}` === `${cartItem.varientId}`
        );
        if (!selectedVariant) {
          console.log(`Variant ${cartItem.varientId} not found for product ${cartItem.product}`);
          continue;
        }
        const productPrice = isPremium
          ? parseInt(selectedVariant.premiumPrice || 0)
          : parseInt(selectedVariant.sellingPrice || 0);
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (Number(selectedVariant.weight) || 100) * cartItem.qty;
        totalDiscount +=
          parseInt(selectedVariant.mrp || 0) * cartItem.qty -
          parseInt(selectedVariant.sellingPrice || 0) * cartItem.qty;
      }
    }

    if (coupon) {
      const couponDetails = await Coupon.findOne({ where: { coupon } });

      if (couponDetails) {
        if (couponDetails.category === "Price-wise") {
          totalPrice -= parseFloat(couponDetails.discount);
          totalCouponDiscount = parseFloat(couponDetails.discount);
        } else {
          totalCouponDiscount =
            (totalPrice * parseFloat(couponDetails.discount)) / 100;
          totalPrice -= (totalPrice * parseFloat(couponDetails.discount)) / 100;
        }
      }
    }

    let shippingCharge = totalPrice >= 1000 ? 0 : 80;

    try {
      const token = await loginUserAndGetToken();
      if (userAddress) {
        const pincode = parseInt(userAddress.pincode, 10);
        if (isNaN(pincode)) {
          console.log("Invalid pincode:", userAddress.pincode);
          throw new Error("Invalid pincode in address");
        }

        const codData = await getCourierServiceabilityDetails(
          "421204",
          pincode,
          "prepaid",
          totalPrice,
          totalWeight,
          token
        );

        if (codData && codData.data && codData.data.length > 0) {
          shippingCharge = codData.data[0].total_charges;
          console.log("Using API shipping charge:", shippingCharge);
        } else {
          console.log("Using default shipping charge:", shippingCharge);
        }
      }
    } catch (error) {
      console.log("Error getting shipping charge, using default:", error.message);
    }

    let canUseBGLCash = false;
    let afterUseBGLCash = totalPrice;

    if (totalPrice >= 3000) {
      canUseBGLCash = true;
      afterUseBGLCash = totalPrice - userData.bglCash;
    }

    return {
      status: true,
      totalAmount: totalPrice,
      shiping: shippingCharge,
      discount: totalDiscount + totalCouponDiscount,
      couponDiscount: totalCouponDiscount,
      canUseBGLCash,
      afterUseBGLCash,
      isPremium,
    };
  } catch (error) {
    console.log("Calculate cart details error:", error.message);
    return { status: false, message: "Something went wrong: " + error.message };
  }
}

async function trackShipment(awb, token) {
  const apiUrl = `https://shipment.xpressbees.com/api/shipments2/track/${awb}`;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers, timeout: 15000 });
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false, message: "Record not found" };
    }
  } catch (error) {
    console.error("Error during API call:", error.message, error.response?.data);
    return { status: false, message: "Record not found" };
  }
}

async function createShipment(
  orderNumber,
  shippingCharges,
  discount,
  codCharges,
  paymentType,
  orderAmount,
  packageWeight,
  packageLength,
  packageBreadth,
  packageHeight,
  requestAutoPickup,
  consignee,
  pickup,
  orderItems,
  courierId,
  collectableAmount,
  authToken
) {
  const apiUrl = "https://shipment.xpressbees.com/api/shipments2";

  const requestData = {
    order_number: orderNumber,
    shipping_charges: shippingCharges,
    discount: discount,
    cod_charges: codCharges,
    payment_type: paymentType,
    order_amount: orderAmount,
    package_weight: packageWeight,
    package_length: packageLength,
    package_breadth: packageBreadth,
    package_height: packageHeight,
    request_auto_pickup: requestAutoPickup,
    consignee: consignee,
    pickup: pickup,
    order_items: orderItems,
    courier_id: courierId,
    collectable_amount: collectableAmount,
  };
  console.log("Shipment request data:", JSON.stringify(requestData, null, 2));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.post(apiUrl, requestData, { headers, timeout: 15000 });
    console.log("Shipment response:", JSON.stringify(response.data, null, 2));
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false, message: "Unexpected response from API" };
    }
  } catch (error) {
    console.error("Error during shipment API call:", {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
    });
    return { status: false, message: error.message, details: error.response?.data };
  }
}

async function countWeight(productIds, qty, variantIds) {
  let weight = 0;
  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const product = await Product.findByPk(productId);
    if (product && product.varients && product.varients.length > 0) {
      let selectedVariant;
      if (variantIds && Array.isArray(variantIds) && variantIds[i]) {
        selectedVariant = product.varients.find((v) => `${v.id}` === `${variantIds[i]}`);
      } else {
        selectedVariant = product.varients[0];
      }
      if (selectedVariant) {
        const variantWeight = Number(selectedVariant.weight);
        if (!isNaN(variantWeight) && variantWeight > 0) {
          weight += variantWeight * (qty[i] || 1);
        } else {
          console.log(`Product ${productId} variant ${variantIds ? variantIds[i] : 'first'} has invalid weight (${selectedVariant.weight}), using default 100g`);
          weight += 100 * (qty[i] || 1); // Default weight
        }
      } else {
        console.log(`Product ${productId} has no valid variant, using default weight 100g`);
        weight += 100 * (qty[i] || 1); // Default weight
      }
    } else {
      console.log(`Product ${productId} not found or has no variants, using default weight 100g`);
      weight += 100 * (qty[i] || 1); // Default weight
    }
  }
  if (isNaN(weight) || weight <= 0) {
    console.log("Calculated weight is invalid, using default 500g");
    weight = 500; // Fallback default weight
  }
  return weight;
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { weekday: "short", day: "numeric", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

function getRandomNumber(maxValue) {
  return Math.floor(Math.random() * maxValue) + 1;
}

router.get("/pinServiceability", async (req, res) => {
  const { input, productPrice } = req.query;

  if (!input || !productPrice) {
    return res
      .status(400)
      .json({ status: false, message: "Pincode and price is required" });
  }

  try {
    const token = await loginUserAndGetToken();
    const codData = await getCourierServiceabilityDetails(
      "421204",
      input,
      "cod",
      productPrice,
      10,
      token
    );
    if (codData != null && codData.data.length !== 0) {
      res.status(200).json({
        status: true,
        isAvailable: true,
        cod: true,
        message: "Success",
      });
    } else {
      const preData = await getCourierServiceabilityDetails(
        "421204",
        input,
        "prepaid",
        productPrice,
        10,
        token
      );
      if (preData != null && preData.data.length !== 0) {
        res.status(200).json({
          status: true,
          isAvailable: true,
          cod: false,
          message: "Success",
        });
      } else {
        res.status(200).json({
          status: true,
          isAvailable: false,
          message: "Success",
        });
      }
    }
  } catch (error) {
    console.error("Pin serviceability error:", error.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

router.get("/invoiceCharges", async (req, res) => {
  const awb = req.query.awb;
  if (!awb) {
    return res.status(400).json({ status: false, message: "awb is Required" });
  }
  try {
    const token = await loginUserAndGetToken();
    const response = await manifestShipments(awb, token);
    if (response.status) {
      res.status(200).json(response);
    } else {
      res
        .status(404)
        .json({ status: false, message: "No record Found", data: null });
    }
  } catch (e) {
    console.error("Invoice charges error:", e.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

router.post("/placeOrder", async (req, res) => {
  try {
    const {
      userid,
      addressid,
      couponCode,
      paymentMethod,
      transactionId,
      bglCash,
    } = req.body;

    console.log("Order request payload:", req.body);

    if (!userid || !addressid || !paymentMethod) {
      return res.status(400).json({
        status: false,
        message: "user, address and payment method is required",
      });
    }

    if (paymentMethod !== "COD" && !transactionId) {
      return res.status(400).json({
        status: false,
        message: "user, address, payment method and transactionId is required",
      });
    }

    const user = await User.findByPk(userid);
    const address = await Address.findByPk(addressid);
    const cartItems = await Cart.findAll({ where: { user: userid } });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }
    if (cartItems.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "User's cart is empty." });
    }
    if (!address) {
      return res
        .status(404)
        .json({ status: false, message: "Address not found." });
    }

    let amount = 0;
    let shiping = 0;
    const itemsIDList = [];
    const qtyList = [];
    const variantIds = [];

    for (const item of cartItems) {
      const product = await Product.findByPk(item.product);
      if (product) {
        itemsIDList.push(item.product);
        qtyList.push(item.qty);
        variantIds.push(item.varientId);
      }
    }

    if (itemsIDList.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No valid products in cart" });
    }

    let cartDetails;
    try {
      console.log("Attempting primary calculation method...");
      cartDetails = await calculateCartDetails(userid, couponCode, addressid);
      console.log("Primary calculation succeeded");
    } catch (calcError) {
      console.log("Primary calculation failed:", calcError.message);
      return res.status(400).json({
        status: false,
        message: "Failed to calculate cart details",
      });
    }

    if (!cartDetails.status) {
      return res.status(400).json(cartDetails);
    }

    amount = cartDetails.totalAmount || 0;

    shiping = cartDetails.shiping;
    if (isNaN(shiping) || shiping === null || shiping === undefined) {
      shiping = amount >= 1000 ? 0 : 80;
      console.log("Using fallback shipping charge:", shiping);
    }

    let usedCoupon = false;
    let couponId = 0;
    let couponDis = 0;
    let couponDiscount = cartDetails.couponDiscount || 0;
    let validCoupon = null;

    if (couponCode) {
      validCoupon = await Coupon.findOne({ where: { coupon: couponCode } });
      if (!validCoupon) {
        return res
          .status(400)
          .json({ status: false, message: "Coupon not Found" });
      }
      if (validCoupon.qty < 1) {
        return res
          .status(400)
          .json({ status: false, message: "Coupon not Available" });
      }
      if (validCoupon.category !== "Price-wise") {
        couponDis = validCoupon.discount;
      } else {
        const discountPercentage = validCoupon.discount;
        const discountAmount = (amount * discountPercentage) / 100;
        couponDis = discountAmount;
      }
      usedCoupon = true;
      couponId = validCoupon.id;
      await validCoupon.update({ qty: validCoupon.qty - 1 });
    }

    const orderID = generateRandomId();
    let usedBGLCash = false;
    let usedBGL = 0;
    if (bglCash) {
      usedBGLCash = true;
      usedBGL = bglCash;
    }

    const gotBGLCash = getRandomNumber(cartDetails.isPremium ? 5 : 10);

    const totalAmount = amount - couponDis - usedBGL;
    const body = {
      user: userid,
      product: itemsIDList,
      variantIds, // Store variant IDs
      address: addressid,
      usedCoupon,
      coupon: couponId,
      couponDiscount: couponDiscount || 0,
      amount,
      qty: qtyList,
      paymentMethod,
      transactionId: transactionId ?? null,
      usedBGLCash,
      usedBGL: usedBGL || 0,
      bglCash: usedBGL || 0,
      earnedBglCash: gotBGLCash || 0,
      shiping,
      totalAmount: totalAmount || 0,
      orderID,
      status: "Processing",
    };

    try {
      console.log("Creating order with data:", {
        ...body,
        shipping: shiping,
        totalAmount,
      });
      await Order.create(body);
      await Cart.destroy({ where: { user: userid } });
      await addTransaction(userid, orderID, "Order Placed", "in", gotBGLCash);

      return res.status(200).json({
        status: true,
        message: "Order Placed",
        earnedBglCash: gotBGLCash,
        orderId: orderID,
      });
    } catch (orderError) {
      console.error("Error creating order:", orderError.message);
      if (validCoupon) {
        await validCoupon.update({ qty: validCoupon.qty + 1 });
      }
      return res.status(500).json({
        status: false,
        message: "Failed to create order: " + orderError.message,
      });
    }
  } catch (error) {
    console.error("Order placement error:", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

async function calculateCartDetailsFallback(user, coupon, addressId) {
  try {
    const userData = await User.findByPk(user);
    const cartItems = await Cart.findAll({ where: { user } });
    const subscription = await Subscription.findOne({ where: { user } });
    let userAddress = {};

    if (addressId == 0) {
      userAddress = await Address.findOne({ where: { user, isDefault: true } });
    } else {
      userAddress = await Address.findByPk(addressId);
    }

    if (!userData) {
      return { status: false, message: "User not found" };
    }

    if (cartItems.length === 0) {
      return { status: false, message: "Cart is empty" };
    }

    const isPremium = subscription != null;
    let totalPrice = 0;
    let totalDiscount = 0;
    let totalCouponDiscount = 0;
    let totalWeight = 0;

    for (const cartItem of cartItems) {
      const product = await Product.findByPk(cartItem.product);

      if (product) {
        const varients = product.varients;
        const selectedVariant = varients.find(
          (item) => `${item.id}` === `${cartItem.varientId}`
        );
        if (!selectedVariant) {
          console.log(`Variant ${cartItem.varientId} not found for product ${cartItem.product}`);
          continue;
        }
        const productPrice = isPremium
          ? parseInt(selectedVariant.premiumPrice || 0)
          : parseInt(selectedVariant.sellingPrice || 0);
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (Number(selectedVariant.weight) || 100) * cartItem.qty;
        totalDiscount +=
          parseInt(selectedVariant.mrp || 0) * cartItem.qty -
          parseInt(selectedVariant.sellingPrice || 0) * cartItem.qty;
      }
    }

    if (coupon) {
      const couponDetails = await Coupon.findOne({ where: { coupon } });

      if (couponDetails) {
        if (couponDetails.qty < 1) {
          return { status: false, message: "Coupon is not available" };
        }

        if (couponDetails.category === "Price-wise") {
          totalCouponDiscount = parseFloat(couponDetails.discount);
          totalPrice -= totalCouponDiscount;
        } else {
          totalCouponDiscount =
            (totalPrice * parseFloat(couponDetails.discount)) / 100;
          totalPrice -= totalCouponDiscount;
        }
      }
    }

    const shippingCharge = totalPrice >= 1000 ? 0 : 80;

    let canUseBGLCash = false;
    let afterUseBGLCash = totalPrice;

    if (totalPrice >= 3000) {
      canUseBGLCash = true;
      afterUseBGLCash = totalPrice - userData.bglCash;
    }

    return {
      status: true,
      totalAmount: totalPrice,
      shiping: shippingCharge,
      discount: totalDiscount,
      couponDiscount: totalCouponDiscount,
      canUseBGLCash,
      afterUseBGLCash,
      isPremium,
    };
  } catch (error) {
    console.error("Fallback cart calculation error:", error.message);
    return { status: false, message: "Something went wrong with cart calculation: " + error.message };
  }
}

router.get("/cart/details", async (req, res) => {
  const user = req.query.user;
  const coupon = req.query.coupon;
  const addressId = req.query.addressId;

  if (!user) {
    return res.status(400).json({
      status: false,
      message: "user id is Required",
    });
  }

  try {
    try {
      const cartDetails = await calculateCartDetails(user, coupon, addressId ?? 0);
      return res.status(200).json(cartDetails);
    } catch (calcError) {
      console.log("Primary calculation failed, using fallback:", calcError.message);
      const fallbackDetails = await calculateCartDetailsFallback(
        user,
        coupon,
        addressId ?? 0
      );
      return res.status(200).json(fallbackDetails);
    }
  } catch (e) {
    console.error("Cart details error:", e.message);
    res.status(500).json({ status: false, message: "Server Error: " + e.message });
  }
});

router.delete("/order/cancel/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(200).json({
        status: false,
        message: "Order not Found with gived ID",
      });
    }

    await order.update({ status: "Cancelled" });
    await addTransaction(
      order.user,
      order.orderID,
      "Order Cancelled",
      "out",
      order.earnedBglCash
    );
    res.status(200).json({ status: true, message: "Order Cancelled" });
  } catch (error) {
    console.error("Order cancel error:", error.message);
    res.status(500).json({ status: false, message: "Internal Server Error: " + error.message });
  }
});

router.get("/order/user/:user", async (req, res) => {
  try {
    const user = req.params.user;
    const orders = await Order.findAll({ where: { user } });
    let ordersList = [];
    for (const order of orders) {
      const productIds = order.product;
      const productQty = order.qty;
      let finalProductList = [];

      for (let i = 0; i < productIds.length; i++) {
        const product = await Product.findByPk(productIds[i]);
        if (product) {
          const newProduct = { ...product.dataValues, qty: productQty[i] };
          finalProductList.push(newProduct);
        }
      }

      delete order.dataValues.qty;
      delete order.dataValues.usedCoupon;
      delete order.dataValues.coupon;
      delete order.dataValues.amount;
      delete order.dataValues.usedBGLCash;
      delete order.dataValues.updatedAt;
      order.dataValues.product = finalProductList;
      const orderDate = formatDate(order.createdAt);
      order.dataValues.createdAt = orderDate;
      ordersList.push(order.dataValues);
    }

    res.status(200).json({ status: true, message: "OK", orders: ordersList });
  } catch (e) {
    console.error("Order user error:", e.message);
    res.status(500).json({ status: false, message: "Server Error: " + e.message });
  }
});

router.get("/order/track/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const ordersDetails = await Order.findByPk(id);
    if (!ordersDetails) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }
    const orders = ordersDetails.toJSON();
    const token = await loginUserAndGetToken();
    const productIds = orders.product;
    const productQty = orders.qty;
    let finalProductList = [];

    for (let i = 0; i < productIds.length; i++) {
      const product = await Product.findByPk(productIds[i]);
      if (product) {
        const newProduct = { ...product.dataValues, qty: productQty[i] };
        finalProductList.push(newProduct);
      }
    }

    delete orders.qty;
    delete orders.usedCoupon;
    delete orders.coupon;
    delete orders.amount;
    delete orders.usedBGLCash;
    delete orders.updatedAt;
    orders.product = finalProductList;
    const orderDate = formatDate(orders.createdAt);
    orders.createdAt = orderDate;
    if (orders.status === "Processing") {
      return res
        .status(200)
        .json({ status: true, isAccepted: false, order: orders });
    }
    const response = await trackShipment(orders.trackingID, token);
    response.orderDetails = orders;
    response.isAccepted = true;
    res.status(200).json(response);
  } catch (e) {
    console.error("Order track error:", e.message);
    res.status(500).json({ status: false, message: "Server Error: " + e.message });
  }
});

router.put("/order/accept/:id", async (req, res) => {
  req.setTimeout(60000, () => {
    console.log("Request timed out");
    res.status(504).json({ status: false, message: "Request timed out" });
  });

  try {
    console.log(`Processing order accept for id: ${req.params.id}`);
    const id = req.params.id;
    console.log("Fetching order...");
    const order = await Order.findByPk(id);
    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    if (!order.product || !Array.isArray(order.product) || order.product.length === 0) {
      console.log("Invalid or empty product list");
      return res.status(400).json({ status: false, message: "Invalid product list" });
    }
    if (!order.qty || !Array.isArray(order.qty) || order.qty.length !== order.product.length) {
      console.log("Invalid or mismatched quantity list");
      return res.status(400).json({ status: false, message: "Invalid quantity list" });
    }

    console.log("Fetching auth token...");
    let token;
    try {
      token = await loginUserAndGetToken();
      console.log("Token retrieved");
    } catch (error) {
      console.error("Failed to get token:", error.message);
      // Fallback for testing: Skip shipment creation
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Skipping shipment creation");
        await order.update({ status: "PP", trackingID: `TEST-${order.orderID}` });
        return res.status(200).json({
          status: true,
          message: "Success (Development mode: Simulated shipment)",
        });
      }
      throw error;
    }

    console.log("Fetching address...");
    const address = await Address.findByPk(order.address);
    if (!address) {
      console.log("Address not found");
      return res.status(404).json({ status: false, message: "Address not found" });
    }

    // Validate address data
    if (!address.pincode || isNaN(parseInt(address.pincode)) || address.pincode.length < 6) {
      console.log("Invalid pincode:", address.pincode);
      return res.status(400).json({ status: false, message: "Invalid pincode in address" });
    }
    if (!address.phone || !/^\d{10}$/.test(address.phone)) {
      console.log("Invalid phone:", address.phone);
      return res.status(400).json({ status: false, message: "Invalid phone number in address" });
    }

    console.log("Calculating discount and collectable amount...");
    const discount = order.amount - order.totalAmount;
    const collectableAmount = order.paymentMethod === "COD" ? order.totalAmount : 0;

    console.log("Preparing consignee and pickup data...");
    const consignee = {
      name: address.name,
      address: address.flat,
      address_2: address.landmark,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
    };

    const pickup = {
      warehouse_name: "BIGNLEAN.COM",
      name: "BIGNLEAN.COM",
      address: "SHOP NO. 16/17 LODHA FRESHIA BUILDING , KALYAN SHIL ROAD, NILJE LODHA",
      address_2: "SHOP NO. 16/17 LODHA FRESHIA BUILDING , KALYAN SHIL ROAD, NILJE LODHA",
      city: "DOMBIVALI, THANE",
      state: "MAHARASHTRA",
      pincode: "421204",
      phone: "9399369854",
    };

    console.log("Building order items...");
    let orderItems = [];
    for (let i = 0; i < order.product.length; i++) {
      const product = await Product.findByPk(order.product[i]);
      if (!product) {
        console.log(`Product ${order.product[i]} not found, skipping`);
        continue;
      }
      let selectedVariant = product.varients && product.varients.length > 0 ? product.varients[0] : null;
      if (order.variantIds && Array.isArray(order.variantIds) && order.variantIds[i]) {
        selectedVariant = product.varients.find((v) => `${v.id}` === `${order.variantIds[i]}`);
      }
      if (!selectedVariant) {
        console.log(`No valid variant for product ${order.product[i]}, skipping`);
        continue;
      }
      const sellingPrice = Number(selectedVariant.sellingPrice);
      if (isNaN(sellingPrice) || sellingPrice <= 0) {
        console.log(`Invalid sellingPrice for product ${order.product[i]} variant ${order.variantIds ? order.variantIds[i] : 'first'}, using default 100`);
        return res.status(400).json({
          status: false,
          message: `Invalid sellingPrice for product ${order.product[i]}`,
        });
      }
      const details = {
        name: product.dataValues.name,
        qty: order.qty[i],
        price: sellingPrice,
      };
      orderItems.push(details);
    }

    if (orderItems.length === 0) {
      console.log("No valid products found");
      return res.status(400).json({ status: false, message: "No valid products found" });
    }

    console.log("Calculating weight...");
    const weight = await countWeight(order.product, order.qty, order.variantIds);
    if (isNaN(weight) || weight <= 0) {
      console.log("Invalid weight calculated:", weight, "for products:", order.product);
      return res.status(400).json({
        status: false,
        message: "Invalid weight",
        details: `Failed to calculate weight for products: ${order.product.join(", ")}`,
      });
    }
    console.log("Weight:", weight);

    console.log("Creating shipment...");
    const response = await createShipment(
      order.orderID,
      order.shiping,
      discount,
      0,
      order.paymentMethod === "COD" ? "cod" : "prepaid",
      order.totalAmount,
      weight,
      10,
      10,
      10,
      "yes",
      consignee,
      pickup,
      orderItems,
      "1",
      collectableAmount,
      token
    );

    console.log("Shipment response:", response);
    if (response.status === true && response.data && response.data.awb_number) {
      console.log("Updating order status and tracking ID...");
      await order.update({ status: "PP", trackingID: response.data.awb_number });
      console.log("Order updated successfully");
      return res.status(200).json({ status: true, message: "Success" });
    } else {
      console.log("Shipment creation failed:", response);
      return res.status(400).json({
        status: false,
        message: "Shipment creation failed",
        details: response,
      });
    }
  } catch (e) {
    console.error("Error in /order/accept:", e.message, e.stack);
    return res.status(500).json({
      status: false,
      message: "Server Error: " + e.message,
      error: e.message,
    });
  }
});

module.exports = router;
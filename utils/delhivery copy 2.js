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

async function loginUserAndGetToken() {
  const apiUrl = "https://shipment.xpressbees.com/api/users/login";

  const requestData = {
    email: "orders@bignlean.com",
    password: "Carry@2525",
  };

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(apiUrl, requestData, { headers });

    if (response && response.data && response.data.data) {
      const token = response.data.data;
      return token;
    } else {
      console.error("Unexpected response:", response.data);
      throw new Error("Failed to get token from the API.");
    }
  } catch (error) {
    console.error("Error during API call:", error.message);
    throw new Error("Failed to make API call.");
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
  console.log(weight);
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
    const response = await axios.post(apiUrl, requestData, { headers });

    if (response && response.data) {
      const serviceabilityDetails = response.data;
      return serviceabilityDetails;
    } else {
      console.error("Unexpected response:", response.data);
      return [];
    }
  } catch (error) {
    console.error(error);
    console.error("Error during API call:", error.message);
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
    });
    console.log(response);
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false };
    }
  } catch (error) {
    console.error("Error during API call:", error.message);
    return { status: false };
  }
}

// Update the calculateCartDetails function with better error handling
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
    var totalPrice = 0;
    var totalWeight = 0;
    var totalDiscount = 0;
    var totalCouponDiscount = 0;

    for (const cartItem of cartItems) {
      const product = await Product.findByPk(cartItem.product);

      if (product) {
        const varients = product.varients;
        const selectedVariant = varients.find(
          (item) => `${item.id}` === `${cartItem.varientId}`
        );
        const productPrice = isPremium
          ? parseInt(selectedVariant.premiumPrice)
          : parseInt(selectedVariant.sellingPrice);
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (selectedVariant.weight ?? 100) * cartItem.qty;
        totalDiscount +=
          parseInt(selectedVariant.mrp) * cartItem.qty -
          parseInt(selectedVariant.sellingPrice) * cartItem.qty;
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

    const token = await loginUserAndGetToken();

    // Initialize shipping charge with a default value
    let shippingCharge = totalPrice >= 1000 ? 0 : 80;
    
    try {
      if (userAddress) {
        // Convert pincode to integer
        const pincode = parseInt(userAddress.pincode, 10);
        
        const codData = await getCourierServiceabilityDetails(
          "421204",
          pincode, // Use numeric pincode
          "prepaid",
          totalPrice,
          totalWeight,
          token
        );
        
        // Only use API shipping charge if data is available
        if (codData && codData.data && codData.data.length > 0) {
          shippingCharge = codData.data[0].total_charges;
          console.log("Using API shipping charge:", shippingCharge);
        } else {
          console.log("Using default shipping charge:", shippingCharge);
        }
      }
    } catch (error) {
      // If API call fails, use default shipping logic
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
    console.log(error);
    return { status: false, message: "Something went wrong" };
  }
}

async function trackShipment(awb, token) {
  const apiUrl = `https://shipment.xpressbees.com/api/shipments2/track/${awb}`;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false, message: "Record not found" };
    }
  } catch (error) {
    console.error("Error during API call:", error.message);
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
  console.log(requestData);
  console.log(authToken);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.post(apiUrl, requestData, { headers });

    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false };
    }
  } catch (error) {
    console.error("Error during API call:", error.message);
    return { status: false };
  }
}

function countWeight(products) {
  let weight;
  for (const product of products) {
    weight += product.weight;
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
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

router.get("/invoiceCharges", async (req, res) => {
  const awb = req.query.awb;
  if (!awb) {
    return res.status(404).json({ status: false, message: "awb is Required" });
  }
  try {
    const token = await loginUserAndGetToken();
    const response = await manifestShipments(awb, token);
    if (response.status) {
      res.status(404).json(response);
    } else {
      res
        .status(404)
        .json({ status: false, message: "No record Found", data: null });
    }
  } catch (e) {
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

    if (paymentMethod != "COD") {
      if (!transactionId) {
        return res.status(400).json({
          status: false,
          message:
            "user, address, payment method and transactionId is required",
        });
      }
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

    var amount = 0;
    var shiping = 0;
    const itemsIDList = [];
    const qtyList = [];
    for (const item of cartItems) {
      const product = await Product.findByPk(item.product);
      if (product) {
        itemsIDList.push(item.product);
        qtyList.push(item.qty);
      }
    }

    // Try primary calculation method first, fallback if it fails
    let cartDetails;
    try {
      console.log("Attempting primary calculation method...");
      cartDetails = await calculateCartDetails(
        userid,
        couponCode,
        addressid
      );
      console.log("Primary calculation succeeded");
    } catch (calcError) {
      console.log("Primary calculation failed:", calcError);
      return res.status(400).json({ 
        status: false, 
        message: "Failed to calculate cart details" 
      });
    }
    
    if (!cartDetails.status) {
      return res.status(400).json(cartDetails);
    }
    
    amount = cartDetails.totalAmount || 0;
    
    // Ensure shipping is a valid number
    shiping = cartDetails.shiping;
    if (isNaN(shiping) || shiping === null || shiping === undefined) {
      shiping = amount >= 1000 ? 0 : 80; // Default shipping logic
      console.log("Using fallback shipping charge:", shiping);
    }

    var usedCoupon = false;
    var couponId = 0;
    var couponDis = 0;
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
      bglCash: usedBGL || 0, // Also set bglCash field
      earnedBglCash: gotBGLCash || 0,
      shiping, // This will now always be a number
      totalAmount: totalAmount || 0,
      orderID,
      status: "Processing"
    };
    
    try {
      console.log("Creating order with data:", {
        ...body,
        shipping: shiping,
        totalAmount
      });
      await Order.create(body);
      await Cart.destroy({ where: { user: userid } });
      await addTransaction(userid, orderID, "Order Placed", "in", gotBGLCash);
      
      return res.status(200).json({
        status: true,
        message: "Order Placed",
        earnedBglCash: gotBGLCash,
        orderId: orderID
      });
    } catch (orderError) {
      console.error("Error creating order:", orderError);
      
      // If the coupon was decremented but order failed, increment it back
      if (validCoupon) {
        await validCoupon.update({ qty: validCoupon.qty + 1 });
      }
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to create order: " + orderError.message 
      });
    }
  } catch (error) {
    console.log("Order placement error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

// Add this fallback calculation function after calculateCartDetails
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
    var totalPrice = 0;
    var totalDiscount = 0;
    var totalCouponDiscount = 0;
    var totalWeight = 0;

    for (const cartItem of cartItems) {
      const product = await Product.findByPk(cartItem.product);

      if (product) {
        const varients = product.varients;
        const selectedVariant = varients.find(
          (item) => `${item.id}` === `${cartItem.varientId}`
        );
        const productPrice = isPremium
          ? parseInt(selectedVariant.premiumPrice)
          : parseInt(selectedVariant.sellingPrice);
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (selectedVariant.weight ?? 100) * cartItem.qty;
        totalDiscount +=
          parseInt(selectedVariant.mrp) * cartItem.qty -
          parseInt(selectedVariant.sellingPrice) * cartItem.qty;
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

    // Use flat shipping rates instead of API
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
    console.log(error);
    return { status: false, message: "Something went wrong with cart calculation" };
  }
}

// Replace your cart/details endpoint with this one
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
      // Try primary calculation first
      const cartDetails = await calculateCartDetails(
        user,
        coupon,
        addressId ?? 0
      );
      return res.status(200).json(cartDetails);
    } catch (calcError) {
      console.log("Primary calculation failed, using fallback:", calcError);
      // If primary fails, use the fallback
      const fallbackDetails = await calculateCartDetailsFallback(
        user,
        coupon,
        addressId ?? 0
      );
      return res.status(200).json(fallbackDetails);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server Error" });
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
    res.status(200).json({ status: true, message: "Order Cancalled" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
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

      for (var i = 0; i < productIds.length; i++) {
        const product = await Product.findByPk(productIds[i]);
        if (product) {
          const newProduct = { ...product.dataValues, qty: productQty[i] };
          finalProductList.push(newProduct);
        }
      }

      delete order.qty;
      delete order.usedCoupon;
      delete order.coupon;
      delete order.amount;
      delete order.usedBGLCash;
      delete order.updatedAt;
      order.product = finalProductList;
      const orderDate = formatDate(order.createdAt);
      order.createdAt = orderDate;
      ordersList.push(order);
    }

    res.status(200).json({ status: true, message: "OK", orders: ordersList });
  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.get("/order/track/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const ordersDetails = await Order.findByPk(id);
    const orders = ordersDetails.toJSON();
    const token = await loginUserAndGetToken();
    const productIds = orders.product;
    const productQty = orders.qty;
    let finalProductList = [];

    for (var i = 0; i < productIds.length; i++) {
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
    if (orders.status == "Processing") {
      return res
        .status(200)
        .json({ status: true, isAccepted: false, order: orders });
    }
    const response = trackShipment(orders.trackingID, token);
    response.orderDetails = orders;
    response.isAccepted = true;
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.put("/order/accept/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id);
    if (!order) {
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    }

    const token = await loginUserAndGetToken();
    const discount = order.amount - order.totalAmount;
    const collectableAmount =
      order.paymentMethod == "COD" ? order.totalAmount : 0;
    const weight = countWeight(order.product);
    const address = await Address.findByPk(order.address);
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
      address:
        "SHOP NO. 16/17 LODHA FRESHIA BUILDING , KALYAN SHIL ROAD, NILJE LODHA",
      address_2:
        "SHOP NO. 16/17 LODHA FRESHIA BUILDING , KALYAN SHIL ROAD, NILJE LODHA",
      city: "DOMBIVALI, THANE",
      state: "MAHARASHTRA",
      pincode: "421204",
      phone: "9399369854",
    };
    let orderItems = [];

    for (let i = 0; i < order.product.length; i++) {
      const product = await Product.findByPk(order.product[i]);
      const details = {
        name: product.dataValues.name,
        qty: order.qty[i],
        price: product.dataValues.sellingPrice,
      };
      orderItems.push(details);
    }

    const response = await createShipment(
      order.orderID,
      order.shiping,
      discount,
      0,
      order.paymentMethod == "COD" ? "cod" : "prepaid",
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

    if (response.status == true) {
      order.status = "PP";
      order.trackingID = response.data.awb_number;
      await order.save();
      res.status(200).json({ status: true, message: "Success" });
    } else {
      res.status(400).json({ status: false, message: "Somthing went wrong" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

module.exports = router;

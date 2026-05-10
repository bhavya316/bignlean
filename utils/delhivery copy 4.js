const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../user/model/user");
const Address = require("../user/model/address");
const Cart = require("../user/model/cart");
const Subscription = require("../user/model/subscription");
const Order = require("../user/model/order");
const Transaction = require("../user/model/transaction")
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
        
        if (!selectedVariant) {
          console.log(`Variant ${cartItem.varientId} not found for product ${cartItem.product}`);
          continue;
        }
        
        // Safely parse price values with fallbacks
        const mrp = selectedVariant.mrp ? parseInt(selectedVariant.mrp) || 0 : 0;
        const sellingPrice = selectedVariant.sellingPrice ? parseInt(selectedVariant.sellingPrice) || 0 : 0;
        const premiumPrice = selectedVariant.premiumPrice ? parseInt(selectedVariant.premiumPrice) || 0 : 0;
        
        const productPrice = isPremium
          ? premiumPrice || sellingPrice || mrp
          : sellingPrice || premiumPrice || mrp;
          
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (selectedVariant.weight ?? 100) * cartItem.qty;
        totalDiscount += (mrp * cartItem.qty) - (sellingPrice * cartItem.qty);
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
    shipping_charges: shippingCharges || 0,
    discount: discount || 0,
    cod_charges: codCharges || 0,
    payment_type: paymentType,
    order_amount: orderAmount,
    package_weight: packageWeight || 500,
    package_length: packageLength || 10,
    package_breadth: packageBreadth || 10,
    package_height: packageHeight || 10,
    request_auto_pickup: requestAutoPickup,
    consignee: consignee,
    pickup: pickup,
    order_items: orderItems,
    courier_id: courierId || "1",
    collectable_amount: collectableAmount || 0,
  };

  console.log("Shipment request data:", JSON.stringify(requestData, null, 2));
  console.log("Auth token:", authToken ? "Present" : "Missing");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  try {
    console.log("Making API call to:", apiUrl);
    const response = await axios.post(apiUrl, requestData, { 
      headers,
      timeout: 30000 // 30 second timeout
    });

    console.log("API response status:", response.status);
    console.log("API response data:", JSON.stringify(response.data, null, 2));

    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response structure:", response);
      return { 
        status: false, 
        message: "Invalid response from shipping API",
        details: response.data 
      };
    }
  } catch (error) {
    console.error("Error during shipment API call:", error.message);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      return { 
        status: false, 
        message: "Shipping API error",
        details: {
          status: error.response.status,
          data: error.response.data
        }
      };
    } else if (error.request) {
      console.error("No response received from API");
      return { 
        status: false, 
        message: "No response from shipping API",
        details: { request: "No response received" }
      };
    } else {
      return { 
        status: false, 
        message: "Error setting up shipment request",
        details: { error: error.message }
      };
    }
  }
}

async function countWeight(productIds) {
  let weight = 0;
  try {
    for (const productId of productIds) {
      const product = await Product.findByPk(productId);
      if (product && product.varients && Array.isArray(product.varients) && product.varients.length > 0) {
        // Get weight from first variant, default to 100g if not available
        const firstVariant = product.varients[0];
        const variantWeight = firstVariant.weight ? parseFloat(firstVariant.weight) || 100 : 100;
        weight += variantWeight;
      } else {
        weight += 100; // Default weight per product
      }
    }
  } catch (error) {
    console.log("Error calculating weight:", error.message);
    // Return default weight if calculation fails
    weight = productIds.length * 100;
  }
  return weight || 500; // Return at least 500g
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

// router.post("/placeOrder", async (req, res) => {
//   try {
//     const {
//       userid,
//       addressid,
//       couponCode,
//       paymentMethod,
//       transactionId,
//       bglCash,
//     } = req.body;

//     console.log("Order request payload:", req.body);

//     if (!userid || !addressid || !paymentMethod) {
//       return res.status(400).json({
//         status: false,
//         message: "user, address and payment method is required",
//       });
//     }

//     if (paymentMethod != "COD") {
//       if (!transactionId) {
//         return res.status(400).json({
//           status: false,
//           message:
//             "user, address, payment method and transactionId is required",
//         });
//       }
//     }

//     const user = await User.findByPk(userid);
//     const address = await Address.findByPk(addressid);
//     const cartItems = await Cart.findAll({ where: { user: userid } });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ status: false, message: "User not found." });
//     }
//     if (cartItems.length === 0) {
//       return res
//         .status(404)
//         .json({ status: false, message: "User's cart is empty." });
//     }
//     if (!address) {
//       return res
//         .status(404)
//         .json({ status: false, message: "Address not found." });
//     }

//     var amount = 0;
//     var shiping = 0;
//     const itemsIDList = [];
//     const qtyList = [];
//     for (const item of cartItems) {
//       const product = await Product.findByPk(item.product);
//       if (product) {
//         itemsIDList.push(item.product);
//         qtyList.push(item.qty);
//       }
//     }

//     // Try primary calculation method first, fallback if it fails
//     let cartDetails;
//     try {
//       console.log("Attempting primary calculation method...");
//       cartDetails = await calculateCartDetails(
//         userid,
//         couponCode,
//         addressid
//       );
//       console.log("Primary calculation succeeded");
//     } catch (calcError) {
//       console.log("Primary calculation failed:", calcError);
//       return res.status(400).json({ 
//         status: false, 
//         message: "Failed to calculate cart details" 
//       });
//     }
    
//     if (!cartDetails.status) {
//       return res.status(400).json(cartDetails);
//     }
    
//     amount = cartDetails.totalAmount || 0;
    
//     // Ensure shipping is a valid number
//     shiping = cartDetails.shiping;
//     if (isNaN(shiping) || shiping === null || shiping === undefined) {
//       shiping = amount >= 1000 ? 0 : 80; // Default shipping logic
//       console.log("Using fallback shipping charge:", shiping);
//     }

//     var usedCoupon = false;
//     var couponId = 0;
//     var couponDis = 0;
//     let couponDiscount = cartDetails.couponDiscount || 0;
//     let validCoupon = null;

//     if (couponCode) {
//       validCoupon = await Coupon.findOne({ where: { coupon: couponCode } });
//       if (!validCoupon) {
//         return res
//           .status(400)
//           .json({ status: false, message: "Coupon not Found" });
//       }
//       if (validCoupon.qty < 1) {
//         return res
//           .status(400)
//           .json({ status: false, message: "Coupon not Available" });
//       }
//       if (validCoupon.category !== "Price-wise") {
//         couponDis = validCoupon.discount;
//       } else {
//         const discountPercentage = validCoupon.discount;
//         const discountAmount = (amount * discountPercentage) / 100;
//         couponDis = discountAmount;
//       }
//       usedCoupon = true;
//       couponId = validCoupon.id;
//       await validCoupon.update({ qty: validCoupon.qty - 1 });
//     }

//     const orderID = generateRandomId();
//     let usedBGLCash = false;
//     let usedBGL = 0;
//     if (bglCash) {
//       usedBGLCash = true;
//       usedBGL = bglCash;
//     }

//     const gotBGLCash = getRandomNumber(cartDetails.isPremium ? 5 : 10);

//     const totalAmount = amount - couponDis - usedBGL;
//     const body = {
//       user: userid,
//       product: itemsIDList,
//       address: addressid,
//       usedCoupon,
//       coupon: couponId,
//       couponDiscount: couponDiscount || 0,
//       amount,
//       qty: qtyList,
//       paymentMethod,
//       transactionId: transactionId ?? null,
//       usedBGLCash,
//       usedBGL: usedBGL || 0,
//       bglCash: usedBGL || 0, // Also set bglCash field
//       earnedBglCash: gotBGLCash || 0,
//       shiping, // This will now always be a number
//       totalAmount: totalAmount || 0,
//       orderID,
//       status: "Processing"
//     };
    
//     try {
//       console.log("Creating order with data:", {
//         ...body,
//         shipping: shiping,
//         totalAmount
//       });
//       await Order.create(body);
//       await Cart.destroy({ where: { user: userid } });
//       await addTransaction(userid, orderID, "Order Placed", "in", gotBGLCash);
      
//       return res.status(200).json({
//         status: true,
//         message: "Order Placed",
//         earnedBglCash: gotBGLCash,
//         orderId: orderID
//       });
//     } catch (orderError) {
//       console.error("Error creating order:", orderError);
      
//       // If the coupon was decremented but order failed, increment it back
//       if (validCoupon) {
//         await validCoupon.update({ qty: validCoupon.qty + 1 });
//       }
      
//       return res.status(500).json({ 
//         status: false, 
//         message: "Failed to create order: " + orderError.message 
//       });
//     }
//   } catch (error) {
//     console.log("Order placement error:", error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Internal Server Error" });
//   }
// });




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
      return res.status(404).json({ status: false, message: "User not found." });
    }
    if (cartItems.length === 0) {
      return res.status(404).json({ status: false, message: "User's cart is empty." });
    }
    if (!address) {
      return res.status(404).json({ status: false, message: "Address not found." });
    }

    let amount = 0;
    let shiping = 0;
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
      cartDetails = await calculateCartDetails(userid, couponCode, addressid);
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

    let usedCoupon = false;
    let couponId = 0;
    let couponDis = 0;
    let couponDiscount = cartDetails.couponDiscount || 0;
    let validCoupon = null;

    if (couponCode) {
      validCoupon = await Coupon.findOne({ where: { coupon: couponCode } });
      if (!validCoupon) {
        return res.status(400).json({ status: false, message: "Coupon not Found" });
      }
      if (validCoupon.qty < 1) {
        return res.status(400).json({ status: false, message: "Coupon not Available" });
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

    // Loyalty redemption eligibility and limits
    const walletBalance = await Transaction.calculateFinalValueForUser(userid);
    const isCartEligibleForRedemption = amount >= 3000;

    if (bglCash && Number(bglCash) > 0) {
      if (!isCartEligibleForRedemption) {
        return res.status(400).json({
          status: false,
          message: "Minimum cart value for redemption is ₹3,000",
        });
      }
      if (walletBalance < 500) {
        return res.status(400).json({
          status: false,
          message: "Minimum 500 Bignlean Coins required to redeem",
        });
      }
      if (bglCash > walletBalance) {
        return res.status(400).json({
          status: false,
          message: `Insufficient Bignlean Coins. Available: ${walletBalance}`,
        });
      }
      // Do not allow redemption to exceed payable product amount (excluding shipping)
      const maxRedeemable = Math.max(0, amount - couponDis);
      if (bglCash > maxRedeemable) {
        return res.status(400).json({
          status: false,
          message: `You can redeem up to ₹${maxRedeemable} on this order`,
        });
      }
      usedBGLCash = true;
      usedBGL = Math.floor(Number(bglCash));
    }

    // Static earning: 10 coins per ₹1000 spent on eligible amount (excluding discounts/shipping)
    const eligibleSpend = amount; // already excludes discounts per calculateCartDetails
    const earnedCoins = Math.floor(eligibleSpend / 1000) * 10;
    const totalAmount = amount - couponDis - usedBGL;

    const orderData = {
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
      bglCash: usedBGL || 0,
      earnedBglCash: earnedCoins || 0,
      shiping,
      totalAmount: totalAmount || 0,
      orderID,
      status: "Processing"
    };

    try {
      console.log("Creating order with data:", {
        ...orderData,
        shipping: shiping,
        totalAmount
      });
      const order = await Order.create(orderData);
      await Cart.destroy({ where: { user: userid } });
      if (earnedCoins > 0) {
        await addTransaction(userid, order.id, "Bignlean Cash Earned", "in", earnedCoins);
      }

      // If usedBGLCash is true, create a transaction for BGL cash usage
      if (usedBGLCash) {
        // Use the requested bglCash as the transaction value
        await Transaction.create({
          user: userid,
          orderId: order.id,
          title: "BGL Cash Used for Order",
          type: "out",
          value: usedBGL
        });
      }

      return res.status(200).json({
        status: true,
        message: "Order Placed",
        earnedBglCash: earnedCoins,
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
    return res.status(500).json({ status: false, message: "Internal Server Error" });
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
        
        if (!selectedVariant) {
          console.log(`Variant ${cartItem.varientId} not found for product ${cartItem.product}`);
          continue;
        }
        
        // Safely parse price values with fallbacks
        const mrp = selectedVariant.mrp ? parseInt(selectedVariant.mrp) || 0 : 0;
        const sellingPrice = selectedVariant.sellingPrice ? parseInt(selectedVariant.sellingPrice) || 0 : 0;
        const premiumPrice = selectedVariant.premiumPrice ? parseInt(selectedVariant.premiumPrice) || 0 : 0;
        
        const productPrice = isPremium
          ? premiumPrice || sellingPrice || mrp
          : sellingPrice || premiumPrice || mrp;
          
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (selectedVariant.weight ?? 100) * cartItem.qty;
        totalDiscount += (mrp * cartItem.qty) - (sellingPrice * cartItem.qty);
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
    console.log(`Processing order accept for id: ${req.params.id}`);
    const id = req.params.id;
    
    // Find the order
    const order = await Order.findByPk(id);
    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ 
        status: false, 
        message: "Order not found with given ID" 
      });
    }

    // Check if order is already processed
    if (order.status !== "Processing") {
      return res.status(400).json({
        status: false,
        message: `Order is already ${order.status}`
      });
    }

    // Get address details
    const address = await Address.findByPk(order.address);
    if (!address) {
      console.log("Address not found");
      return res.status(404).json({
        status: false,
        message: "Shipping address not found"
      });
    }

    // Calculate weight with fallback
    let weight = 500; // Default weight in grams
    try {
      weight = await countWeight(order.product) || 500;
    } catch (weightErr) {
      console.log("Error calculating weight, using default:", weightErr.message);
    }

    // Prepare shipping details
    const discount = order.amount - order.totalAmount;
    const collectableAmount = order.paymentMethod === "COD" ? order.totalAmount : 0;
    
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

    // Prepare order items
    let orderItems = [];
    try {
      for (let i = 0; i < order.product.length; i++) {
        const product = await Product.findByPk(order.product[i]);
        if (product) {
          // Get price from variants - use the first variant's selling price
          let price = 0;
          if (product.varients && Array.isArray(product.varients) && product.varients.length > 0) {
            const firstVariant = product.varients[0];
            price = firstVariant.sellingPrice ? parseFloat(firstVariant.sellingPrice) || 0 : 0;
          }
          
          // If no price found in variants, use a default price
          if (price === 0) {
            price = 100; // Default price if no variant price available
            console.log(`No price found for product ${product.id}, using default: ${price}`);
          }
          
          const details = {
            name: product.dataValues.name,
            qty: order.qty[i],
            price: price,
          };
          orderItems.push(details);
        }
      }
    } catch (itemErr) {
      console.log("Error preparing order items:", itemErr.message);
      return res.status(400).json({
        status: false,
        message: "Error preparing order items"
      });
    }

    // Try to create shipment
    try {
      console.log("Getting auth token...");
      const token = await loginUserAndGetToken();
      console.log("Auth token received successfully");
      
      console.log("Creating shipment with data:", {
        orderID: order.orderID,
        shipping: order.shiping,
        discount: discount,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        weight: weight,
        orderItemsCount: orderItems.length,
        collectableAmount: collectableAmount
      });
      
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

      console.log("Shipment API response:", JSON.stringify(response, null, 2));

      if (response && response.status === true && response.data && response.data.awb_number) {
        // Success - update order with tracking info
        await order.update({
          status: "PP",
          trackingID: response.data.awb_number
        });
        
        console.log("Order updated successfully with tracking ID:", response.data.awb_number);
        return res.status(200).json({ 
          status: true, 
          message: "Order accepted and shipment created successfully",
          order: {
            id: order.id,
            status: "PP",
            orderID: order.orderID,
            trackingID: response.data.awb_number
          }
        });
      } else {
        // Shipment creation failed but still accept the order
        console.log("Shipment creation failed, response:", response);
        await order.update({ status: "Accepted" });
        
        return res.status(200).json({
          status: true,
          message: "Order accepted but shipment creation failed",
          order: {
            id: order.id,
            status: "Accepted",
            orderID: order.orderID
          },
          shippingError: response?.message || "Could not create shipment with courier service",
          details: response
        });
      }
    } catch (shippingError) {
      console.error("Shipping API error:", shippingError.message);
      console.error("Error stack:", shippingError.stack);
      
      // Still accept the order even if shipping integration fails
      await order.update({ status: "Accepted" });
      
      return res.status(200).json({
        status: true,
        message: "Order accepted but shipping setup failed",
        order: {
          id: order.id,
          status: "Accepted",
          orderID: order.orderID
        },
        shippingError: shippingError.message
      });
    }
  } catch (e) {
    console.error("Order accept error:", e.message, e.stack);
    return res.status(500).json({ 
      status: false, 
      message: "Server Error: " + e.message
    });
  }
});

// Simple endpoint to manually accept order without shipment creation
router.put("/order/accept-simple/:id", async (req, res) => {
  try {
    console.log(`Simple order accept for id: ${req.params.id}`);
    const id = req.params.id;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ 
        status: false, 
        message: "Order not found with given ID" 
      });
    }

    if (order.status !== "Processing") {
      return res.status(400).json({
        status: false,
        message: `Order is already ${order.status}`
      });
    }

    // Simply update the order status to Accepted
    await order.update({ status: "Accepted" });
    
    console.log("Order status updated to Accepted");
    return res.status(200).json({ 
      status: true, 
      message: "Order accepted successfully",
      order: {
        id: order.id,
        status: "Accepted",
        orderID: order.orderID
      }
    });
  } catch (e) {
    console.error("Simple order accept error:", e.message, e.stack);
    return res.status(500).json({ 
      status: false, 
      message: "Server Error: " + e.message
    });
  }
});

// Endpoint to manually create shipment for an already accepted order
router.post("/order/create-shipment/:id", async (req, res) => {
  try {
    console.log(`Creating shipment for order id: ${req.params.id}`);
    const id = req.params.id;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ 
        status: false, 
        message: "Order not found with given ID" 
      });
    }

    if (order.status === "Processing") {
      return res.status(400).json({
        status: false,
        message: "Order must be accepted first before creating shipment"
      });
    }

    if (order.trackingID) {
      return res.status(400).json({
        status: false,
        message: "Order already has a tracking ID"
      });
    }

    // Get address details
    const address = await Address.findByPk(order.address);
    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Shipping address not found"
      });
    }

    // Calculate weight
    let weight = 500;
    try {
      weight = await countWeight(order.product) || 500;
    } catch (weightErr) {
      console.log("Error calculating weight, using default:", weightErr.message);
    }

    // Prepare shipping details
    const discount = order.amount - order.totalAmount;
    const collectableAmount = order.paymentMethod === "COD" ? order.totalAmount : 0;
    
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

    // Prepare order items
    let orderItems = [];
    for (let i = 0; i < order.product.length; i++) {
      const product = await Product.findByPk(order.product[i]);
      if (product) {
        let price = 0;
        if (product.varients && Array.isArray(product.varients) && product.varients.length > 0) {
          const firstVariant = product.varients[0];
          price = firstVariant.sellingPrice ? parseFloat(firstVariant.sellingPrice) || 0 : 0;
        }
        if (price === 0) price = 100;
        
        const details = {
          name: product.dataValues.name,
          qty: order.qty[i],
          price: price,
        };
        orderItems.push(details);
      }
    }

    // Create shipment
    const token = await loginUserAndGetToken();
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

    if (response && response.status === true && response.data && response.data.awb_number) {
      await order.update({
        status: "PP",
        trackingID: response.data.awb_number
      });
      
      return res.status(200).json({ 
        status: true, 
        message: "Shipment created successfully",
        order: {
          id: order.id,
          status: "PP",
          orderID: order.orderID,
          trackingID: response.data.awb_number
        }
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Failed to create shipment",
        details: response
      });
    }
  } catch (e) {
    console.error("Create shipment error:", e.message, e.stack);
    return res.status(500).json({ 
      status: false, 
      message: "Server Error: " + e.message
    });
  }
});


router.put("/order/Complete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Find the order by ID
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    // Update order status to Delivered
    await order.update({ status: "Delivered" });

    // Static earning: 10 coins per ₹1000 on eligible spend (excluding discounts/shipping)
    const eligibleSpend = order.amount; // amount already represents product total without shipping
    const earnedCoins = Math.floor(eligibleSpend / 1000) * 10;

    let transaction = null;
    if (earnedCoins > 0) {
      transaction = await Transaction.create({
        value: earnedCoins,
        type: "in",
        orderId: order.id,
        user: order.user,
        title: "Bignlean Cash Earned"
      });
    }

    res.status(200).json({
      status: true,
      message: "Order Delivered and loyalty coins credited",
      order: {
        id: order.id,
        status: order.status,
        amount: order.amount
      },
      transaction: transaction
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.put("/order/Shipped/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Find the order by ID
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    // Update order status to Shipped
    await order.update({ status: "Shipped" });

    res.status(200).json({
      status: true,
      message: "Order status updated to Shipped",
      order: {
        id: order.id,
        status: order.status,
        amount: order.amount
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.put("/order/Out_for_Delivery/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Find the order by ID
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    // Update order status to Shipped
    await order.update({ status: "Out_for_Delivery" });

    res.status(200).json({
      status: true,
      message: "Order status updated to Out_for_Delivery",
      order: {
        id: order.id,
        status: order.status,
        amount: order.amount
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.get("/order", async (req, res) => {
  try {
    const status = req.query.status; // Get status from query parameter
    const whereClause = {};
    
    // Add status to where clause if provided
    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAll({ where: whereClause });
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

      // Remove unnecessary fields
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


router.get("/transactions", async (req, res) => {
  try {
    const userId = req.query.userId;

    // Fetch transactions, optionally filtering by userId
    const whereClause = userId ? { user: userId } : {};
    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        status: true,
        total: 0,
        totalIn: 0,
        totalOut: 0,
        transactions: [],
      });
    }

    // Fetch user data for all unique user IDs in transactions
    const userIds = [...new Set(transactions.map((t) => t.user))];
    const users = await User.findAll({
      where: { id: userIds },
    });

    // Create a map for quick user lookup
    const userMap = users.reduce((map, user) => {
      map[user.id] = user.toJSON();
      return map;
    }, {});

    // Fetch order data for all orderIds in transactions
    const orderIds = transactions.map((t) => t.orderId);
    const orders = await Order.findAll({
      where: { id: orderIds },
    });

    // Create a map for quick order lookup
    const orderMap = orders.reduce((map, order) => {
      map[order.id] = order.toJSON();
      return map;
    }, {});

    // Calculate total in and out values and format transactions
    let totalIn = 0;
    let totalOut = 0;

    const formattedTransactions = transactions.map((transaction) => {
      if (transaction.type === "in") {
        totalIn += transaction.value;
      } else if (transaction.type === "out") {
        totalOut += transaction.value;
      }

      return {
        id: transaction.id,
        user: userMap[transaction.user] || null,
        order: orderMap[transaction.orderId] || null,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        createdAt: transaction.createdAt,
      };
    });

    res.status(200).json({
      status: true,
      total: totalIn - totalOut, // New field: total = totalIn - totalOut
      totalIn,
      totalOut,
      transactions: formattedTransactions,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

module.exports = router;

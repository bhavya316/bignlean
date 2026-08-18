const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const User = require("../user/model/user");
const Address = require("../user/model/address");
const Cart = require("../user/model/cart");
const Subscription = require("../user/model/subscription");
const Order = require("../user/model/order");
const Transaction = require("../user/model/transaction")
const Refer = require("../user/model/refer");
const Product = require("../admin/model/product");
const ComboProduct = require("../admin/model/comboProduct");
const Coupon = require("../admin/model/coupon");
const { validateCouponForCart } = require("../admin/controllers/couponController");
const { generateRandomId } = require("./functions");
const { addTransaction } = require("../user/controllers/transactionController");
const {
  authMiddleware,
  requireOwnedResource,
  requireSameUserBody,
  requireSameUserParam,
  requireSameUserQuery,
} = require("../middleware/authMiddleware");
const {
  isXpressbeesTestMode,
  createTestShipmentResponse,
  createTestTrackingResponse,
  createTestServiceabilityResponse,
} = require("./xpressbeesTestMode");

const getFlavorLabel = (flavor) => {
  if (typeof flavor === "string") return flavor;
  return flavor?.name || flavor?.flavor || flavor?.label || "";
};

const resolveVariantPricing = (variant, selectedFlavour) => {
  const flavors = Array.isArray(variant?.flavors)
    ? variant.flavors
    : Array.isArray(variant?.flavour)
    ? variant.flavour
    : Array.isArray(variant?.flavor)
    ? variant.flavor
    : [];
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

const parseAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const normalizePaymentMethod = (value) => {
  const rawValue = String(value || "").trim();
  const normalized = rawValue.toLowerCase().replace(/[\s_-]+/g, "");

  if (normalized === "cod" || normalized === "cashondelivery") return "COD";
  if (normalized === "razorpay" || normalized === "razor") return "RazorPay";
  return rawValue;
};

const isRazorpayPayment = (paymentMethod) =>
  normalizePaymentMethod(paymentMethod).toLowerCase() === "razorpay";

const sanitizeAddressSnapshot = (address) => {
  const data =
    address && typeof address.toJSON === "function"
      ? address.toJSON()
      : address || {};

  return {
    id: data.id,
    user: data.user,
    flat: data.flat || "",
    landmark: data.landmark || "",
    city: data.city || "",
    state: data.state || "",
    pincode: data.pincode || "",
    name: data.name || "",
    phone: data.phone || "",
    type: data.type || "",
  };
};

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return { keyId, keySecret };
};

const getRazorpayCheckoutConfig = () => ({
  name: process.env.RAZORPAY_CHECKOUT_NAME || "BigNLean",
  description:
    process.env.RAZORPAY_CHECKOUT_DESCRIPTION ||
    "Fitness Supplements & Sports Nutrition",
  image:
    process.env.RAZORPAY_CHECKOUT_LOGO ||
    "https://bignlean.com/assets/logo.png",
  themeColor: process.env.RAZORPAY_CHECKOUT_THEME_COLOR || "#E70F0F",
});

const createRazorpayGatewayOrder = async ({ amountPaise, receipt, notes }) => {
  const { keyId, keySecret } = getRazorpayCredentials();
  const response = await axios.post(
    "https://api.razorpay.com/v1/orders",
    {
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes,
    },
    {
      auth: {
        username: keyId,
        password: keySecret,
      },
    }
  );

  return {
    ...response.data,
    keyId,
  };
};

const fetchRazorpayPayment = async (paymentId) => {
  const { keyId, keySecret } = getRazorpayCredentials();
  const response = await axios.get(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
    {
      auth: {
        username: keyId,
        password: keySecret,
      },
    }
  );

  return response.data;
};

const fetchRazorpayOrder = async (orderId) => {
  const { keyId, keySecret } = getRazorpayCredentials();
  const response = await axios.get(
    `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`,
    {
      auth: {
        username: keyId,
        password: keySecret,
      },
    }
  );

  return response.data;
};

const verifyRazorpayPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  expectedAmountPaise,
  expectedReceiptPrefix,
}) => {
  const { keySecret } = getRazorpayCredentials();

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return {
      status: false,
      message: "Razorpay order id, payment id and signature are required.",
    };
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");
  const receivedSignatureBuffer = Buffer.from(String(razorpaySignature), "hex");

  if (
    expectedSignatureBuffer.length !== receivedSignatureBuffer.length ||
    !crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer)
  ) {
    return {
      status: false,
      message: "Razorpay payment verification failed.",
    };
  }

  const payment = await fetchRazorpayPayment(razorpayPaymentId);
  const gatewayOrder = await fetchRazorpayOrder(razorpayOrderId);
  if (payment.order_id !== razorpayOrderId) {
    return {
      status: false,
      message: "Razorpay payment does not match the generated order.",
    };
  }

  if (
    expectedReceiptPrefix &&
    !String(gatewayOrder.receipt || "").startsWith(expectedReceiptPrefix)
  ) {
    return {
      status: false,
      message: "Razorpay order does not match this checkout.",
    };
  }

  if (Number(payment.amount) !== Number(expectedAmountPaise)) {
    return {
      status: false,
      message: "Razorpay payment amount does not match the order amount.",
    };
  }

  if (String(payment.status || "").toLowerCase() !== "captured") {
    return {
      status: false,
      message: `Razorpay payment is not successful. Current status: ${payment.status || "unknown"}.`,
    };
  }

  return {
    status: true,
    transactionId: razorpayPaymentId,
    paymentDetails: {
      gateway: "Razorpay",
      razorpayOrderId,
      razorpayPaymentId,
      status: payment.status,
      method: payment.method || null,
      amount: payment.amount,
      currency: payment.currency,
      receipt: gatewayOrder.receipt || null,
      verifiedAt: new Date().toISOString(),
    },
  };
};

const isComboCartItem = (item = {}) => {
  const normalizedFlavour = String(item.flavour || item.flavor || "").toLowerCase();
  return normalizedFlavour === "combo" || (Number(item.varientId) === 0 && normalizedFlavour !== "");
};

const buildOrderItemSnapshot = (product, cartItem, isPremium) => {
  const productData =
    product && typeof product.toJSON === "function" ? product.toJSON() : product;
  const isCombo = isComboCartItem(cartItem);

  let mrp, sellingPrice, premiumPrice, unitPrice, qty, flavour;
  qty = parseAmount(cartItem.qty);

  if (isCombo) {
    mrp = parseAmount(cartItem.mrp);
    sellingPrice = parseAmount(cartItem.sellingPrice);
    premiumPrice = parseAmount(cartItem.premiumPrice || cartItem.mrp);
    unitPrice = sellingPrice || premiumPrice || mrp;
    flavour = "Combo";
  } else {
    const variants = Array.isArray(productData?.varients) ? productData.varients : [];
    const selectedVariant =
      variants.find((item) => `${item.id}` === `${cartItem.varientId}`) ||
      variants[0] ||
      {};
    const selectedPricing = resolveVariantPricing(selectedVariant, cartItem.flavour);
    mrp = parseAmount(selectedPricing.mrp ?? cartItem.mrp);
    sellingPrice = parseAmount(
      selectedPricing.sellingPrice ?? selectedPricing.price ?? cartItem.sellingPrice
    );
    premiumPrice = parseAmount(selectedPricing.premiumPrice ?? cartItem.premiumPrice);
    unitPrice = isPremium
      ? premiumPrice || sellingPrice || mrp
      : sellingPrice || premiumPrice || mrp;
    flavour = cartItem.flavour || getFlavorLabel(selectedPricing);
  }

  return {
    product: cartItem.product,
    productId: cartItem.product,
    isCombo,
    productType: isCombo ? "combo" : "product",
    name: productData?.name,
    images: productData?.images || [],
    varientId: cartItem.varientId,
    variantId: cartItem.varientId,
    flavour,
    flavor: flavour,
    qty,
    units: "",
    mrp,
    sellingPrice,
    premiumPrice,
    unitPrice,
    amount: unitPrice * qty,
    lineTotal: unitPrice * qty,
    variant: {
      id: cartItem.varientId,
      units: "",
      stock: 999,
      mrp,
      sellingPrice,
      premiumPrice,
    },
  };
};

const getOrderItemProductId = (orderItem, fallbackId) =>
  orderItem?.productId || orderItem?.product || fallbackId;

const buildOrderProductResponse = async (productId, qty, orderItem = {}) => {
  let isComboProduct = isComboCartItem(orderItem) || orderItem.isCombo === true;
  let product = isComboProduct
    ? await ComboProduct.findByPk(productId)
    : await Product.findByPk(productId);

  if (isComboProduct && !product) {
    product = await Product.findByPk(productId);
  }
  if (!isComboProduct && !product) {
    product = await ComboProduct.findByPk(productId);
    isComboProduct = Boolean(product);
  }

  if (!product) return null;

  const productData =
    typeof product.toJSON === "function" ? product.toJSON() : product.dataValues || product;

  if (isComboProduct) {
    const firstVariant =
      Array.isArray(productData.varients) && productData.varients.length > 0
        ? productData.varients[0]
        : {};
    const mrp = parseAmount(orderItem.mrp ?? productData.mrp ?? firstVariant.mrp);
    const sellingPrice = parseAmount(
      orderItem.sellingPrice ??
        productData.sellingPrice ??
        productData.price ??
        firstVariant.sellingPrice ??
        firstVariant.premiumPrice ??
        firstVariant.price
    );
    const premiumPrice = parseAmount(
      orderItem.premiumPrice ??
        productData.price ??
        firstVariant.premiumPrice ??
        sellingPrice ??
        mrp
    );
    const unitPrice = parseAmount(orderItem.unitPrice) || sellingPrice || premiumPrice || mrp;
    const lineTotal = parseAmount(orderItem.lineTotal ?? orderItem.amount) || unitPrice * qty;
    const comboVariant = {
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
      ...productData,
      isCombo: true,
      productType: "combo",
      qty,
      amount: lineTotal,
      lineTotal,
      unitPrice,
      mrp,
      sellingPrice,
      premiumPrice,
      price: sellingPrice || productData.price || premiumPrice || mrp,
      selectedVariant: comboVariant,
      selectedVariantId: 0,
      selectedFlavour: "Combo",
      selectedFlavor: "Combo",
      selectedUnits: "Combo",
      weight: "Combo",
      flavor: "Combo",
      varients: [comboVariant],
      orderItem,
    };
  }

  const variants = Array.isArray(productData.varients) ? productData.varients : [];
  const selectedVariant =
    variants.find((item) => `${item.id}` === `${orderItem.varientId || orderItem.variantId}`) ||
    variants[0] ||
    {};
  const selectedPricing = resolveVariantPricing(
    selectedVariant,
    orderItem.flavour || orderItem.flavor
  );
  const mrp = parseAmount(orderItem.mrp ?? selectedPricing.mrp);
  const sellingPrice = parseAmount(
    orderItem.sellingPrice ?? selectedPricing.sellingPrice ?? selectedPricing.price
  );
  const premiumPrice = parseAmount(orderItem.premiumPrice ?? selectedPricing.premiumPrice);
  const unitPrice = parseAmount(orderItem.unitPrice) || sellingPrice || premiumPrice || mrp;
  const lineTotal = parseAmount(orderItem.lineTotal ?? orderItem.amount) || unitPrice * qty;
  const selectedFlavour =
    orderItem.flavour ||
    orderItem.flavor ||
    getFlavorLabel(getVariantFlavorOptions(selectedVariant)[0]);

  return {
    ...productData,
    isCombo: false,
    productType: "product",
    qty,
    amount: lineTotal,
    lineTotal,
    unitPrice,
    mrp,
    sellingPrice: sellingPrice || premiumPrice || mrp,
    premiumPrice,
    selectedVariant,
    selectedVariantId: orderItem.varientId || orderItem.variantId || selectedVariant.id,
    selectedFlavour,
    selectedFlavor: selectedFlavour,
    selectedUnits: orderItem.units || selectedVariant.units || "",
    orderItem,
  };
};

const buildOrderProductList = async (order) => {
  const productIds = Array.isArray(order.product) ? order.product : [];
  const productQty = Array.isArray(order.qty) ? order.qty : [];
  const items = Array.isArray(order.items) ? order.items : [];

  const products = await Promise.all(
    productIds.map((productId, index) => {
      const orderItem = items[index] || {};
      const id = getOrderItemProductId(orderItem, productId);
      const qty = parseAmount(orderItem.qty || productQty[index] || 0);
      return buildOrderProductResponse(id, qty, orderItem);
    })
  );

  return products.filter(Boolean);
};

async function loginUserAndGetToken() {
  if (isXpressbeesTestMode()) {
    return "XPRESSBEES_TEST_TOKEN";
  }

  const apiUrl = "https://shipment.xpressbees.com/api/users/login";

  const requestData = {
    email: process.env.XPRESSBEES_EMAIL,
    password: process.env.XPRESSBEES_PASSWORD,
  };

  if (!requestData.email || !requestData.password) {
    throw new Error("XPRESSBEES_EMAIL and XPRESSBEES_PASSWORD are required outside test mode");
  }

  if (isXpressbeesTestMode()) {
    return createTestServiceabilityResponse(requestData);
  }

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    console.log("Attempting to login to Xpressbees API...");
    const response = await axios.post(apiUrl, requestData, {
      headers,
      timeout: 30000 // 30 second timeout
    });

    if (response && response.data && response.data.data) {
      const token = response.data.data;
      console.log("Successfully obtained Xpressbees token");
      return token;
    } else {
      console.error("Unexpected login response:", response.data);
      throw new Error(`Failed to get token from Xpressbees API. Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error("Error during Xpressbees login API call:", error.message);
    if (error.response) {
      console.error("Login API error response:", error.response.status, error.response.data);
      throw new Error(`Xpressbees login failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received from Xpressbees login API");
      throw new Error("No response from Xpressbees login API - network error");
    } else {
      throw new Error(`Xpressbees login error: ${error.message}`);
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
  console.log(weight);
  if (isXpressbeesTestMode()) {
    return createTestServiceabilityResponse({
      origin,
      destination,
      payment_type: paymentType,
      order_amount: orderAmount,
      weight,
    });
  }

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
  if (isXpressbeesTestMode()) {
    const awbList = Array.isArray(awbs) ? awbs : [awbs];
    return {
      status: true,
      message: "Xpressbees test mode: manifest simulated, no real manifest created",
      data: {
        manifest_id: `XBTEST-MANIFEST-${Date.now()}`,
        total_shipments: awbList.length,
        generated_at: new Date().toISOString(),
        courier_name: "Xpressbees Test",
        shipments: awbList.map((awb) => ({
          awb_number: awb,
          status: "Ready",
        })),
        testMode: true,
      },
    };
  }

  const apiUrl = "https://shipment.xpressbees.com/api/shipments2/manifest";

  const requestData = {
    awbs: Array.isArray(awbs) ? awbs : [awbs],
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(apiUrl, requestData, { headers });
    console.log("Manifest response:", response.data);
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false, message: "Unexpected response from manifest API" };
    }
  } catch (error) {
    console.error("Error during manifest API call:", error.message);
    return { status: false, message: error.message };
  }
}

async function cancelShipment(awb, token) {
  if (isXpressbeesTestMode() || String(awb || "").startsWith("XBTEST")) {
    return {
      status: true,
      message: "Xpressbees test mode: shipment cancellation simulated",
      data: { awb, testMode: true },
    };
  }

  const apiUrl = "https://shipment.xpressbees.com/api/shipments2/cancel";

  const requestData = {
    awb: awb,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(apiUrl, requestData, { headers });
    console.log("Cancel shipment response:", response.data);
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false, message: "Unexpected response from cancel API" };
    }
  } catch (error) {
    console.error("Error during cancel shipment API call:", error.message);
    return { status: false, message: error.message };
  }
}

async function getCourierList(token) {
  const apiUrl = "https://shipment.xpressbees.com/api/courier";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    console.log("Courier list response:", response.data);
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false, message: "Unexpected response from courier list API" };
    }
  } catch (error) {
    console.error("Error during courier list API call:", error.message);
    return { status: false, message: error.message };
  }
}

async function getNdrList(token, filters = {}) {
  const apiUrl = "https://shipment.xpressbees.com/api/ndr";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const params = {};
  if (filters.awb_number) params.awb_number = filters.awb_number;
  if (filters.per_page) params.per_page = filters.per_page;

  try {
    const response = await axios.get(apiUrl, { headers, params });
    console.log("NDR list response:", response.data);
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return { status: false, message: "Unexpected response from NDR list API" };
    }
  } catch (error) {
    console.error("Error during NDR list API call:", error.message);
    return { status: false, message: error.message };
  }
}

async function createNdrAction(token, ndrActions) {
  const apiUrl = "https://shipment.xpressbees.com/api/ndr/create";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(apiUrl, ndrActions, { headers });
    console.log("NDR action response:", response.data);
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Unexpected response:", response.data);
      return [{ status: false, message: "Unexpected response from NDR action API" }];
    }
  } catch (error) {
    console.error("Error during NDR action API call:", error.message);
    return [{ status: false, message: error.message }];
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
      const isCombo = isComboCartItem(cartItem);
      let product = isCombo
        ? await ComboProduct.findByPk(cartItem.product)
        : await Product.findByPk(cartItem.product);
      if (isCombo && !product) {
        product = await Product.findByPk(cartItem.product);
      }
      if (!product) continue;

      if (isCombo) {
        const comboVariant =
          Array.isArray(product.varients) && product.varients.length > 0
            ? product.varients[0]
            : {};
        const mrp = parseAmount(product.mrp ?? comboVariant.mrp);
        const sellingPrice = parseAmount(
          product.sellingPrice ??
            product.price ??
            comboVariant.sellingPrice ??
            comboVariant.premiumPrice ??
            comboVariant.price
        );
        const productPrice = sellingPrice || mrp;
        totalPrice += productPrice * cartItem.qty;
        totalWeight += 500 * cartItem.qty;
        totalDiscount += (mrp - sellingPrice) * cartItem.qty;
      } else {
        const varients = product.varients;
        const selectedVariant = varients.find(
          (item) => `${item.id}` === `${cartItem.varientId}`
        );
        
        if (!selectedVariant) {
          console.log(`Variant ${cartItem.varientId} not found for product ${cartItem.product}`);
          continue;
        }
        
        const selectedVariantPricing = resolveVariantPricing(
          selectedVariant,
          cartItem.flavour
        );
        // Safely parse price values with fallbacks
        const mrp = selectedVariantPricing.mrp ? parseInt(selectedVariantPricing.mrp) || 0 : 0;
        const sellingPrice = selectedVariantPricing.sellingPrice ? parseInt(selectedVariantPricing.sellingPrice) || 0 : 0;
        const premiumPrice = selectedVariantPricing.premiumPrice ? parseInt(selectedVariantPricing.premiumPrice) || 0 : 0;
        
        const productPrice = isPremium
          ? premiumPrice || sellingPrice || mrp
          : sellingPrice || premiumPrice || mrp;
          
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (selectedVariantPricing.weight ?? selectedVariant.weight ?? 100) * cartItem.qty;
        totalDiscount += (mrp * cartItem.qty) - (sellingPrice * cartItem.qty);
      }
    }

    if (coupon) {
      const couponDetails = await Coupon.findOne({ where: { coupon } });

      if (couponDetails) {
        const couponValidation = validateCouponForCart(couponDetails);
        if (!couponValidation.status) {
          return couponValidation;
        }
        
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
    const walletBalance = await Transaction.calculateFinalValueForUser(user);

    if (totalPrice >= 3000 && walletBalance >= 500) {
      canUseBGLCash = true;
      afterUseBGLCash = Math.max(
        0,
        totalPrice - Math.min(walletBalance, totalPrice)
      );
    }

    return {
      status: true,
      totalAmount: totalPrice,
      shiping: shippingCharge,
      discount: totalDiscount + totalCouponDiscount,
      couponDiscount: totalCouponDiscount,
      canUseBGLCash,
      afterUseBGLCash,
      walletBalance,
      isPremium,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Something went wrong" };
  }
}

async function trackShipment(awb, token) {
  if (isXpressbeesTestMode() || String(awb || "").startsWith("XBTEST")) {
    return createTestTrackingResponse(awb);
  }

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
    collectable_amount: collectableAmount || 0,
  };
  if (courierId) {
    requestData.courier_id = courierId;
  }

  console.log("Shipment request data:", JSON.stringify(requestData, null, 2));
  console.log("Auth token:", authToken ? "Present" : "Missing");

  if (isXpressbeesTestMode()) {
    return createTestShipmentResponse(requestData);
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  try {
    console.log("Creating shipment via Xpressbees API...");
    console.log("Shipment request payload:", JSON.stringify(requestData, null, 2));

    const response = await axios.post(apiUrl, requestData, {
      headers,
      timeout: 60000 // 60 second timeout for shipment creation
    });

    console.log("Xpressbees API response status:", response.status);
    console.log("Xpressbees API response data:", JSON.stringify(response.data, null, 2));

    if (response && response.data) {
      if (response.data.status === true) {
        console.log("Shipment created successfully with AWB:", response.data.data?.awb_number);
      } else {
        console.error("Shipment creation failed:", response.data.message);
      }
      return response.data;
    } else {
      console.error("Unexpected response structure from Xpressbees:", response);
      return {
        status: false,
        message: "Invalid response structure from Xpressbees shipping API",
        details: response.data
      };
    }
  } catch (error) {
    console.error("Error during Xpressbees shipment creation API call:", error.message);

    if (error.response) {
      console.error("Xpressbees API error response status:", error.response.status);
      console.error("Xpressbees API error response data:", JSON.stringify(error.response.data, null, 2));

      // Handle specific error cases
      if (error.response.status === 401) {
        return {
          status: false,
          message: "Authentication failed with Xpressbees API",
          details: {
            status: error.response.status,
            data: error.response.data
          }
        };
      } else if (error.response.status === 422) {
        return {
          status: false,
          message: "Validation error in shipment data",
          details: {
            status: error.response.status,
            data: error.response.data
          }
        };
      }

      return {
        status: false,
        message: "Xpressbees API error",
        details: {
          status: error.response.status,
          data: error.response.data
        }
      };
    } else if (error.request) {
      console.error("No response received from Xpressbees API - possible network issue");
      return {
        status: false,
        message: "No response from Xpressbees shipping API - network error",
        details: { request: "No response received" }
      };
    } else {
      console.error("Error setting up shipment request:", error.message);
      return {
        status: false,
        message: "Error setting up Xpressbees shipment request",
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
    return res.status(400).json({ status: false, message: "AWB is required" });
  }
  try {
    const token = await loginUserAndGetToken();
    const response = await manifestShipments(awb, token);
    if (response.status) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ status: false, message: "No record found", data: null });
    }
  } catch (e) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Cancel shipment endpoint
router.post("/cancelShipment", async (req, res) => {
  const { awb } = req.body;
  if (!awb) {
    return res.status(400).json({ status: false, message: "AWB number is required" });
  }
  try {
    const token = await loginUserAndGetToken();
    const response = await cancelShipment(awb, token);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Get courier list endpoint
router.get("/couriers", async (req, res) => {
  try {
    const token = await loginUserAndGetToken();
    const response = await getCourierList(token);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Get NDR list endpoint
router.get("/ndr", async (req, res) => {
  try {
    const token = await loginUserAndGetToken();
    const filters = {
      awb_number: req.query.awb_number,
      per_page: req.query.per_page
    };
    const response = await getNdrList(token, filters);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Create NDR action endpoint
router.post("/ndr/action", async (req, res) => {
  const { actions } = req.body;
  if (!actions || !Array.isArray(actions)) {
    return res.status(400).json({ status: false, message: "Actions array is required" });
  }
  try {
    const token = await loginUserAndGetToken();
    const response = await createNdrAction(token, actions);
    res.status(200).json(response);
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




router.post("/razorpay/order", authMiddleware, requireSameUserBody("userid"), async (req, res) => {
  try {
    const { userid, addressid, couponCode, bglCash } = req.body;

    if (!userid || !addressid) {
      return res.status(400).json({
        status: false,
        message: "user and address are required",
      });
    }

    const user = await User.findByPk(userid);
    const address = await Address.findByPk(addressid);
    const cartItems = await Cart.findAll({ where: { user: userid } });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }
    if (!address) {
      return res.status(404).json({ status: false, message: "Address not found." });
    }
    if (Number(address.user) !== Number(userid)) {
      return res.status(403).json({ status: false, message: "Address does not belong to this user." });
    }
    if (cartItems.length === 0) {
      return res.status(404).json({ status: false, message: "User's cart is empty." });
    }

    const cartDetails = await calculateCartDetails(userid, couponCode, addressid);
    if (!cartDetails.status) {
      return res.status(400).json(cartDetails);
    }

    const amount = Number(cartDetails.totalAmount || 0);
    let shiping = Number(cartDetails.shiping);
    if (!Number.isFinite(shiping)) {
      shiping = amount >= 1000 ? 0 : 80;
    }

    const requestedBGLCash = Math.floor(Number(bglCash) || 0);
    let usedBGL = 0;
    if (requestedBGLCash > 0) {
      const walletBalance = await Transaction.calculateFinalValueForUser(userid);
      if (amount < 3000) {
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
      if (requestedBGLCash > walletBalance) {
        return res.status(400).json({
          status: false,
          message: `Insufficient Bignlean Coins. Available: ${walletBalance}`,
        });
      }
      if (requestedBGLCash > amount) {
        return res.status(400).json({
          status: false,
          message: `You can redeem up to ₹${amount} on this order`,
        });
      }
      usedBGL = requestedBGLCash;
    }

    const finalAmount = Math.max(0, amount + shiping - usedBGL);
    const amountPaise = Math.round(finalAmount * 100);
    if (amountPaise <= 0) {
      return res.status(400).json({
        status: false,
        message: "Order amount must be greater than zero for online payment",
      });
    }

    const gatewayOrder = await createRazorpayGatewayOrder({
      amountPaise,
      receipt: `bignlean_${userid}_${Date.now()}`,
      notes: {
        userId: String(userid),
        addressId: String(addressid),
        source: "bignlean-web",
      },
    });
    const checkout = getRazorpayCheckoutConfig();

    return res.status(200).json({
      status: true,
      message: "Razorpay order created.",
      keyId: gatewayOrder.keyId,
      amount: gatewayOrder.amount,
      currency: gatewayOrder.currency,
      orderId: gatewayOrder.id,
      receipt: gatewayOrder.receipt,
      checkout,
    });
  } catch (error) {
    const gatewayMessage =
      error?.response?.data?.error?.description ||
      error?.response?.data?.message ||
      error.message ||
      "Unable to create Razorpay order.";

    console.error("Error creating Razorpay order:", gatewayMessage);
    return res.status(error?.response?.status ? 502 : 500).json({
      status: false,
      message: gatewayMessage,
    });
  }
});

router.post("/placeOrder", authMiddleware, requireSameUserBody("userid"), async (req, res) => {
  try {
    const {
      userid,
      addressid,
      couponCode,
      paymentMethod,
      transactionId,
      bglCash,
    } = req.body;
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
    const razorpayPayload = req.body.razorpay || {};
    const razorpayOrderId =
      req.body.razorpayOrderId ||
      req.body.razorpay_order_id ||
      razorpayPayload.orderId ||
      razorpayPayload.razorpay_order_id;
    const razorpayPaymentId =
      req.body.razorpayPaymentId ||
      req.body.razorpay_payment_id ||
      razorpayPayload.paymentId ||
      razorpayPayload.razorpay_payment_id;
    const razorpaySignature =
      req.body.razorpaySignature ||
      req.body.razorpay_signature ||
      razorpayPayload.signature ||
      razorpayPayload.razorpay_signature;

    console.log("Order request payload:", req.body);

    if (!userid || !addressid || !normalizedPaymentMethod) {
      return res.status(400).json({
        status: false,
        message: "user, address and payment method is required",
      });
    }

    if (
      normalizedPaymentMethod !== "COD" &&
      !transactionId &&
      !razorpayPaymentId
    ) {
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
    if (Number(address.user) !== Number(userid)) {
      return res.status(403).json({ status: false, message: "Address does not belong to this user." });
    }

    let amount = 0;
    let shiping = 0;
    const itemsIDList = [];
    const qtyList = [];
    for (const item of cartItems) {
      let product = await Product.findByPk(item.product);
      if (!product) product = await ComboProduct.findByPk(item.product);
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
    let couponQtyReserved = false;

    if (couponCode) {
      validCoupon = await Coupon.findOne({ where: { coupon: couponCode } });
      if (!validCoupon) {
        return res.status(400).json({ status: false, message: "Coupon not Found" });
      }
      const couponValidation = validateCouponForCart(validCoupon, {
        unavailableMessage: "Coupon not Available",
      });
      if (!couponValidation.status) {
        return res.status(400).json({ status: false, message: couponValidation.message });
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
    }

    const orderID = generateRandomId();
    let usedBGLCash = false;
    let usedBGL = 0;

    // Loyalty redemption eligibility and limits
    const walletBalance = await Transaction.calculateFinalValueForUser(userid);
    const isCartEligibleForRedemption = amount >= 3000;
    const requestedBGLCash = Math.floor(Number(bglCash) || 0);

    if (requestedBGLCash > 0) {
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
      if (requestedBGLCash > walletBalance) {
        return res.status(400).json({
          status: false,
          message: `Insufficient Bignlean Coins. Available: ${walletBalance}`,
        });
      }
      // Do not allow redemption to exceed payable product amount (excluding shipping)
      const maxRedeemable = Math.max(0, amount);
      if (requestedBGLCash > maxRedeemable) {
        return res.status(400).json({
          status: false,
          message: `You can redeem up to ₹${maxRedeemable} on this order`,
        });
      }
      usedBGLCash = true;
      usedBGL = requestedBGLCash;
    }

    // Static earning: 10 coins per ₹1000 spent on eligible amount (excluding discounts/shipping)
    const eligibleSpend = amount; // already excludes discounts per calculateCartDetails
    const earnedCoins = Math.floor(eligibleSpend / 1000) * 10;
    const totalAmount = Math.max(0, amount - usedBGL);
    const orderItems = [];
    let verifiedTransactionId = transactionId ?? null;
    let paymentDetails = null;

    if (isRazorpayPayment(normalizedPaymentMethod)) {
      const expectedAmountPaise = Math.round(
        Math.max(0, amount + shiping - usedBGL) * 100
      );
      const verification = await verifyRazorpayPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        expectedAmountPaise,
        expectedReceiptPrefix: `bignlean_${userid}_`,
      });

      if (!verification.status) {
        return res.status(400).json(verification);
      }

      verifiedTransactionId = verification.transactionId;
      paymentDetails = verification.paymentDetails;

      const existingPaymentOrder = await Order.findOne({
        where: { transactionId: verifiedTransactionId },
      });
      if (existingPaymentOrder) {
        return res.status(400).json({
          status: false,
          message: "This Razorpay payment has already been used for an order.",
        });
      }
    }

    for (const item of cartItems) {
      const isComboItem = isComboCartItem(item);
      let product;
      if (isComboItem) {
        product = await ComboProduct.findByPk(item.product);
      } else {
        product = await Product.findByPk(item.product);
      }
      if (product) {
        orderItems.push(buildOrderItemSnapshot(product, item, cartDetails.isPremium));
      }
    }

    if (validCoupon) {
      await validCoupon.update({ qty: validCoupon.qty - 1 });
      couponQtyReserved = true;
    }

    const orderData = {
      user: userid,
      product: itemsIDList,
      items: orderItems,
      address: addressid,
      shippingAddress: sanitizeAddressSnapshot(address),
      usedCoupon,
      coupon: couponId,
      couponDiscount: couponDiscount || 0,
      amount,
      qty: qtyList,
      paymentMethod: normalizedPaymentMethod,
      transactionId: verifiedTransactionId,
      paymentDetails,
      usedBGLCash,
      usedBGL: usedBGL || 0,
      bglCash: usedBGL || 0,
      earnedBglCash: earnedCoins || 0,
      shiping,
      totalAmount,
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
      
      // Decrement stock for ordered items
      for (const item of cartItems) {
        if (!isComboCartItem(item)) {
          const productToUpdate = await Product.findByPk(item.product);
          if (productToUpdate && Array.isArray(productToUpdate.varients)) {
            let stockUpdated = false;
            const newVariants = productToUpdate.varients.map(variant => {
              if (String(variant.id) === String(item.varientId)) {
                const flavors = Array.isArray(variant.flavors) ? variant.flavors : 
                               (Array.isArray(variant.flavour) ? variant.flavour : 
                               (Array.isArray(variant.flavor) ? variant.flavor : []));
                
                let flavorUpdated = false;
                const newFlavors = flavors.map(flavor => {
                  const fName = typeof flavor === "string" ? flavor : (flavor.name || flavor.flavor || flavor.label || "");
                  if (String(fName).toLowerCase() === String(item.flavour).toLowerCase()) {
                    if (typeof flavor !== "string" && flavor.stock !== undefined) {
                      flavorUpdated = true;
                      return { ...flavor, stock: Math.max(0, Number(flavor.stock || 0) - Number(item.qty || 1)) };
                    }
                  }
                  return flavor;
                });

                if (flavorUpdated) {
                  stockUpdated = true;
                  if (variant.flavors) return { ...variant, flavors: newFlavors };
                  if (variant.flavour) return { ...variant, flavour: newFlavors };
                  if (variant.flavor) return { ...variant, flavor: newFlavors };
                } else {
                  stockUpdated = true;
                  return { ...variant, stock: Math.max(0, Number(variant.stock || 0) - Number(item.qty || 1)) };
                }
              }
              return variant;
            });
            
            if (stockUpdated) {
              productToUpdate.varients = newVariants;
              productToUpdate.changed('varients', true);
              await productToUpdate.save();
            }
          }
        }
      }
      if (usedBGLCash) {
        await Transaction.create({
          user: userid,
          orderId: order.id,
          title: "BGL Cash Used for Order",
          type: "out",
          value: usedBGL
        });
      }
      if (earnedCoins > 0) {
        await addTransaction(userid, order.id, "Bignlean Cash Earned", "in", earnedCoins);
      }

      const referral = await Refer.findOne({ where: { referTo: userid } });
      if (referral) {
        const orderCount = await Order.count({ where: { user: userid } });
        if (orderCount === 1) {
          const referralReward = 100;
          await Transaction.create({
            user: referral.referBy,
            orderId: order.id,
            title: "Referral Reward",
            type: "in",
            value: referralReward
          });
        }
      }

      return res.status(200).json({
        status: true,
        message: "Order placed. Please wait for admin confirmation.",
        earnedBglCash: earnedCoins,
        orderId: orderID
      });
    } catch (orderError) {
      console.error("Error creating order:", orderError);
      
      // If the coupon was decremented but order failed, increment it back
      if (validCoupon && couponQtyReserved) {
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
      const isCombo = isComboCartItem(cartItem);
      let product = isCombo
        ? await ComboProduct.findByPk(cartItem.product)
        : await Product.findByPk(cartItem.product);
      if (isCombo && !product) {
        product = await Product.findByPk(cartItem.product);
      }

      if (product && isCombo) {
        const comboVariant =
          Array.isArray(product.varients) && product.varients.length > 0
            ? product.varients[0]
            : {};
        const mrp = parseAmount(product.mrp ?? comboVariant.mrp);
        const sellingPrice = parseAmount(
          product.sellingPrice ??
            product.price ??
            comboVariant.sellingPrice ??
            comboVariant.premiumPrice ??
            comboVariant.price
        );
        const productPrice = sellingPrice || mrp;
        totalPrice += productPrice * cartItem.qty;
        totalWeight += 500 * cartItem.qty;
        totalDiscount += (mrp - sellingPrice) * cartItem.qty;
      } else if (product) {
        const varients = product.varients;
        const selectedVariant = varients.find(
          (item) => `${item.id}` === `${cartItem.varientId}`
        );
        
        if (!selectedVariant) {
          console.log(`Variant ${cartItem.varientId} not found for product ${cartItem.product}`);
          continue;
        }
        
        // Safely parse price values with fallbacks
        const selectedVariantPricing = resolveVariantPricing(
          selectedVariant,
          cartItem.flavour
        );
        const mrp = selectedVariantPricing.mrp ? parseInt(selectedVariantPricing.mrp) || 0 : 0;
        const sellingPrice = selectedVariantPricing.sellingPrice ? parseInt(selectedVariantPricing.sellingPrice) || 0 : 0;
        const premiumPrice = selectedVariantPricing.premiumPrice ? parseInt(selectedVariantPricing.premiumPrice) || 0 : 0;
        
        const productPrice = isPremium
          ? premiumPrice || sellingPrice || mrp
          : sellingPrice || premiumPrice || mrp;
          
        totalPrice += productPrice * cartItem.qty;
        totalWeight += (selectedVariantPricing.weight ?? selectedVariant.weight ?? 100) * cartItem.qty;
        totalDiscount += (mrp * cartItem.qty) - (sellingPrice * cartItem.qty);
      }
    }

    if (coupon) {
      const couponDetails = await Coupon.findOne({ where: { coupon } });

      if (couponDetails) {
        const couponValidation = validateCouponForCart(couponDetails);
        if (!couponValidation.status) {
          return couponValidation;
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
    const walletBalance = await Transaction.calculateFinalValueForUser(user);

    if (totalPrice >= 3000 && walletBalance >= 500) {
      canUseBGLCash = true;
      afterUseBGLCash = Math.max(
        0,
        totalPrice - Math.min(walletBalance, totalPrice)
      );
    }

    return {
      status: true,
      totalAmount: totalPrice,
      shiping: shippingCharge,
      discount: totalDiscount,
      couponDiscount: totalCouponDiscount,
      canUseBGLCash,
      afterUseBGLCash,
      walletBalance,
      isPremium,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Something went wrong with cart calculation" };
  }
}

// Replace your cart/details endpoint with this one
router.get("/cart/details", authMiddleware, requireSameUserQuery("user"), async (req, res) => {
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

router.delete("/order/cancel/:id", authMiddleware, requireOwnedResource(Order, "id", "user"), async (req, res) => {
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

router.get("/order/user/:user", authMiddleware, requireSameUserParam("user"), async (req, res) => {
  try {
    const user = req.params.user;
    const orders = await Order.findAll({
      where: { user },
      order: [["createdAt", "DESC"]],
    });
    let ordersList = [];
    for (const order of orders) {
      const orderData = order.toJSON();
      const originalCreatedAt = orderData.createdAt;
      orderData.product = await buildOrderProductList(orderData);
      orderData.formattedCreatedAt = formatDate(originalCreatedAt);
      orderData.createdAt = originalCreatedAt;
      delete orderData.qty;
      delete orderData.usedCoupon;
      delete orderData.coupon;
      delete orderData.usedBGLCash;
      delete orderData.updatedAt;
      ordersList.push(orderData);
    }

    res.status(200).json({ status: true, message: "OK", orders: ordersList });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.get("/order/track/:id", authMiddleware, requireOwnedResource(Order, "id", "user"), async (req, res) => {
  try {
    const id = req.params.id;
    const ordersDetails = await Order.findByPk(id);
    const orders = ordersDetails.toJSON();
    const finalProductList = await buildOrderProductList(orders);

    delete orders.qty;
    delete orders.usedCoupon;
    delete orders.coupon;
    delete orders.amount;
    delete orders.usedBGLCash;
    delete orders.updatedAt;
    orders.product = finalProductList;
    const orderDate = formatDate(orders.createdAt);
    orders.formattedCreatedAt = orderDate;
    if (orders.status == "Processing" || !orders.trackingID) {
      return res
        .status(200)
        .json({ status: true, isAccepted: false, order: orders });
    }
    const token = await loginUserAndGetToken();
    const response = await trackShipment(orders.trackingID, token);
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

    if (order.trackingID) {
      return res.status(400).json({
        status: false,
        message: "Order already has a tracking ID"
      });
    }

    // Get address details
    const addressRecord = await Address.findByPk(order.address);
    const address =
      order.shippingAddress ||
      (addressRecord && typeof addressRecord.toJSON === "function"
        ? addressRecord.toJSON()
        : addressRecord);
    if (!address) {
      console.log("Address not found");
      return res.status(404).json({
        status: false,
        message: "Shipping address not found"
      });
    }
    const customer = await User.findByPk(order.user);

    // Calculate weight with fallback
    let weight = 500; // Default weight in grams
    try {
      weight = await countWeight(order.product) || 500;
    } catch (weightErr) {
      console.log("Error calculating weight, using default:", weightErr.message);
    }

    // Prepare shipping details
    const shippingCharge = Number(order.shiping) || 0;
    const payableAmount = Math.max(
      0,
      Number(order.totalAmount || 0) + shippingCharge
    );
    const discount = Math.max(
      0,
      Number(order.couponDiscount || 0) + Number(order.bglCash || 0)
    );
    const collectableAmount = order.paymentMethod === "COD" ? payableAmount : 0;
    const consigneePhone = String(address.phone || customer?.phone || "")
      .replace(/\D/g, "")
      .slice(-10);
    const consigneeName = address.name || customer?.name || "Customer";
    const consigneeAddress = [address.flat, address.landmark]
      .filter(Boolean)
      .join(", ");

    if (!consigneeAddress || !address.city || !address.pincode || !consigneePhone) {
      return res.status(400).json({
        status: false,
        message:
          "Cannot create shipment: customer address, pincode, or phone is missing",
      });
    }
    
    const consignee = {
      name: consigneeName,
      address: consigneeAddress,
      address_2: address.landmark || "",
      city: address.city,
      state: address.state || address.city,
      pincode: address.pincode,
      phone: consigneePhone,
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
      const orderItemsDetails = order.items || [];
      for (let i = 0; i < order.product.length; i++) {
        const itemDetail = orderItemsDetails[i] || {};
        const product = await buildOrderProductResponse(
          order.product[i],
          parseAmount(itemDetail.qty || order.qty[i] || 0),
          itemDetail
        );
        if (product) {
          const price = product.unitPrice || product.sellingPrice || product.price || 100;
          const details = {
            name: product.name,
            sku: product.sku || product.id || `SKU-${product.name.substring(0, 5).toUpperCase()}`,
            qty: product.qty || order.qty[i],
            price,
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
    if (!orderItems.length) {
      return res.status(400).json({
        status: false,
        message: "Cannot create shipment: order has no shippable items",
      });
    }

    // Try to create shipment
    try {
      console.log("Getting auth token...");
      const token = await loginUserAndGetToken();
      console.log("Auth token received successfully");
      
      console.log("Creating shipment with data:", {
        orderID: order.orderID,
        shipping: shippingCharge,
        discount: discount,
        paymentMethod: order.paymentMethod,
        totalAmount: payableAmount,
        weight: weight,
        orderItemsCount: orderItems.length,
        collectableAmount: collectableAmount
      });
      
      const response = await createShipment(
        order.orderID,
        shippingCharge,
        discount,
        0,
        order.paymentMethod === "COD" ? "cod" : "prepaid",
        payableAmount,
        weight,
        10,
        10,
        10,
        "yes",
        consignee,
        pickup,
        orderItems,
        req.body?.courierId || req.body?.courier_id || null,
        collectableAmount,
        token
      );

      console.log("Shipment API response:", JSON.stringify(response, null, 2));

      const awbNumber = response?.data?.awb_number || response?.data?.awb;

      if (response && response.status === true && awbNumber) {
        // Success - update order with tracking info
        await order.update({
          status: "Accepted",
          trackingID: awbNumber
        });
        
        console.log("Order updated successfully with tracking ID:", awbNumber);
        return res.status(200).json({ 
          status: true, 
          message: "Order accepted and shipment created successfully",
          order: {
            id: order.id,
            status: "Accepted",
            orderID: order.orderID,
            trackingID: awbNumber
          }
        });
      } else {
        console.log("Shipment creation failed, response:", response);
        
        let exactError = response?.message || "Could not create shipment with courier service";
        if (response?.details?.data?.message) {
          exactError = response.details.data.message;
        } else if (response?.details?.data && typeof response.details.data === 'object') {
           exactError = JSON.stringify(response.details.data).substring(0, 100);
        }
        
        return res.status(400).json({
          status: false,
          message: "Shipment creation failed. Order was not accepted.",
          order: {
            id: order.id,
            status: order.status,
            orderID: order.orderID
          },
          shippingError: exactError,
          details: response
        });
      }
    } catch (shippingError) {
      console.error("Shipping API error:", shippingError.message);
      console.error("Error stack:", shippingError.stack);
      
      return res.status(502).json({
        status: false,
        message: "Shipping setup failed. Order was not accepted.",
        order: {
          id: order.id,
          status: order.status,
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

// Disabled: accepting an order must create a shipment and tracking ID.
router.put("/order/accept-simple/:id", async (req, res) => {
  return res.status(410).json({
    status: false,
    message: "Simple accept is disabled. Use /order/accept/:id so a shipment and tracking ID are created.",
  });
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

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.status(400).json({
        status: false,
        message: `Cannot create shipment for ${order.status} order`
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
    const customer = await User.findByPk(order.user);

    // Calculate weight
    let weight = 500;
    try {
      weight = await countWeight(order.product) || 500;
    } catch (weightErr) {
      console.log("Error calculating weight, using default:", weightErr.message);
    }

    // Prepare shipping details
    const shippingCharge = Number(order.shiping) || 0;
    const payableAmount = Math.max(
      0,
      Number(order.totalAmount || 0) + shippingCharge
    );
    const discount = Math.max(
      0,
      Number(order.couponDiscount || 0) + Number(order.bglCash || 0)
    );
    const collectableAmount = order.paymentMethod === "COD" ? payableAmount : 0;
    const consigneePhone = String(address.phone || customer?.phone || "")
      .replace(/\D/g, "")
      .slice(-10);
    const consigneeName = address.name || customer?.name || "Customer";
    const consigneeAddress = [address.flat, address.landmark]
      .filter(Boolean)
      .join(", ");

    if (!consigneeAddress || !address.city || !address.pincode || !consigneePhone) {
      return res.status(400).json({
        status: false,
        message:
          "Cannot create shipment: customer address, pincode, or phone is missing",
      });
    }
    
    const consignee = {
      name: consigneeName,
      address: consigneeAddress,
      address_2: address.landmark || "",
      city: address.city,
      state: address.state || address.city,
      pincode: address.pincode,
      phone: consigneePhone,
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
    const createItemsDetails = order.items || [];
    for (let i = 0; i < order.product.length; i++) {
      const itemDetail = createItemsDetails[i] || {};
      const product = await buildOrderProductResponse(
        order.product[i],
        parseAmount(itemDetail.qty || order.qty[i] || 0),
        itemDetail
      );
      if (product) {
        const price = product.unitPrice || product.sellingPrice || product.price || 100;
        const details = {
          name: product.name,
          sku: product.sku || product.id || `SKU-${product.name.substring(0, 5).toUpperCase()}`,
          qty: product.qty || order.qty[i],
          price,
        };
        orderItems.push(details);
      }
    }
    if (!orderItems.length) {
      return res.status(400).json({
        status: false,
        message: "Cannot create shipment: order has no shippable items",
      });
    }

    // Create shipment
    const token = await loginUserAndGetToken();
    const response = await createShipment(
      order.orderID,
      shippingCharge,
      discount,
      0,
      order.paymentMethod === "COD" ? "cod" : "prepaid",
      payableAmount,
      weight,
      10,
      10,
      10,
      "yes",
      consignee,
      pickup,
      orderItems,
      req.body?.courierId || req.body?.courier_id || null,
      collectableAmount,
      token
    );

    const awbNumber = response?.data?.awb_number || response?.data?.awb;

    if (response && response.status === true && awbNumber) {
      await order.update({
        status: "Accepted",
        trackingID: awbNumber
      });
      
      return res.status(200).json({ 
        status: true, 
        message: "Shipment created successfully",
        order: {
          id: order.id,
          status: "Accepted",
          orderID: order.orderID,
          trackingID: awbNumber
        }
      });
    } else {
      let exactError = response?.message || "Could not create shipment with courier service";
      if (response?.details?.data?.message) {
        exactError = response.details.data.message;
      } else if (response?.details?.data && typeof response.details.data === 'object') {
         exactError = JSON.stringify(response.details.data).substring(0, 100);
      }
      
      return res.status(400).json({
        status: false,
        message: exactError,
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
      transaction = await Transaction.findOne({
        where: {
          user: order.user,
          orderId: order.id,
          type: "in",
          title: "Bignlean Cash Earned",
        },
      });

      if (!transaction) {
        transaction = await Transaction.create({
          value: earnedCoins,
          type: "in",
          orderId: order.id,
          user: order.user,
          title: "Bignlean Cash Earned"
        });
      }
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

    const orders = await Order.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });
    let ordersList = [];
    
    for (const order of orders) {
      const orderData = order.toJSON();
      const originalCreatedAt = orderData.createdAt;
      orderData.product = await buildOrderProductList(orderData);
      orderData.formattedCreatedAt = formatDate(originalCreatedAt);
      orderData.createdAt = originalCreatedAt;
      delete orderData.qty;
      delete orderData.usedCoupon;
      delete orderData.coupon;
      delete orderData.usedBGLCash;
      delete orderData.updatedAt;
      ordersList.push(orderData);
    }

    res.status(200).json({ status: true, message: "OK", orders: ordersList });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});


router.get(
  "/transactions",
  authMiddleware,
  requireSameUserQuery("userId", { defaultToAuthenticatedUser: true }),
  async (req, res) => {
  try {
    const userId = req.query.userId;

    // Fetch transactions, optionally filtering by userId
    const whereClause = userId ? { user: userId } : {};
    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      const summary = userId
        ? await Transaction.calculateWalletSummaryForUser(userId)
        : {
            baseBglCash: 0,
            transactionTotalIn: 0,
            totalIn: 0,
            totalOut: 0,
            balance: 0,
          };

      return res.status(200).json({
        status: true,
        total: summary.balance,
        walletBalance: summary.balance,
        baseBglCash: summary.baseBglCash,
        transactionTotalIn: summary.transactionTotalIn,
        totalIn: summary.totalIn,
        totalOut: summary.totalOut,
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

    const summary = userId
      ? await Transaction.calculateWalletSummaryForUser(userId)
      : {
          baseBglCash: 0,
          transactionTotalIn: totalIn,
          totalIn,
          totalOut,
          balance: Math.max(totalIn - totalOut, 0),
        };

    res.status(200).json({
      status: true,
      total: summary.balance,
      walletBalance: summary.balance,
      baseBglCash: summary.baseBglCash,
      transactionTotalIn: summary.transactionTotalIn,
      totalIn: summary.totalIn,
      totalOut: summary.totalOut,
      transactions: formattedTransactions,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
  }
);

// Export individual functions for use in other modules
module.exports = {
  router,
  loginUserAndGetToken,
  getCourierServiceabilityDetails,
  manifestShipments,
  cancelShipment,
  getCourierList,
  getNdrList,
  createNdrAction,
  trackShipment,
  createShipment,
  countWeight
};

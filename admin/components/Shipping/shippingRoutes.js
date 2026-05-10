const express = require("express");
const router = express.Router();

// Import Xpressbees utility functions
const xpressbees = require("../../../utils/xpressbees");
const shiprocket = require("../../../utils/shiprocket");
const Order = require("../../../user/model/order");

const {
  cancelShipment,
  getCourierList,
  getNDRList,
  createNDRAction,
  generateManifest,
  getAuthToken,
  createShipment,
  trackShipment,
  getServiceability
} = xpressbees;

// Cancel shipment
router.post("/cancel-shipment", async (req, res) => {
  try {
    const { awb } = req.body;
    if (!awb) {
      return res.status(400).json({ status: false, message: "AWB number is required" });
    }

    const result = await cancelShipment(awb);
    res.json(result);
  } catch (error) {
    console.error("Cancel shipment error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Get courier list
router.get("/couriers", async (req, res) => {
  try {
    const result = await getCourierList();
    res.json(result);
  } catch (error) {
    console.error("Get couriers error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ status: true, message: "Shipping routes working!" });
});

router.get("/providers/status", async (req, res) => {
  const checkShiprocket = req.query.check === "true" || req.query.provider === "shiprocket";
  const shiprocketConfigured = Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
  const payload = {
    status: true,
    activeProvider: "xpressbees",
    xpressbees: {
      configured: true,
      usesFallbackCredentials: !process.env.XPRESSBEES_EMAIL || !process.env.XPRESSBEES_PASSWORD,
      mounted: true,
      routes: ["/serviceability", "/create-shipment", "/track/:awb"],
    },
    shiprocket: {
      configured: shiprocketConfigured,
      mounted: false,
      authenticated: null,
    },
  };

  if (checkShiprocket && shiprocketConfigured) {
    const token = await shiprocket.authenticate();
    payload.shiprocket.authenticated = Boolean(token);
  }

  res.json(payload);
});

// Get NDR list
router.get("/ndr", async (req, res) => {
  try {
    const filters = {
      awb_number: req.query.awb_number,
      per_page: req.query.per_page
    };

    // Handle the 404 "No record found" case directly in the route
    try {
      const result = await getNDRList(filters);
      res.json(result);
    } catch (ndrError) {
      // If it's a 404 with "No record found", treat as success
      if (ndrError.response?.status === 404 && ndrError.response?.data?.message === 'No record found') {
        return res.json({
          status: true,
          data: [],
          message: 'No NDR records found'
        });
      }
      // Re-throw other errors
      throw ndrError;
    }
  } catch (error) {
    console.error("Get NDR list route error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Create NDR action
router.post("/ndr/action", async (req, res) => {
  try {
    const { actions } = req.body;
    if (!actions || !Array.isArray(actions)) {
      return res.status(400).json({ status: false, message: "Actions array is required" });
    }

    const result = await createNDRAction(actions);
    res.json(result);
  } catch (error) {
    console.error("Create NDR action error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Generate manifest
router.post("/manifest", async (req, res) => {
  try {
    const { awbs } = req.body;
    if (!awbs || (!Array.isArray(awbs) && typeof awbs !== 'string')) {
      return res.status(400).json({ status: false, message: "AWB numbers are required" });
    }

    const result = await generateManifest(awbs);
    res.json(result);
  } catch (error) {
    console.error("Generate manifest error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Create shipment
router.post("/create-shipment", async (req, res) => {
  try {
    const shipmentData = req.body;

    // Validate required fields
    if (!shipmentData.order_number || !shipmentData.payment_type || !shipmentData.order_amount || !shipmentData.consignee || !shipmentData.pickup) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: order_number, payment_type, order_amount, consignee, pickup"
      });
    }

    // Validate collectable_amount based on payment_type
    const orderAmount = parseFloat(shipmentData.order_amount);
    const collectableAmount = parseFloat(shipmentData.collectable_amount || 0);

    if (shipmentData.payment_type === 'cod') {
      // For COD, collectable_amount should be <= order_amount
      if (collectableAmount > orderAmount) {
        return res.status(400).json({
          status: false,
          message: `For COD orders, collectable_amount (${collectableAmount}) cannot exceed order_amount (${orderAmount})`
        });
      }
    } else if (shipmentData.payment_type === 'prepaid') {
      // For Prepaid, collectable_amount should be 0
      if (collectableAmount !== 0) {
        return res.status(400).json({
          status: false,
          message: "For prepaid orders, collectable_amount should be 0"
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid payment_type. Must be 'cod' or 'prepaid'"
      });
    }

    const result = await createShipment(shipmentData);

    // If shipment creation is successful, update the order with the tracking ID
    if (result.status && result.data) {
      const awbNumber = result.data.awb_number || result.data.awb;
      if (awbNumber) {
        await Order.update(
          { trackingID: awbNumber },
          { where: { orderID: shipmentData.order_number } }
        );
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Create shipment route error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Track shipment
router.get("/track/:awb", async (req, res) => {
  try {
    const { awb } = req.params;
    if (!awb) {
      return res.status(400).json({ status: false, message: "AWB number is required" });
    }

    const result = await trackShipment(awb);
    res.json(result);
  } catch (error) {
    console.error("Track shipment error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Get serviceability and rates
router.post("/serviceability", async (req, res) => {
  try {
    const serviceabilityData = req.body;

    // Validate required fields
    if (!serviceabilityData.origin || !serviceabilityData.destination || !serviceabilityData.payment_type || !serviceabilityData.order_amount) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: origin, destination, payment_type, order_amount"
      });
    }

    const result = await getServiceability(serviceabilityData);
    res.json(result);
  } catch (error) {
    console.error("Serviceability check error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// Login and get token
router.post("/login", async (req, res) => {
  try {
    const token = await getAuthToken();
    res.json({
      status: true,
      message: "Token generated successfully",
      data: token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: false, message: "Failed to generate token" });
  }
});

module.exports = router;

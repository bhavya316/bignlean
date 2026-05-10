const express = require("express");
const router = express.Router();

// Import Xpressbees utility functions
const xpressbees = require("../../utils/xpressbees");

const {
  trackShipment,
  getServiceability
} = xpressbees;

// Track shipment (public route for website users)
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

// Get serviceability and rates (public route for website)
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

// Test route for public shipping
router.get("/test", (req, res) => {
  res.json({
    status: true,
    message: "Public shipping routes working!",
    available_endpoints: [
      "GET /shipping/track/:awb - Track shipment by AWB number",
      "POST /shipping/serviceability - Check serviceability and rates"
    ]
  });
});

module.exports = router;
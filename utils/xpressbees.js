const axios = require('axios');
const {
  isXpressbeesTestMode,
  createTestShipmentResponse,
  createTestTrackingResponse,
  createTestServiceabilityResponse,
} = require("./xpressbeesTestMode");

const BASE_URL = "https://shipment.xpressbees.com/api";

// Global token cache
let cachedToken = null;
let tokenExpiry = null;

// Get cached token or fetch new one if expired
const getAuthToken = async () => {
  if (isXpressbeesTestMode()) {
    return "XPRESSBEES_TEST_TOKEN";
  }

  const now = Date.now();

  // Check if token exists and is not expired (tokens typically last 24 hours)
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email: process.env.XPRESSBEES_EMAIL || "orders@bignlean.com",
      password: process.env.XPRESSBEES_PASSWORD || "Carry@2525"
    }, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000
    });

    if (response && response.data && response.data.data) {
      cachedToken = response.data.data;
      // Set token expiry to 23 hours from now (to be safe)
      tokenExpiry = now + (23 * 60 * 60 * 1000);
      return cachedToken;
    } else {
      throw new Error(`Unexpected login response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error("Xpressbees login error:", error.message);
    cachedToken = null;
    tokenExpiry = null;
    throw error;
  }
};

// Create shipment
const createShipment = async (shipmentData) => {
  try {
    if (isXpressbeesTestMode()) {
      return createTestShipmentResponse(shipmentData);
    }

    const token = await getAuthToken();
    const response = await axios.post(`${BASE_URL}/shipments2`, shipmentData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      timeout: 60000
    });
    return response.data;
  } catch (error) {
    console.error("Create shipment error:", error.message);
    throw error;
  }
};

// Track shipment
const trackShipment = async (awb) => {
  try {
    if (isXpressbeesTestMode() || String(awb || "").startsWith("XBTEST")) {
      return createTestTrackingResponse(awb);
    }

    const token = await getAuthToken();
    const response = await axios.get(`${BASE_URL}/shipments2/track/${awb}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error("Track shipment error:", error.message);
    throw error;
  }
};

// Cancel shipment
const cancelShipment = async (awb) => {
  try {
    if (isXpressbeesTestMode() || String(awb || "").startsWith("XBTEST")) {
      return {
        status: true,
        message: "Xpressbees test mode: shipment cancellation simulated",
        data: { awb, testMode: true },
      };
    }

    const token = await getAuthToken();
    const response = await axios.post(`${BASE_URL}/shipments2/cancel`, {
      awb: awb
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error("Cancel shipment error:", error.message);
    throw error;
  }
};

// Get courier list
const getCourierList = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${BASE_URL}/courier`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error("Get courier list error:", error.message);
    throw error;
  }
};

// Check serviceability and rates
const getServiceability = async (serviceabilityData) => {
  try {
    if (isXpressbeesTestMode()) {
      return createTestServiceabilityResponse(serviceabilityData);
    }

    const token = await getAuthToken();
    const response = await axios.post(`${BASE_URL}/courier/serviceability`, serviceabilityData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error("Serviceability check error:", error.message);
    throw error;
  }
};

// Generate manifest
const generateManifest = async (awbs) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(`${BASE_URL}/shipments2/manifest`, {
      awbs: Array.isArray(awbs) ? awbs : [awbs]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error("Generate manifest error:", error.message);
    throw error;
  }
};

// Get NDR list
const getNDRList = async (filters = {}) => {
  try {
    const token = await getAuthToken();

    let response;
    try {
      response = await axios.get(`${BASE_URL}/ndr`, {
        params: filters,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        timeout: 30000
      });
    } catch (apiError) {
      // Handle 404 "No record found" as success case
      if (apiError.response?.status === 404 && apiError.response?.data?.message === 'No record found') {
        return {
          status: true,
          data: [],
          message: 'No NDR records found'
        };
      }
      // Re-throw other errors
      throw apiError;
    }

    return response.data;
  } catch (error) {
    console.error("Get NDR list error:", error.message);
    throw error;
  }
};

// Create NDR action
const createNDRAction = async (actions) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(`${BASE_URL}/ndr/create`, actions, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error("Create NDR action error:", error.message);
    throw error;
  }
};

module.exports = {
  getAuthToken,
  createShipment,
  trackShipment,
  cancelShipment,
  getCourierList,
  getServiceability,
  generateManifest,
  getNDRList,
  createNDRAction,
  isXpressbeesTestMode
};

const axios = require('axios');

class ShiprocketAPI {
  constructor() {
    this.email = process.env.SHIPROCKET_EMAIL || "";
    this.password = process.env.SHIPROCKET_PASSWORD || "";
    this.baseUrl = "https://apiv2.shiprocket.in/v1/external";
    this.token = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      // Return cached token if valid
      if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.token;
      }

      if (!this.email || !this.password) {
        console.warn("Shiprocket credentials not provided in environment variables");
        return null;
      }

      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email: this.email,
        password: this.password
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        // Token typically expires in 10 days, we'll refresh every 9 days
        this.tokenExpiry = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000);
        return this.token;
      }
      throw new Error("Invalid authentication response");
    } catch (error) {
      console.error("Shiprocket Authentication Failed:", error.response ? error.response.data : error.message);
      return null;
    }
  }

  async createOrder(orderData) {
    try {
      const token = await this.authenticate();
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(
        `${this.baseUrl}/orders/create/adhoc`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return { status: true, data: response.data };
    } catch (error) {
      console.error("Shiprocket Create Order Failed:", error.response ? error.response.data : error.message);
      return { 
        status: false, 
        message: error.response?.data?.message || "Failed to create Shiprocket order",
        error: error.response?.data 
      };
    }
  }

  async cancelOrder(orderIds) {
    try {
      const token = await this.authenticate();
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(
        `${this.baseUrl}/orders/cancel`,
        { ids: Array.isArray(orderIds) ? orderIds : [orderIds] },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return { status: true, data: response.data };
    } catch (error) {
      return { status: false, message: "Cancel order failed", error: error.response?.data };
    }
  }

  async trackOrder(awbCode) {
    try {
      const token = await this.authenticate();
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(
        `${this.baseUrl}/courier/track/awb/${awbCode}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return { status: true, data: response.data };
    } catch (error) {
      return { status: false, message: "Tracking failed", error: error.response?.data };
    }
  }

  parseWebhook(payload) {
    // Basic Webhook parsing
    if (!payload || !payload.awb) {
      return null;
    }
    return {
      orderId: payload.order_id,
      awb: payload.awb,
      status: payload.current_status,
      statusId: payload.current_status_id,
      scans: payload.scans
    };
  }
}

module.exports = new ShiprocketAPI();

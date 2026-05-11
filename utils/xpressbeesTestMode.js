const TEST_AWB_PREFIX = "XBTEST";

function isXpressbeesTestMode() {
  const mode = String(
    process.env.XPRESSBEES_MODE || process.env.XPRESSBEES_ENV || ""
  ).toLowerCase();

  if (["live", "prod", "production"].includes(mode)) return false;
  if (["test", "testing", "sandbox", "mock", "simulate", "simulated"].includes(mode)) {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}

function getTestAwb(orderNumber) {
  const suffix = String(orderNumber || Date.now()).replace(/[^a-zA-Z0-9]/g, "");
  return `${TEST_AWB_PREFIX}${suffix || Date.now()}`;
}

function createTestShipmentResponse(shipmentData = {}) {
  const orderNumber = shipmentData.order_number || shipmentData.orderNumber;
  const awb = getTestAwb(orderNumber);

  return {
    status: true,
    message: "Xpressbees test mode: shipment simulated, no real shipment created",
    data: {
      awb,
      awb_number: awb,
      order_number: orderNumber,
      status: "PP",
      current_status: "Pending Pickup",
      testMode: true,
    },
  };
}

function createTestTrackingResponse(awb) {
  return {
    status: true,
    message: "Xpressbees test mode: tracking simulated",
    data: {
      awb,
      awb_number: awb,
      status: "PP",
      current_status: "Pending Pickup",
      history: [
        {
          status: "PP",
          message: "Shipment created in test mode",
          location: "Test Warehouse",
          event_time: new Date().toISOString(),
        },
      ],
      testMode: true,
    },
  };
}

function createTestServiceabilityResponse() {
  return {
    status: true,
    message: "Xpressbees test mode: serviceability simulated",
    data: [
      {
        courier_id: "test",
        courier_name: "Xpressbees Test",
        serviceable: true,
        base_rate: 0,
        fuel_surcharge: 0,
        cod_charges: 0,
        total_amount: 0,
        estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };
}

module.exports = {
  isXpressbeesTestMode,
  createTestShipmentResponse,
  createTestTrackingResponse,
  createTestServiceabilityResponse,
};

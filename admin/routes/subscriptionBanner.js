const express = require("express");
const router = express.Router();
const subscriptionBanner = require("../controllers/subscriptionBanner");

router.post("/subscriptionBanner", subscriptionBanner.addSubscriptionBanner);

router.get("/subscriptionBanner", subscriptionBanner.getAllSubscriptionBanners);

router.delete(
  "/subscriptionBanner/:id",
  subscriptionBanner.deleteSubscriptionBanner
);

module.exports = router;

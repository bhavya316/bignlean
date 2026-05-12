const express = require("express");
const router = express.Router();

router.use("/", require("./userRoutes"));
router.use("/", require("./addressRoutes"));
router.use("/", require("./ratingRoutes"));
router.use("/", require("./cartRoutes"));
router.use("/", require("./subscriptionRoutes"));
router.use("/", require("./favoriteRoutes"));
router.use("/", require("./contactLeadRoutes"));
router.use("/", require("./recentViewRoutes"));
router.use("/", require("./subscribe"));
router.use("/shipping", require("./shippingRoutes"));
router.use("/", require("../../utils/delhivery").router);
router.use("/", require("../../utils/helper"));

module.exports = router;

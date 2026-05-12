const express = require("express");
const router = express.Router();

router.use("/admin", require("./bannerRoutes"));
router.use("/admin", require("./brandRoutes"));
router.use("/admin", require("./categoryRoutes"));
router.use("/admin", require("./subCategoryRoutes"));
router.use("/admin", require("./productRoutes"));
router.use("/admin", require("./blogRoutes"));
router.use("/admin", require("./faqRoutes"));
router.use("/admin", require("./couponRoutes"));
router.use("/admin", require("./planRoutes"));
router.use("/admin", require("./comboCatRoutes"));
router.use("/admin", require("./comboSubCatRoutes"));
router.use("/admin", require("./comboRoutes"));
router.use("/admin", require("./comboProductRoutes"));
router.use("/admin", require("./userRoutes"));
router.use("/admin", require("./ordersRoutes"));
router.use("/admin", require("./dealRoutes"));
router.use("/admin", require("./certificateRoute"));

router.use("/", require("./adminRoutes"));
router.use("/", require("./aboutFitnessRoute"));
router.use("/", require("./gymGuideRoutes"));
router.use("/", require("./offer"));
router.use("/", require("./subscriptionBanner"));
router.use("/admin/shipping", require("../components/Shipping/shippingRoutes"));

module.exports = router;

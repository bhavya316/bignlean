const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const sequelize = require("./config/database");
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads"));

// app.get(
//   "/.well-known/pki-validation/81A4B466C2B2905F1B2DEBEBF3C18025.txt",
//   (req, res) => {
//     res.sendFile("/home/ubuntu/bignlean/81A4B466C2B2905F1B2DEBEBF3C18025.txt");
//   }
// );

//adminRoutes
const bannerRoutes = require("./admin/routes/bannerRoutes");
const brandRoutes = require("./admin/routes/brandRoutes");
const catRoutes = require("./admin/routes/categoryRoutes");
const subCatRoutes = require("./admin/routes/subCategoryRoutes");
const productRoutes = require("./admin/routes/productRoutes");
const blogRoutes = require("./admin/routes/blogRoutes");
const faqRoutes = require("./admin/routes/faqRoutes");
const couponRoutes = require("./admin/routes/couponRoutes");
const planRoutes = require("./admin/routes/planRoutes");
const comboCatRoutes = require("./admin/routes/comboCatRoutes");
const comboSubCatRoutes = require("./admin/routes/comboSubCatRoutes");
const comboRoutes = require("./admin/routes/comboRoutes");
const comboProductRoutes = require("./admin/routes/comboProductRoutes");
const userRoutes = require("./admin/routes/userRoutes");
const orderRoutes = require("./admin/routes/ordersRoutes");
const delasRoutes = require("./admin/routes/dealRoutes");
const certificateRoute = require("./admin/routes/certificateRoute");
const adminRoute = require("./admin/routes/adminRoutes");
const fitnessRoute = require("./admin/routes/aboutFitnessRoute");
const gymGuideRoute = require("./admin/routes/gymGuideRoutes");
//adminRoutes

//userRoutes
const user = require("./user/routes/userRoutes");
const address = require("./user/routes/addressRoutes");
const rating = require("./user/routes/ratingRoutes");
const cart = require("./user/routes/cartRoutes");
const subscription = require("./user/routes/subscriptionRoutes");
const favorite = require("./user/routes/favoriteRoutes");
const contact = require("./user/routes/contactLeadRoutes");
const recentViewRoutes = require("./user/routes/recentViewRoutes");
const shippingRoutes = require("./user/routes/shippingRoutes");
const delhiveryRoutes = require("./utils/delhivery");

const firebaseAdmin = require('./config/firebaseAdmin');


//
app.use("/", user);
app.use("/", address);
app.use("/", rating);
app.use("/", cart);
app.use("/", subscription);
app.use("/", favorite);
app.use("/", contact);
app.use("/", recentViewRoutes);
app.use("/shipping", shippingRoutes);
app.use("/", delhiveryRoutes.router);
app.use("/", require("./utils/helper"));

//Admin
app.use("/admin", bannerRoutes);
app.use("/admin", brandRoutes);
app.use("/admin", catRoutes);
app.use("/admin", subCatRoutes);
app.use("/admin", productRoutes);
app.use("/admin", blogRoutes); 
app.use("/admin", faqRoutes);
app.use("/admin", couponRoutes);
app.use("/admin", planRoutes);
app.use("/admin", comboCatRoutes);
app.use("/admin", comboSubCatRoutes);
app.use("/admin", comboRoutes);
app.use("/admin", comboProductRoutes);
app.use("/admin", userRoutes);
app.use("/admin", orderRoutes);
app.use("/admin", delasRoutes);
app.use("/admin", certificateRoute);
app.use("/", adminRoute);
app.use("/", fitnessRoute);
app.use("/", gymGuideRoute);
app.use("/", require("./user/routes/subscribe"));
app.use("/", require("./admin/routes/offer"));
app.use("/", require("./admin/routes/subscriptionBanner"));
app.use("/admin/shipping", require("./admin/components/Shipping/shippingRoutes"));

//Handle Wrong URL
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route not found" });
});

module.exports = app;

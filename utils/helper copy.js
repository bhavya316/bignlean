const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { param, query, validationResult } = require("express-validator");
const bannerController = require("../admin/controllers/bannerController");
const brandController = require("../admin/controllers/brandController");
const categoryController = require("../admin/controllers/categoryController");
const subCategoryController = require("../admin/controllers/subCategoryController");
const productController = require("../admin/controllers/productController");
const blogController = require("../admin/controllers/blogController");
const faqController = require("../admin/controllers/faqController");
const planController = require("../admin/controllers/planController");
const dealController = require("../admin/controllers/dealController");
const dashboard = require("./dashboard");
const recentSearchesController = require("../user/controllers/recentSerches");
const admin = require("../config/firebaseAdmin"); // This already initializes Firebase
const serviceAccount = require("../bignlean-c415a-firebase-adminsdk-kdr6p-00b58d83c6.json");
const Notification = require("../user/model/notification");
const NotificationSchedule = require("../user/model/notification2");
const Brand = require("../admin/model/brand");
const { Sequelize, Op } = require("sequelize");
const Product = require("../admin/model/product");
const Category = require("../admin/model/category");

// REMOVE THIS ENTIRE BLOCK - Firebase is already initialized in firebaseAdmin.js
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://drive1-aa20a-default-rtdb.firebaseio.com/",
// });

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    const currentDateTime = Date.now();
    const extension = path.extname(file.originalname);
    const newFilename = `${currentDateTime}${extension}`;
    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, message: "No file uploaded" });
  }
  const fileUrl = `https://${req.get("host")}/uploads/${req.file.filename}`;
  res
    .status(201)
    .json({ status: true, message: "File uploaded successfully", fileUrl });
});

router.get("/banners", bannerController.getAllBanners);
router.get("/brands", brandController.getAllBrands);
router.get("/categories", categoryController.getCategories);
router.get("/plans", planController.getAllPlans);
router.get("/categories/:categoryId", categoryController.getAllCategories);

router.get(
  "/subcategories/:categoryId",
  subCategoryController.getSubCategoriesByCategoryId
);

router.get(
  "/products",
  [
    query("catId").notEmpty().withMessage("catId is required"),
    query("subCatId").notEmpty().withMessage("suCatId is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }

    productController.getProductsByCategoryAndSubCategory(req, res);
  }
);

router.get("/blogs", blogController.getAllBlogs);
router.get("/faqs", faqController.getGroupedFAQs);

router.get(
  "/products/:id/:user",
  param("id").notEmpty().withMessage("Product ID is required"),
  param("user").notEmpty().withMessage("User ID is required"),
  productController.getProductbyId
);

router.get("/all/products", productController.getAllProducts);
router.get("/home/products", dealController.getAllDeals);
router.get("/admin/dashboard", dashboard.getSalesAnalysis);
router.get("/products/trending", productController.getTrending);
router.get(
  "/recentSearches/user/:id",
  recentSearchesController.getUserRecentSearches
);

router.post("/admin/notification", async (req, res) => {
  try {
    const { title, body, image, type, link } = req.body;
    if (!title || !body || !type) {
      return res
        .status(500)
        .json({ status: false, message: "title, body, type is Required" });
    }

    if (type == "Push") {
      const message = {
        data: {
          title: title,
          body: body,
          type: "pushNotification",
        },
        topic: "pushNotification",
      };

      if (image) {
        message.data.image = image;
      }

      await admin.messaging().send(message);
    } else {
      await Notification.create({ title, body, image, link });
    }

    res.status(200).json({ status: true, message: "Success" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: false, message: "Server Error" });
  }
});

router.post("/admin/notification/schedule", async (req, res) => {
  try {
    const { title, body, image, time, date } = req.body;
    if (!title || !body || !time || !date) {
      return res.status(500).json({
        status: false,
        message: "title, body, date and time is Required",
      });
    }

    await NotificationSchedule.create({ title, body, image, date, time });
    res.status(200).json({ status: true, message: "Success" });
  } catch (e) {
    res.status(400).json({ status: false, message: "Server Error" });
  }
});

router.get("/admin/notification/schedule", async (req, res) => {
  try {
    const notifications = await NotificationSchedule.findAll();
    res.status(200).json({ status: true, message: "Success", notifications });
  } catch (e) {
    res.status(400).json({ status: false, message: "Server Error" });
  }
});

router.delete("/admin/notification/schedule/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const notifications = await NotificationSchedule.findByPk(id);
    if (!notifications) {
      return res
        .status(404)
        .json({ status: false, message: "Notification not Found" });
    }

    await notifications.destroy();

    res.status(200).json({ status: true, message: "Success", notifications });
  } catch (e) {
    res.status(400).json({ status: false, message: "Server Error" });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "Success", notifications });
  } catch (e) {
    res.status(400).json({ status: false, message: "Server Error" });
  }
});

// router.get("/user/wallet", async (req, res) => {
//   try {
//     const user = req.query.user;
//     const transactions = await getTransactionsByUser(user);
//     console.log(transactions);
//     const walletBalance = await Transaction.calculateFinalValueForUser(user);
//     res.status(200).json({ status: true, transactions, walletBalance });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ status: false, message: "Server Error" });
//   }
// });

router.get("/topBrands", async (req, res) => {
  try {
    const brands = await Brand.findAll({
      order: Sequelize.literal("RAND()"),
      limit: 5,
    });
    res.status(200).json({ status: true, message: "Success", brands });
  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res
        .status(400)
        .json({ status: false, message: "Query parameter is required." });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { brand: { [Op.like]: `%${query}%` } },
          { information: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: 10,
    });

    const brands = await Brand.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: 10,
    });

    const categories = await Category.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${query}%` } }],
      },
      limit: 10,
    });

    res.status(200).json({ status: true, products, brands, categories });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

module.exports = router;

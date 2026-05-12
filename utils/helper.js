const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
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
const Notification = require("../user/model/notification");
const NotificationSchedule = require("../user/model/notification2");
const Brand = require("../admin/model/brand");
const { Sequelize, Op } = require("sequelize");
const Product = require("../admin/model/product");
const Category = require("../admin/model/category");
const { authMiddleware, requireSameUserParam } = require("../middleware/authMiddleware");
const createHttpError = require("./httpError");

// REMOVE THIS ENTIRE BLOCK - Firebase is already initialized in firebaseAdmin.js
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://drive1-aa20a-default-rtdb.firebaseio.com/",
// });

const uploadDir = path.join(__dirname, "..", "uploads");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);
const blockedExtensions = new Set([
  ".bat",
  ".cmd",
  ".com",
  ".exe",
  ".html",
  ".js",
  ".jsp",
  ".msi",
  ".php",
  ".ps1",
  ".py",
  ".sh",
  ".vbs",
]);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const currentDateTime = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    const newFilename = `${currentDateTime}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, newFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (blockedExtensions.has(extension)) {
    return cb(createHttpError(400, "Executable file types are not allowed"));
  }

  if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(file.mimetype)) {
    return cb(createHttpError(400, "Only JPEG, PNG, WEBP, and PDF uploads are allowed"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadSingleFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) return next();

    if (error.code === "LIMIT_FILE_SIZE") {
      return next(createHttpError(400, "File size must be 5MB or less"));
    }

    next(error);
  });
};

router.post("/upload", uploadSingleFile, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, message: "No file uploaded" });
  }
  const protocol = req.get("x-forwarded-proto") || req.protocol;
  const filePath = `/uploads/${req.file.filename}`;
  const fileUrl = `${protocol}://${req.get("host")}${filePath}`;
  res
    .status(201)
    .json({ status: true, message: "File uploaded successfully", fileUrl, filePath });
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
router.get("/blogs/:id", blogController.getBlogById);
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
router.get("/products/trending", productController.getTrendingProducts);
router.get(
  "/recentSearches/user/:id",
  authMiddleware,
  requireSameUserParam("id"),
  recentSearchesController.getUserRecentSearches
);

router.post("/admin/notification", async (req, res, next) => {
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
  } catch (error) {
    next(error);
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

router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res
        .status(400)
        .json({ status: false, message: "Query parameter is required." });
    }

    const hasStock = (product) => {
      try {
        const variants = product?.varients || [];
        return variants.some((v) => {
          const s = v?.stock;
          const n = typeof s === "string" ? parseInt(s, 10) : Number(s);
          return n > 0;
        });
      } catch {
        return false;
      }
    };

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
    const inStockProducts = products.filter(hasStock);

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

    res.status(200).json({ status: true, products: inStockProducts, brands, categories });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

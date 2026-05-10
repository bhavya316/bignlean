// const express = require("express");
// const router = express.Router();
// const { query, body, validationResult } = require("express-validator");
// const bannerController = require("../controllers/bannerController");

// router.post(
//   "/banners",
//   [
//     body("phone")
//       .notEmpty()
//       .withMessage("Phone is required")
//       .isURL()
//       .withMessage("Phone must be a valid URL"),
//     body("tab")
//       .notEmpty()
//       .withMessage("Tab is required")
//       .isURL()
//       .withMessage("Tab must be a valid URL"),
//     body("web")
//       .notEmpty()
//       .withMessage("Web is required")
//       .isURL()
//       .withMessage("Web must be a valid URL"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res
//         .status(400)
//         .json({ status: false, message: "ERROR", errors: errors.array() });
//     }

//     bannerController.createBanner(req, res);
//   }
// );
// router.get("/banners", bannerController.getAllBanners);
// router.delete(
//   "/banners",
//   [query("id").notEmpty().withMessage("ID is required")],
//   (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res
//         .status(400)
//         .json({ status: false, message: "ERROR", errors: errors.array() });
//     }

//     bannerController.deleteBanner(req, res);
//   }
// );

// module.exports = router;



const express = require("express");
const router = express.Router();
const { param, query, body, validationResult } = require("express-validator");
const bannerController = require("../controllers/bannerController");

const isImagePath = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  (/^https?:\/\//i.test(value) || value.startsWith("/uploads/"));

const validateImageField = (field, label) =>
  body(field)
    .notEmpty()
    .withMessage(`${label} is required`)
    .custom((value) => {
      if (!isImagePath(value)) {
        throw new Error(`${label} must be a valid URL or upload path`);
      }
      return true;
    });

const validateOptionalImageField = (field, label) =>
  body(field)
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!isImagePath(value)) {
        throw new Error(`${label} must be a valid URL or upload path`);
      }
      return true;
    });

const validateOptionalLink = body("link")
  .optional({ checkFalsy: true })
  .custom((value) => {
    const links = Array.isArray(value) ? value : [value];
    if (!links.every((item) => typeof item === "string" && item.trim() !== "")) {
      throw new Error("Link must be a string or an array of non-empty strings");
    }
    return true;
  });

router.post(
  "/banners",
  [
    validateImageField("phone", "Phone"),
    validateImageField("tab", "Tab"),
    validateImageField("web", "Web"),
    validateOptionalLink,
    body("type")
      .optional()
      .isIn(['Hero Slider', 'Banner 1 Section', 'Banner 2 Section', 'Banner 3 Section'])
      .withMessage("Type must be one of: Hero Slider, Banner 1 Section, Banner 2 Section, Banner 3 Section"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    bannerController.createBanner(req, res);
  }
);

router.put(
  "/banners/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("ID is required")
      .isInt()
      .withMessage("ID must be an integer"),
    validateOptionalImageField("phone", "Phone"),
    validateOptionalImageField("tab", "Tab"),
    validateOptionalImageField("web", "Web"),
    validateOptionalLink,
    body("type")
      .optional()
      .isIn(['Hero Slider', 'Banner 1 Section', 'Banner 2 Section', 'Banner 3 Section'])
      .withMessage("Type must be one of: Hero Slider, Banner 1 Section, Banner 2 Section, Banner 3 Section"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    bannerController.updateBanner(req, res);
  }
);

router.get("/banners", bannerController.getAllBanners);

router.delete(
  "/banners",
  [query("id").notEmpty().withMessage("ID is required")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: "ERROR", errors: errors.array() });
    }
    bannerController.deleteBanner(req, res);
  }
);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { body, param, validationResult } = require("express-validator");
// const userController = require("../controllers/userController");

// router.post(
//   "/register",
//   [
//     body("phone").notEmpty().withMessage("Phone is required"),
//     body("name").optional(),
//     body("email").optional(),
//     body("gender").optional(),
//     body("dob").optional(),
//     body("height").optional(),
//     body("weight").optional(),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
//     }
//     userController.createUser(req, res);
//   }
// );


// router.put(
//   "/users/:id",
//   [
//     param("id").notEmpty().withMessage("User ID is required"),
//     body("name").optional(),
//     body("phone").optional(),
//     body("email").optional(),
//     body("gender").optional(),
//     body("dob").optional(),
//     body("height").optional(),
//     body("weight").optional(),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res
//         .status(400)
//         .json({ status: false, message: "ERROR", errors: errors.array() });
//     }
//     userController.updateUser(req, res);
//   }
// );

// router.get("/user/:id", userController.getUserDetailsById);

// router.post("/register", userController.createUser);

// // Verify OTP endpoint.
// router.post(
//   "/verify-otp",
//   [
//     body("phone").notEmpty().withMessage("Phone is required"),
//     body("otp").notEmpty().withMessage("OTP is required"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
//     }
//     userController.verifyOtp(req, res);
//   }
// );


// router.post(
//   "/send-login-otp",
//   [
//     body("phone").notEmpty().withMessage("Phone is required"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
//     }
//     userController.sendLoginOtp(req, res);
//   }
// );

// router.post(
//   "/login",
//   [
//     body("phone").notEmpty().withMessage("Phone is required"),
//     body("otp").notEmpty().withMessage("OTP is required"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
//     }
//     userController.loginUser(req, res);
//   }
// );
// // router.post(
// //   "/auth/google",
// //   [
// //     body("token").notEmpty().withMessage("Google token is required"),
// //   ],
// //   (req, res, next) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
// //     }
// //     userController.googleAuth(req, res);
// //   }
// // );

// // router.post(
// //   "/auth/facebook",
// //   [
// //     body("userId").notEmpty().withMessage("Facebook user ID is required"),
// //     body("accessToken").notEmpty().withMessage("Facebook access token is required"),
// //   ],
// //   (req, res, next) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
// //     }
// //     userController.facebookAuth(req, res);
// //   }
// // );
// router.post(
//   "/auth/firebase",
//   [
//     body("idToken").notEmpty().withMessage("Firebase ID token is required"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
//     }
//     userController.verifyFirebaseToken(req, res);
//   }
// );
// router.post(
//   "/auth/social",
//   [
//     body("idToken").notEmpty().withMessage("ID token is required"),
//     body("provider").isIn(['google', 'facebook']).withMessage("Provider must be 'google' or 'facebook'"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
//     }
//     userController.socialAuth(req, res);
//   }
// );




// module.exports = router;


const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const userController = require("../controllers/userController");
const checkUserBlocked = require("../middleware/checkUserBlocked");
const Transaction = require("../model/transaction");
const { getTransactionsByUser } = require("../controllers/transactionController");
const User = require("../model/user");

// Register route
router.post(
  "/register",
  [
    body("phone").notEmpty().withMessage("Phone is required"),
    body("name").optional(),
    body("email").optional(),
    body("gender").optional(),
    body("dob").optional(),
    body("height").optional(),
    body("weight").optional(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.createUser(req, res);
  }
);

// Update user route
router.put(
  "/users/:id",
  [
    param("id").notEmpty().withMessage("User ID is required"),
    body("name").optional(),
    body("phone").optional(),
    body("email").optional(),
    body("gender").optional(),
    body("dob").optional(),
    body("height").optional(),
    body("weight").optional(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.updateUser(req, res);
  }
);

// Get user details by ID
router.get("/user/:id", checkUserBlocked, userController.getUserDetailsById);

// Duplicate register route (remove this as it's redundant)
// router.post("/register", userController.createUser);

// Verify OTP route
router.post(
  "/verify-otp",
  [
    body("phone").notEmpty().withMessage("Phone is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  checkUserBlocked, // Add middleware here
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.verifyOtp(req, res);
  }
);

// Send login OTP route
router.post(
  "/send-login-otp",
  [
    body("phone").notEmpty().withMessage("Phone is required"),
  ],
  checkUserBlocked, // Already added as per your code
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.sendLoginOtp(req, res);
  }
);

// Login route
router.post(
  "/login",
  [
    body("phone").notEmpty().withMessage("Phone is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  checkUserBlocked,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.loginUser(req, res);
  }
);

// Firebase auth route
router.post(
  "/auth/firebase",
  [
    body("idToken").notEmpty().withMessage("Firebase ID token is required"),
  ],
  checkUserBlocked, // Add middleware here
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.verifyFirebaseToken(req, res);
  }
);

// Social auth route
router.post(
  "/auth/social",
  [
    body("idToken").notEmpty().withMessage("ID token is required"),
    body("provider").isIn(['google', 'facebook']).withMessage("Provider must be 'google' or 'facebook'"),
  ],
  checkUserBlocked, // Add middleware here
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.socialAuth(req, res);
  }
);

// Block user route
router.put(
  "/users/:id/block",
  [
    param("id").notEmpty().withMessage("User ID is required"),
    body("isBlocked").isBoolean().withMessage("isBlocked must be a boolean"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: "ERROR", errors: errors.array() });
    }
    userController.blockUser(req, res);
  }
);
router.get(
  "/user/wallet/:id",
  async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (!userId) {
        return res.status(400).json({ status: false, message: "User ID is required" });
      }

      // Check if user exists
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      // Get transactions and calculate balance
      const transactions = await getTransactionsByUser(userId);
      let walletBalance = 0;
      if (typeof Transaction.calculateFinalValueForUser === "function") {
        walletBalance = await Transaction.calculateFinalValueForUser(userId);
      }

      return res.status(200).json({ 
        status: true, 
        transactions, 
        walletBalance 
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ status: false, message: "Server Error" });
    }
  }
);
module.exports = router;
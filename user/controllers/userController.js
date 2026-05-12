const { Op, QueryTypes } = require("sequelize");
const axios = require("axios");
const { User, Order, Refer, Transaction, Subscription } = require("../model");
const { createUniqueReferCode } = require("../../utils/functions");
const admin = require("../../config/firebaseAdmin");
const sequelize = require("../../config/database");
const logger = require("../../utils/logger");
const createHttpError = require("../../utils/httpError");
const { generateToken, sanitizeUser } = require("../../utils/auth");

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

const calculateWalletBalance = async (userId) => {
  if (typeof Transaction.calculateFinalValueForUser !== "function") {
    return 0;
  }

  return Transaction.calculateFinalValueForUser(userId);
};

const sendAuthResponse = async (res, statusCode, message, user) => {
  const walletBalance = await calculateWalletBalance(user.id);
  const publicUser = sanitizeUser(user, {
    bglCash: walletBalance,
    walletBalance,
  });

  return res.status(statusCode).json({
    status: true,
    message,
    user: publicUser,
    walletBalance,
    token: generateToken(user),
  });
};

const sendSmsOtp = async (phone, otp) => {
  if (process.env.NODE_ENV === "development") {
    logger.info({ phone, otp }, "Development OTP generated");
    return true;
  }

  const formattedPhone = phone.toString().replace(/^\+91/, "");
  const apiKey = process.env.TWOFACTOR_API_KEY;

  if (!apiKey) {
    logger.error("TWOFACTOR_API_KEY is not configured");
    return false;
  }

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhone}/${otp}/BGNLOTP`
    );
    return response.data.Status === "Success";
  } catch (error) {
    logger.error({ err: error, phone: formattedPhone }, "Unable to send OTP");
    return false;
  }
};

const createUser = async (req, res, next) => {
  const { phone, referCode } = req.body;

  try {
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await existingUser.update({ otp, otpExpiry });
      await sendSmsOtp(phone, otp);

      return res.status(200).json({
        status: true,
        message: "OTP sent to your phone number.",
        user: sanitizeUser(existingUser),
      });
    }

    let referBy = 0;
    if (referCode) {
      const referUser = await User.findOne({ where: { referCode } });
      if (!referUser) {
        throw createHttpError(400, "Invalid referral code.");
      }
      referBy = referUser.id;
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const newUser = await User.create({
      ...req.body,
      referCode: await createUniqueReferCode(),
      otp,
      otpExpiry,
    });

    if (referCode) {
      await Refer.create({ referTo: newUser.id, referBy });
    }

    await sendSmsOtp(phone, otp);

    return res.status(201).json({
      status: true,
      message: "OTP sent to your phone number. Please verify OTP to complete registration.",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    next(error);
  }
};

const sendLoginOtp = async (req, res, next) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw createHttpError(404, "User not registered");
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.update({ otp, otpExpiry });
    await sendSmsOtp(phone, otp);

    return res.status(200).json({
      status: true,
      message: "OTP sent to your phone number for login.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.update({ otp, otpExpiry });

    const sent = await sendSmsOtp(phone, otp);
    if (!sent) {
      throw createHttpError(502, "Unable to send OTP. Please try again.");
    }

    return res.status(200).json({
      status: true,
      message: "OTP resent successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const validateOtp = (user, otp) =>
  user.otp === otp && user.otpExpiry && user.otpExpiry >= new Date();

const verifyOtp = async (req, res, next) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!validateOtp(user, otp)) {
      throw createHttpError(400, "Invalid or expired OTP.");
    }

    await user.update({ otp: null, otpExpiry: null });
    return sendAuthResponse(
      res,
      200,
      "User registration/login completed successfully.",
      user
    );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!validateOtp(user, otp)) {
      throw createHttpError(400, "Invalid or expired OTP.");
    }

    await user.update({ otp: null, otpExpiry: null });
    return sendAuthResponse(res, 200, "Logged in successfully.", user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw createHttpError(404, "User not found.");
    }

    const updateData = { ...req.body };
    [
      "id",
      "bglCash",
      "otp",
      "otpExpiry",
      "isBlocked",
      "referCode",
      "firebaseUid",
      "googleId",
      "facebookId",
    ].forEach((field) => delete updateData[field]);

    const updatedUser = await user.update(updateData);
    const walletBalance = await calculateWalletBalance(updatedUser.id);

    return res.status(200).json({
      status: true,
      message: "User details updated successfully.",
      user: sanitizeUser(updatedUser, { bglCash: walletBalance, walletBalance }),
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [
            "id",
            "product",
            "address",
            "usedCoupon",
            "coupon",
            "couponDiscount",
            "amount",
            "qty",
            "paymentMethod",
            "transactionId",
            "usedBGLCash",
            "bglCash",
            "earnedBglCash",
            "shiping",
            "totalAmount",
            "orderID",
            "trackingID",
            "status",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const userData = sanitizeUser(user);
        const walletBalance = await calculateWalletBalance(user.id);
        return {
          ...userData,
          bglCash: walletBalance,
          walletBalance,
          orders: userData.orders || [],
        };
      })
    );

    return res.status(200).json({
      status: true,
      message: "Users retrieved successfully.",
      users: usersWithOrders,
    });
  } catch (error) {
    next(error);
  }
};

const getUserDetailsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const plan = await Subscription.findOne({ where: { user: id } });
    const walletBalance = await calculateWalletBalance(id);
    const publicUser = sanitizeUser(user, {
      bglCash: walletBalance,
      walletBalance,
      isPremium: Boolean(plan),
    });

    return res.status(200).json({ status: true, message: "OK", user: publicUser });
  } catch (error) {
    next(error);
  }
};

const verifyFirebaseToken = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" && req.body.testMode === true) {
      const phone = req.body.phone;
      const firebaseUid = `test-uid-${Date.now()}`;

      let user = await User.findOne({ where: { phone } });
      if (user) {
        if (!user.firebaseUid) {
          await user.update({ firebaseUid });
        }
      } else {
        user = await User.create({
          phone,
          firebaseUid,
          name: req.body.name || "Test User",
          email: req.body.email || null,
          referCode: await createUniqueReferCode(),
        });
      }

      return sendAuthResponse(res, 200, "Test authentication successful", user);
    }

    const { idToken } = req.body;
    if (!idToken) {
      throw createHttpError(400, "Firebase ID token is required");
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const phone = decodedToken.phone_number;

    if (!phone) {
      throw createHttpError(400, "Phone number not found in token");
    }

    const formattedPhone = phone.replace(/^\+91/, "");
    let user = await User.findOne({
      where: {
        [Op.or]: [{ firebaseUid }, { phone: formattedPhone }],
      },
    });

    if (user) {
      await user.update({ firebaseUid });
    } else {
      user = await User.create({
        phone: formattedPhone,
        firebaseUid,
        name: req.body.name || null,
        email: req.body.email || null,
        referCode: await createUniqueReferCode(),
      });
    }

    return sendAuthResponse(res, 200, "Authentication successful", user);
  } catch (error) {
    next(error.statusCode ? error : createHttpError(401, "Authentication failed"));
  }
};

const socialAuth = async (req, res, next) => {
  const { idToken, provider } = req.body;

  try {
    if (!idToken || !provider) {
      throw createHttpError(400, "ID token and provider are required");
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email || req.body.email || null;
    const name = decodedToken.name || req.body.name || null;
    const picture = decodedToken.picture || null;
    const providerId = decodedToken.firebase?.sign_in_provider;

    if (providerId && providerId !== `${provider}.com`) {
      throw createHttpError(400, `Token is not from ${provider}`);
    }

    let user = await User.findOne({ where: { firebaseUid } });
    if (!user && email) {
      user = await User.findOne({ where: { email } });
    }

    if (user) {
      await user.update({
        firebaseUid,
        name: user.name || name,
        image: user.image || picture,
      });
    } else {
      const tempPhone = req.body.phone || `SOCIAL-${provider.toUpperCase()}-${Date.now()}`;
      user = await User.create({
        name,
        email,
        firebaseUid,
        image: picture,
        phone: tempPhone,
        referCode: await createUniqueReferCode(),
      });
    }

    return sendAuthResponse(
      res,
      200,
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful`,
      user
    );
  } catch (error) {
    next(error.statusCode ? error : createHttpError(401, "Authentication failed"));
  }
};

const blockUser = async (req, res, next) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw createHttpError(404, "User not found.");
    }

    if (user.isBlocked === isBlocked) {
      throw createHttpError(400, `User is already ${isBlocked ? "blocked" : "unblocked"}.`);
    }

    await user.update({
      isBlocked,
      ...(isBlocked ? { otp: null, otpExpiry: null, firebaseUid: null } : {}),
    });

    return res.status(200).json({
      status: true,
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully.`,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  sendLoginOtp,
  resendOtp,
  verifyOtp,
  loginUser,
  updateUser,
  getAllUsers,
  getUserDetailsById,
  verifyFirebaseToken,
  socialAuth,
  blockUser,
};

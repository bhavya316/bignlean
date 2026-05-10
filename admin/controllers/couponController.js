const Coupon = require("../model/coupon");
const { validationResult } = require("express-validator");

const validateCouponForCart = (
  coupon,
  { unavailableMessage = "Coupon is not available" } = {}
) => {
  if (!coupon) {
    return { status: false, message: "Coupon not Found" };
  }

  if (Number(coupon.qty) < 1) {
    return { status: false, message: unavailableMessage };
  }

  if (coupon.expiryDate) {
    const expiryTime = new Date(coupon.expiryDate).getTime();
    if (!Number.isNaN(expiryTime) && Date.now() > expiryTime) {
      return { status: false, message: "Coupon has expired" };
    }
  }

  return { status: true };
};

const addCoupon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  const { category } = req.body;
  if (category !== "Price-wise" && category !== "Percentage-wise") {
    return res.status(400).json({
      status: false,
      message:
        "Invalid category. Allowed values are 'Price-wise' or 'Percentage-wise'.",
    });
  }

  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ status: true, message: "Coupon added.", coupon });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.errors[0].message,
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ status: true, message: "OK", coupons });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve coupons." });
  }
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  const { category } = req.body;
  if (category !== "Price-wise" && category !== "Percentage-wise") {
    return res.status(400).json({
      status: false,
      message:
        "Invalid category. Allowed values are 'Price-wise' or 'Percentage-wise'.",
    });
  }

  try {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res
        .status(404)
        .json({ status: false, message: "Coupon not found" });
    }

    const updatedCoupon = await coupon.update(req.body);
    res.status(200).json({
      status: true,
      message: "Coupon updated.",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update coupon." });
  }
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res
        .status(404)
        .json({ status: false, message: "Coupon not found" });
    }

    await coupon.destroy();
    res.status(200).json({ status: true, message: "Coupon deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete coupon." });
  }
};

module.exports = {
  validateCouponForCart,
  addCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};

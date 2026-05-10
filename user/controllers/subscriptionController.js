const Subscription = require("../model/subscription");
const Plan = require("../../admin/model/plan");
const { validationResult } = require("express-validator");

const calculateExpirationDate = (startDate, durationInMonths) => {
  const expireDate = new Date(startDate);
  expireDate.setMonth(expireDate.getMonth() + parseInt(durationInMonths, 10));
  return expireDate;
};

const addSubscription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const { user, plan } = req.body;
    const selectedPlan = await Plan.findByPk(plan);

    if (!selectedPlan) {
      return res.status(404).json({ status: false, message: "Plan not found" });
    }

    const currentUTCTime = new Date().toISOString();
    const purchaseAt = new Date(currentUTCTime);
    const expireAt = calculateExpirationDate(
      currentUTCTime,
      selectedPlan.duration
    );

    const newSubscription = await Subscription.create({
      user,
      plan,
      purchaseAt,
      expireAt,
    });

    res.status(201).json({
      status: true,
      message: "Subscription added.",
      subscription: newSubscription,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to add subscription.",
      error: error.message,
    });
  }
};

const getSubscriptionsByUser = async (req, res) => {
  const { user } = req.params;

  try {
    const subscriptions = await Subscription.findOne({ where: { user } });
    if (!subscriptions) {
      return res
        .status(201)
        .json({ status: true, message: "OK", hasPlan: false });
    }
    res
      .status(200)
      .json({ status: true, message: "OK", hasPlan: true, subscriptions });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subscriptions.",
      error: error.message,
    });
  }
};

const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res
        .status(404)
        .json({ status: false, message: "Subscription not found" });
    }

    await subscription.destroy();
    res.status(200).json({ status: true, message: "Subscription deleted." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to delete subscription.",
      error: error.message,
    });
  }
};

module.exports = {
  addSubscription,
  getSubscriptionsByUser,
  deleteSubscription,
};

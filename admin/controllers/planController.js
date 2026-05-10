const Plan = require("../model/plan");
const { validationResult } = require("express-validator");

const addPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ status: true, message: "Plan added.", plan });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({ order: [["createdAt", "DESC"]] });
    const decoded = plans.map((plan) => {
      plan.benefits = plan.benefits;
      return plan;
    });
    res.status(200).json({ status: true, message: "OK", plans: decoded });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve plans." });
  }
};

const updatePlan = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ status: false, message: "Plan not found" });
    }

    const updatedPlan = await plan.update(req.body);
    res
      .status(200)
      .json({ status: true, message: "Plan updated.", plan: updatedPlan });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ status: false, message: "Plan not found" });
    }

    await plan.destroy();
    res.status(200).json({ status: true, message: "Plan deleted." });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to delete plan." });
  }
};

module.exports = {
  addPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
};

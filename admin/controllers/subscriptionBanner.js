const SubcriptionBanner = require("../model/subscriptionBanner");

const addSubscriptionBanner = async (req, res) => {
  try {
    const { image } = req.body;
    await SubcriptionBanner.create({ image });
    res
      .status(201)
      .json({ status: true, message: "Subscription Banner added." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to add Subscription Banner." });
  }
};

const getAllSubscriptionBanners = async (req, res) => {
  try {
    const subscriptionBanners = await SubcriptionBanner.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", subscriptionBanners });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve subscription Banners.",
    });
  }
};

//delete
const deleteSubscriptionBanner = async (req, res) => {
  const id = req.params.id;

  try {
    const subscriptionBanner = await SubcriptionBanner.findByPk(id);

    if (!subscriptionBanner) {
      return res
        .status(404)
        .json({ status: false, message: "Subscription Banner not found" });
    }

    await subscriptionBanner.destroy();
    res
      .status(200)
      .json({ status: true, message: "Subscription Banner deleted." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to delete subscription Banner.",
    });
  }
};

module.exports = {
  addSubscriptionBanner,
  getAllSubscriptionBanners,
  deleteSubscriptionBanner,
};

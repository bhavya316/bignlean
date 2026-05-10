const { Op, Sequelize } = require("sequelize");
const Subscribe = require("../model/subscribe");

const addSubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    await Subscribe.create({
      email,
    });
    res.status(201).json({
      status: true,
    });
  } catch (error) {
    res.status(400).json({
      status: true,
    });
  }
};

const getAllSubscribe = async (req, res) => {
  const firstDate = req.query.firstDate;
  const endDate = req.query.endDate;

  try {
    let subscribe;
    if (firstDate && endDate) {
      subscribe = await Subscribe.findAll({
        where: {
          createdAt: {
            [Sequelize.Op.between]: [new Date(firstDate), new Date(endDate)],
          },
        },
      });
    } else {
      subscribe = await Subscribe.findAll();
    }

    res.status(200).json({ status: true, message: "OK", subscribe });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

module.exports = getAllSubscribe;

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    const subscribe = await Subscribe.findOne({
      where: {
        email,
      },
    });

    if (!subscribe) {
      return res.status(400).json({
        status: true,
        isSub: false,
        message: "Email not found",
      });
    }

    res.status(200).json({ status: true, isSub: true, message: "Subscribed" });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to check email.",
      error: error.message,
    });
  }
};

module.exports = {
  addSubscribe,
  getAllSubscribe,
  checkEmail,
};

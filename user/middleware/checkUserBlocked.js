// middleware/checkUserBlocked.js
const User = require("../model/user");

const checkUserBlocked = async (req, res, next) => {
  try {
    let user;
    if (req.params.id) {
      user = await User.findByPk(req.params.id);
    } else if (req.body.phone) {
      user = await User.findOne({ where: { phone: req.body.phone } });
    } else {
      return res.status(400).json({
        status: false,
        message: "User identifier (ID or phone) is required",
      });
    }

    if (user && user.isBlocked) {
      return res.status(403).json({
        status: false,
        message: "User account is blocked",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error checking user status",
      error: error.message,
    });
  }
};

module.exports = checkUserBlocked;
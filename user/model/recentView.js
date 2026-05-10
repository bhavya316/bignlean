const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RecentView = sequelize.define("recentViews", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = RecentView;
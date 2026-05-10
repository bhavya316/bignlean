const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Subscription = sequelize.define("subscriptions", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  purchaseAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expireAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Subscription;

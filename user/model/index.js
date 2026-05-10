const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("./user");
const Order = require("./order");
const Refer = require("./refer");
const Transaction = require("./transaction");
const Subscription = require("./subscription");

// Define associations
User.hasMany(Order, { foreignKey: 'user', as: 'orders' });

module.exports = {
  sequelize,
  User,
  Order,
  Refer,
  Transaction,
  Subscription
};
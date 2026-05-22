const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Coupon = sequelize.define("coupons", {
  coupon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  indexes: [
    { name: "coupons_coupon_unique", unique: true, fields: ["coupon"] },
  ],
});

module.exports = Coupon;

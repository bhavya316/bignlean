const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Cart = sequelize.define("carts", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  varientId: {
    type: DataTypes.INTEGER,
  },
  flavour: {
    type: DataTypes.STRING,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  mrp: {
    type: DataTypes.FLOAT,
  },
  sellingPrice: {
    type: DataTypes.FLOAT,
  },
  premiumPrice: {
    type: DataTypes.FLOAT,
  },
});

module.exports = Cart;

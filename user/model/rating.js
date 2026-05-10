const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Rating = sequelize.define("ratings", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tasteRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  mixabilityRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  efficacyRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  valueForMoneyRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Rating;

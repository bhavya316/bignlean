const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Category = sequelize.define("categories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageOn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageOff: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Category;

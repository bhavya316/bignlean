const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Brand = sequelize.define("brands", {
  subcatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  subcatId2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  banner: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  originCountry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  originCountryCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Brand;

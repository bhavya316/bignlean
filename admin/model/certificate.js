const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Certificate = sequelize.define("certificate", {
  brandName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Certificate;

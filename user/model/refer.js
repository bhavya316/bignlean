const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Refer = sequelize.define("refers", {
  referTo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  referBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Refer;

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const GymGuide = sequelize.define("gymGuide", {
  file: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = GymGuide;

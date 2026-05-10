const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const AboutFitness = sequelize.define("aboutFitness", {
  images: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  actors: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = AboutFitness;

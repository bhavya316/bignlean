const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Offer = sequelize.define("offers", {
  name: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  banner: {
    type: DataTypes.STRING,
  },
  products: {
    type: DataTypes.JSON,
  },
});

module.exports = Offer;

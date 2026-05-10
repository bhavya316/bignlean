const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SubcriptionBanner = sequelize.define("subcriptionBanner", {
  image: {
    type: DataTypes.STRING,
  },
});

module.exports = SubcriptionBanner;

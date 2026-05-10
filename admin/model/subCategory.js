const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SubCategory = sequelize.define("subCategories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  catId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = SubCategory;

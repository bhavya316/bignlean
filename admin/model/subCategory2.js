const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SubCategory2 = sequelize.define("subCategories2", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = SubCategory2;

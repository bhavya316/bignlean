const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ComboSubCategory = sequelize.define("comboSubCategories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  catId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ComboSubCategory;

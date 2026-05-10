const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ComboCategory = sequelize.define("comboCategories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ruleExactlyTwo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = ComboCategory;

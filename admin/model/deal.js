const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Deal = sequelize.define("deals", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  products: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isForLimitedTime: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expireDateTime: {
    type: DataTypes.DATE,
  },
});

module.exports = Deal;

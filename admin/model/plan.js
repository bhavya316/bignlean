const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Plan = sequelize.define("plans", {
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  benefits: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isArray: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Benefits must be an array.");
        }
      },
    },
  },
});

module.exports = Plan;

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Combo = sequelize.define("combos", {
  catId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  products: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isArray: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Products must be an array of product primary keys.");
        }
      },
    },
  },
});

module.exports = Combo;

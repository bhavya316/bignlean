const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Favorite = sequelize.define("favorites", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Favorite;

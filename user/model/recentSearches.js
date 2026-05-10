const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RecentSearches = sequelize.define("recentSerches", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RecentSearches;

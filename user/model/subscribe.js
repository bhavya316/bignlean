const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Subscribe = sequelize.define("subscribe", {
  email: {
    type: DataTypes.STRING,
  },
});

module.exports = Subscribe;

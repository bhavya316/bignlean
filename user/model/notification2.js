const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const NotificationSchedule = sequelize.define("notificationSchedule", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = NotificationSchedule;

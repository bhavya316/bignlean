const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("./user");

const DeviceToken = sequelize.define("deviceTokens", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deviceType: {
    type: DataTypes.STRING,
    allowNull: true, // android, ios, web
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Establish relationship
DeviceToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(DeviceToken, { foreignKey: 'userId' });

module.exports = DeviceToken;
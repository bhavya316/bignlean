const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Address = sequelize.define("addresses", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  landmark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Address;

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Admin = sequelize.define("admin", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indexes: [
    { name: "admins_phone_unique", unique: true, fields: ["phone"] },
    { name: "admins_email_unique", unique: true, fields: ["email"] },
  ],
});

module.exports = Admin;

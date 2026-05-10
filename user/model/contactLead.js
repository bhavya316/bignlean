const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ContactLead = sequelize.define("contactLead", {
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
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = ContactLead;

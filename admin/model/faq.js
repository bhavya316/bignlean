// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const FAQ = sequelize.define("faqs", {
//   heading: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   question: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   answer: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
// });

// module.exports = FAQ;


const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const FAQ = sequelize.define("faqs", {
  heading: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  // Ensure timestamps are enabled
  timestamps: true,
});

module.exports = FAQ;
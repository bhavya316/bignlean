// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const Banner = sequelize.define("banners", {
//   phone: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   tab: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   web: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   link: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Banner;


const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Banner = sequelize.define("banners", {
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tab: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  web: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.JSON, // Use JSON for MySQL
    allowNull: false,
    defaultValue: [], // Default to empty array
  },
  type: {
    type: DataTypes.ENUM('Hero Slider', 'Banner 1 Section', 'Banner 2 Section', 'Banner 3 Section'),
    allowNull: false,
    defaultValue: 'Hero Slider',
  },
});

module.exports = Banner;
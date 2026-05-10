const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const validator = require("validator");

const Blog = sequelize.define("blogs", {
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isUrlArray: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Images must be a non-empty list of URLs.");
        }
        value.forEach((url) => {
          if (!validator.isURL(url, { require_tld: false })) {
            throw new Error("Each image URL must be a valid URL.");
          }
        });
      },
    },
  },
  heading: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bodyText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Blog;

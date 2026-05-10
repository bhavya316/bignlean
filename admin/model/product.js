const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const validator = require("validator");

const Product = sequelize.define("products", {
  catId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subCatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subCatId2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isOnFlashSale: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isUrlList: (value) => {
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
  overView: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isDetailsList: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Details must be a non-empty list of maps.");
        }
        value.forEach((item) => {
          if (typeof item !== "object" || !item.heading || !item.body) {
            throw new Error(
              "Each item in the details list must be a map with 'heading' and 'body' properties."
            );
          }
        });
      },
    },
  },
  tables: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  information: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  supplements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  brand: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  hit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  varients: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  expiry_date: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  ,
  countryOfOrigin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVeg: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
}); 

module.exports = Product;

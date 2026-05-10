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
          if (!validator.isURL(url)) {
            throw new Error("Each image URL must be a valid URL.");
          }
        });
      },
    },
  },
  overView: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isOverviewList: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Overview must be a non-empty list of maps.");
        }
        value.forEach((item) => {
          if (typeof item !== "object" || !item.nutrients || !item.value) {
            throw new Error(
              "Each item in the overview list must be a map with 'nutrients' and 'value' properties."
            );
          }
        });
      },
    },
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
    allowNull: false,
    validate: {
      isTablesList: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Tables must be a non-empty list of maps.");
        }
        value.forEach((item) => {
          if (
            typeof item !== "object" ||
            !item.title ||
            !item.table ||
            !Array.isArray(item.table)
          ) {
            throw new Error(
              "Each item in the tables list must be a map with 'title' and 'table' properties (an array of maps)."
            );
          }
        });
      },
    },
  },
  information: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isInformationList: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Information must be a non-empty list of maps.");
        }
        value.forEach((item) => {
          if (typeof item !== "object" || !item.nutrients || !item.value) {
            throw new Error(
              "Each item in the information list must be a map with 'nutrients' and 'value' properties."
            );
          }
        });
      },
    },
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isUrlList: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Certificates must be a non-empty list of URLs.");
        }
        value.forEach((url) => {
          if (!validator.isURL(url)) {
            throw new Error("Each certificate URL must be a valid URL.");
          }
        });
      },
    },
  },
  supplements: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isUrlList: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Supplements must be a non-empty list of URLs.");
        }
        value.forEach((url) => {
          if (!validator.isURL(url)) {
            throw new Error("Each supplement URL must be a valid URL.");
          }
        });
      },
    },
  },
  brand: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isBrandObject: (value) => {
        if (typeof value !== "object" || !value.heading || !value.body) {
          throw new Error(
            "Brand must be a map with 'heading' and 'body' properties."
          );
        }
      },
    },
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
});

module.exports = Product;

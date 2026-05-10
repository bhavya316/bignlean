const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const validator = require("validator");

const ComboProduct = sequelize.define("comboProducts", {
  catId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comboCatId: {
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
    allowNull: true,
    defaultValue: [],
  },
  overView: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  tables: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  information: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  supplements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  brand: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
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
  },
});

const Brand = require("./brand");
const Category = require("./category");
const SubCategory = require("./subCategory");

// Define associations
Brand.hasMany(ComboProduct, {
  foreignKey: 'brandId',
  as: 'comboProducts'
});

ComboProduct.belongsTo(Brand, {
  foreignKey: 'brandId',
  as: 'brandInfo'
});

Category.hasMany(ComboProduct, {
  foreignKey: 'catId',
  as: 'comboProducts'
});

ComboProduct.belongsTo(Category, {
  foreignKey: 'catId',
  as: 'categoryInfo'
});

SubCategory.hasMany(ComboProduct, {
  foreignKey: 'subCatId',
  as: 'comboProducts'
});

ComboProduct.belongsTo(SubCategory, {
  foreignKey: 'subCatId',
  as: 'subCategoryInfo'
});

module.exports = ComboProduct;
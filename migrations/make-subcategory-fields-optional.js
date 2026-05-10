const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make catId optional in subCategories table
    await queryInterface.changeColumn("subCategories", "catId", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    // Make subCategoryId optional in subCategories2 table
    await queryInterface.changeColumn("subCategories2", "subCategoryId", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert catId back to required in subCategories table
    await queryInterface.changeColumn("subCategories", "catId", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });

    // Revert subCategoryId back to required in subCategories2 table
    await queryInterface.changeColumn("subCategories2", "subCategoryId", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });
  },
};
const { DataTypes } = require("sequelize");

const tableExists = async (queryInterface, tableName) => {
  try {
    await queryInterface.describeTable(tableName);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make catId optional in subCategories table
    if (await tableExists(queryInterface, "subCategories")) {
      await queryInterface.changeColumn("subCategories", "catId", {
        type: DataTypes.INTEGER,
        allowNull: true,
      });
    }

    // Make subCategoryId optional in subCategories2 table
    if (await tableExists(queryInterface, "subCategories2")) {
      await queryInterface.changeColumn("subCategories2", "subCategoryId", {
        type: DataTypes.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert catId back to required in subCategories table
    if (await tableExists(queryInterface, "subCategories")) {
      await queryInterface.changeColumn("subCategories", "catId", {
        type: DataTypes.INTEGER,
        allowNull: false,
      });
    }

    // Revert subCategoryId back to required in subCategories2 table
    if (await tableExists(queryInterface, "subCategories2")) {
      await queryInterface.changeColumn("subCategories2", "subCategoryId", {
        type: DataTypes.INTEGER,
        allowNull: false,
      });
    }
  },
};

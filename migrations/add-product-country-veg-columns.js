module.exports = {
  up: async (queryInterface, Sequelize) => {
    const productsTable = await queryInterface.describeTable("products");

    if (!productsTable.countryOfOrigin) {
      await queryInterface.addColumn("products", "countryOfOrigin", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!productsTable.isVeg) {
      await queryInterface.addColumn("products", "isVeg", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  down: async (queryInterface) => {
    const productsTable = await queryInterface.describeTable("products");

    if (productsTable.isVeg) {
      await queryInterface.removeColumn("products", "isVeg");
    }

    if (productsTable.countryOfOrigin) {
      await queryInterface.removeColumn("products", "countryOfOrigin");
    }
  },
};

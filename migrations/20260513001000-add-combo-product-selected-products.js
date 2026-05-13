module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("comboProducts");

    if (!table.products) {
      await queryInterface.addColumn("comboProducts", "products", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }

    if (!table.selectedProductIds) {
      await queryInterface.addColumn("comboProducts", "selectedProductIds", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable("comboProducts");

    if (table.selectedProductIds) {
      await queryInterface.removeColumn("comboProducts", "selectedProductIds");
    }

    if (table.products) {
      await queryInterface.removeColumn("comboProducts", "products");
    }
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("comboProducts");

    if (!table.mrp) {
      await queryInterface.addColumn("comboProducts", "mrp", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.sellingPrice) {
      await queryInterface.addColumn("comboProducts", "sellingPrice", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.price) {
      await queryInterface.addColumn("comboProducts", "price", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable("comboProducts");

    if (table.price) {
      await queryInterface.removeColumn("comboProducts", "price");
    }

    if (table.sellingPrice) {
      await queryInterface.removeColumn("comboProducts", "sellingPrice");
    }

    if (table.mrp) {
      await queryInterface.removeColumn("comboProducts", "mrp");
    }
  },
};

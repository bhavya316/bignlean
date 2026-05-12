module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("orders");
    if (!table.items) {
      await queryInterface.addColumn("orders", "items", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("orders");
    if (table.items) {
      await queryInterface.removeColumn("orders", "items");
    }
  },
};

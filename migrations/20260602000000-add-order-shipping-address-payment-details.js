module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("orders");

    if (!table.shippingAddress) {
      await queryInterface.addColumn("orders", "shippingAddress", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }

    if (!table.paymentDetails) {
      await queryInterface.addColumn("orders", "paymentDetails", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("orders");

    if (table.paymentDetails) {
      await queryInterface.removeColumn("orders", "paymentDetails");
    }

    if (table.shippingAddress) {
      await queryInterface.removeColumn("orders", "shippingAddress");
    }
  },
};

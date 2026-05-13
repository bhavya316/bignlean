module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("offers");

    if (!table.banner) {
      await queryInterface.addColumn("offers", "banner", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable("offers");

    if (table.banner) {
      await queryInterface.removeColumn("offers", "banner");
    }
  },
};

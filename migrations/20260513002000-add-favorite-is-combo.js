module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("favorites");

    if (!table.isCombo) {
      await queryInterface.addColumn("favorites", "isCombo", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable("favorites");

    if (table.isCombo) {
      await queryInterface.removeColumn("favorites", "isCombo");
    }
  },
};

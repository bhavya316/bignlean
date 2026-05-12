module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersTable = await queryInterface.describeTable("users");

    if (!usersTable.googleId) {
      await queryInterface.addColumn("users", "googleId", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }

    if (!usersTable.facebookId) {
      await queryInterface.addColumn("users", "facebookId", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }
  },

  down: async (queryInterface) => {
    const usersTable = await queryInterface.describeTable("users");

    if (usersTable.facebookId) {
      await queryInterface.removeColumn("users", "facebookId");
    }

    if (usersTable.googleId) {
      await queryInterface.removeColumn("users", "googleId");
    }
  },
};

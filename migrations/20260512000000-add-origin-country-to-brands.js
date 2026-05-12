module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("brands", "originCountry", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("brands", "originCountryCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("brands", "originCountryCode");
    await queryInterface.removeColumn("brands", "originCountry");
  },
};

const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  username: "bhavya",
  password: "bhavya123",
  database: "bignlean",
  host: "localhost",
  port: 3306,
});


module.exports = sequelize;

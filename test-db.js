const { Sequelize } = require("sequelize");
const sequelize = require("./config/database");

async function check() {
  const [results] = await sequelize.query("SELECT * FROM comboProducts WHERE id = 4");
  console.log("comboProducts:", results);
  const [results2] = await sequelize.query("SELECT * FROM combos WHERE id = 4");
  console.log("combos:", results2);
  const [results3] = await sequelize.query("SELECT * FROM products WHERE id = 4");
  console.log("products:", results3);
}
check().catch(console.error).finally(() => process.exit(0));

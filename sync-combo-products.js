const sequelize = require("./config/database");
const ComboProduct = require("./admin/model/comboProduct");

(async () => {
  try {
    console.log("Syncing ComboProduct table...");
    await ComboProduct.sync({ alter: true });
    console.log("ComboProducts table synced successfully.");
    console.log("Table schema:");
    console.log("- catId (INTEGER, required)");
    console.log("- comboCatId (INTEGER, required)");
    console.log("- subCatId (INTEGER, required)");
    console.log("- brandId (INTEGER, required)");
    console.log("- name (STRING, required)");
    console.log("- mrp, sellingPrice, price (DECIMAL)");
    console.log("- products, selectedProductIds (JSON)");
    console.log("- varients (JSON, required)");
    console.log("- All other fields are optional with defaults");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error syncing table:", error.message);
    await sequelize.close();
    process.exit(1);
  }
})();

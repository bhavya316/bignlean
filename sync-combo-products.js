const sequelize = require('./config/database');
const ComboProduct = require('./admin/model/comboProduct');

(async () => {
  try {
    console.log('Syncing ComboProduct table...');
    await ComboProduct.sync({ force: true });
    console.log('✅ ComboProducts table created successfully!');
    console.log('Table schema:');
    console.log('- catId (INTEGER, required)');
    console.log('- comboCatId (INTEGER, required)');
    console.log('- subCatId (INTEGER, required)');
    console.log('- brandId (INTEGER, required)');
    console.log('- name (STRING, required)');
    console.log('- varients (JSON, required)');
    console.log('- All other fields are optional with defaults');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    process.exit(1);
  }
})();
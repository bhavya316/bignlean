const sequelize = require('../config/database');

async function addProductCountryVegColumns() {
  try {
    console.log('Starting migration: add countryOfOrigin and isVeg to products...');

    const [countryCol] = await sequelize.query(
      "SHOW COLUMNS FROM `products` LIKE 'countryOfOrigin'"
    );
    if (countryCol.length === 0) {
      console.log('Adding countryOfOrigin column...');
      await sequelize.query(
        "ALTER TABLE `products` ADD COLUMN `countryOfOrigin` VARCHAR(255) NULL"
      );
      console.log('countryOfOrigin column added successfully');
    } else {
      console.log('countryOfOrigin column already exists');
    }

    const [isVegCol] = await sequelize.query(
      "SHOW COLUMNS FROM `products` LIKE 'isVeg'"
    );
    if (isVegCol.length === 0) {
      console.log('Adding isVeg column...');
      await sequelize.query(
        "ALTER TABLE `products` ADD COLUMN `isVeg` TINYINT(1) NOT NULL DEFAULT 0"
      );
      console.log('isVeg column added successfully');
    } else {
      console.log('isVeg column already exists');
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addProductCountryVegColumns()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

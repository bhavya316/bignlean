const sequelize = require('../config/database');

async function addSocialColumns() {
  try {
    console.log('Starting migration to add social auth columns...');
    
    // Check if googleId column exists
    const [googleIdResults] = await sequelize.query(
      "SHOW COLUMNS FROM `users` LIKE 'googleId'"
    );
    
    if (googleIdResults.length === 0) {
      console.log('Adding googleId column...');
      await sequelize.query(
        "ALTER TABLE `users` ADD COLUMN `googleId` VARCHAR(255) NULL"
      );
      console.log('googleId column added successfully');
    } else {
      console.log('googleId column already exists');
    }
    
    // Check if facebookId column exists
    const [facebookIdResults] = await sequelize.query(
      "SHOW COLUMNS FROM `users` LIKE 'facebookId'"
    );
    
    if (facebookIdResults.length === 0) {
      console.log('Adding facebookId column...');
      await sequelize.query(
        "ALTER TABLE `users` ADD COLUMN `facebookId` VARCHAR(255) NULL"
      );
      console.log('facebookId column added successfully');
    } else {
      console.log('facebookId column already exists');
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
addSocialColumns()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });



  
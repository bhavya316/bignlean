// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// // Get actual database columns first
// const getTableColumns = async () => {
//   try {
//     const [columns] = await sequelize.query("SHOW COLUMNS FROM `users`");
//     return columns.map(col => col.Field);
//   } catch (err) {
//     console.error("Error checking table structure:", err);
//     return [];
//   }
// };

// const User = sequelize.define("users", {
//   image: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   phone: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   gender: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   bglCash: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   dob: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   height: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//   },
//   weight: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//   },
//   referCode: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   otp: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   otpExpiry: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   firebaseUid: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     unique: true,
//   },
//   // Do not define googleId and facebookId here until they exist in the database
// });

// // Dynamically add fields if they exist in the database
// getTableColumns().then(columns => {
//   if (columns.includes('googleId')) {
//     User.init({
//       ...User.rawAttributes,
//       googleId: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         unique: true,
//       }
//     }, { sequelize });
//   }
  
//   if (columns.includes('facebookId')) {
//     User.init({
//       ...User.rawAttributes,
//       facebookId: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         unique: true,
//       }
//     }, { sequelize });
//   }
// });

// module.exports = User;


// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// // Get actual database columns first
// const getTableColumns = async () => {
//   try {
//     const [columns] = await sequelize.query("SHOW COLUMNS FROM `users`");
//     return columns.map(col => col.Field);
//   } catch (err) {
//     console.error("Error checking table structure:", err);
//     return [];
//   }
// };

// const User = sequelize.define("users", {
//   image: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   phone: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   gender: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   bglCash: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   dob: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   height: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//   },
//   weight: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//   },
//   referCode: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   otp: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   otpExpiry: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   firebaseUid: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     unique: true,
//   },
//   isBlocked: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
// });

// // Dynamically add fields if they exist in the database
// getTableColumns().then(columns => {
//   if (columns.includes('googleId')) {
//     User.init({
//       ...User.rawAttributes,
//       googleId: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         unique: true,
//       }
//     }, { sequelize });
//   }
  
//   if (columns.includes('facebookId')) {
//     User.init({
//       ...User.rawAttributes,
//       facebookId: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         unique: true,
//       }
//     }, { sequelize });
//   }
// });

// module.exports = User;


// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const User = sequelize.define("users", {
//   image: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   phone: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   gender: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   bglCash: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   dob: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   height: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//   },
//   weight: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//   },
//   referCode: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   otp: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   otpExpiry: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   firebaseUid: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     unique: true,
//   },
//   isBlocked: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
// });

// // Dynamically add fields if they exist in the database
// const getTableColumns = async () => {
//   try {
//     const [columns] = await sequelize.query("SHOW COLUMNS FROM `users`");
//     return columns.map(col => col.Field);
//   } catch (err) {
//     console.error("Error checking table structure:", err);
//     return [];
//   }
// };

// getTableColumns().then(columns => {
//   if (columns.includes('googleId') && !User.rawAttributes.googleId) {
//     User.addAttribute('googleId', {
//       type: DataTypes.STRING,
//       allowNull: true,
//       unique: true,
//     });
//   }
  
//   if (columns.includes('facebookId') && !User.rawAttributes.facebookId) {
//     User.addAttribute('facebookId', {
//       type: DataTypes.STRING,
//       allowNull: true,
//       unique: true,
//     });
//   }
// });

// module.exports = User;


const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define("users", {
  image: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.STRING, allowNull: true },
  bglCash: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
    set(value) {
      this.setDataValue("bglCash", Math.max(0, Math.floor(Number(value) || 0)));
    },
  },
  dob: { type: DataTypes.STRING, allowNull: true },
  height: { type: DataTypes.FLOAT, allowNull: true },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  referCode: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING, allowNull: true },
  otpExpiry: { type: DataTypes.DATE, allowNull: true },
  firebaseUid: { type: DataTypes.STRING, allowNull: true },
  isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  // Optional fields, will be ignored if not present in DB
  googleId: { type: DataTypes.STRING, allowNull: true },
  facebookId: { type: DataTypes.STRING, allowNull: true },
}, {
  indexes: [
    { name: "users_phone_unique", unique: true, fields: ["phone"] },
    { name: "users_firebase_uid_unique", unique: true, fields: ["firebaseUid"] },
    { name: "users_google_id_unique", unique: true, fields: ["googleId"] },
    { name: "users_facebook_id_unique", unique: true, fields: ["facebookId"] },
  ],
});

module.exports = User;

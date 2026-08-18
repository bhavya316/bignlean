// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/database");

// const Order = sequelize.define("orders", {
//   user: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   product: {
//     type: DataTypes.JSON,
//     allowNull: false,
//   },
//   address: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   usedCoupon: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
//   coupon: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   couponDiscount: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   amount: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   qty: {
//     type: DataTypes.JSON,
//     allowNull: false,
//   },
//   paymentMethod: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   transactionId: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   usedBGLCash: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
//   bglCash: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   earnedBglCash: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   shiping: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   totalAmount: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   orderID: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   trackingID: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   status: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: "Processing",
//   },
// });

// module.exports = Order;


const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Order = sequelize.define("orders", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  address: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usedCoupon: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  coupon: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  couponDiscount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentDetails: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  usedBGLCash: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  bglCash: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  earnedBglCash: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  shiping: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trackingID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Processing", "Accepted", "Shipped", "Out_for_Delivery", "Delivered","Cancelled"),
    allowNull: false,
    defaultValue: "Processing",
  },
});

module.exports = Order;

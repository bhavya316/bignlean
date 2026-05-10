const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Transaction = sequelize.define("Transaction", {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM("in", "out"),
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Transaction.calculateFinalValueForUser = async (userId) => {
  try {
    const transactions = await Transaction.findAll({ 
      where: { user: userId } 
    });
    
    if (!transactions || transactions.length === 0) {
      return 0;
    }
    
    // Calculate balance by summing transactions
    let balance = 0;
    for (const transaction of transactions) {
      if (transaction.type === "in") {
        balance += transaction.value;
      } else if (transaction.type === "out") {
        balance -= transaction.value;
      }
    }
    
    return balance;
  } catch (error) {
    console.error("Error calculating wallet balance:", error);
    return 0;
  }
};
module.exports = Transaction;

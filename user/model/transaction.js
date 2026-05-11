const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("./user");

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

const getWalletValue = (value) => Math.max(0, Math.floor(Number(value) || 0));

const getUserWalletBalance = async (userId, options = {}) => {
  const user = await User.findByPk(userId, {
    attributes: ["bglCash"],
    transaction: options.transaction,
  });

  return getWalletValue(user?.bglCash);
};

const updateUserWalletBalance = async (userId, delta, options = {}) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "bglCash"],
    transaction: options.transaction,
  });

  if (!user) {
    throw new Error("Wallet user not found");
  }

  const currentBalance = getWalletValue(user.bglCash);
  const nextBalance = currentBalance + delta;

  if (nextBalance < 0) {
    throw new Error(`Insufficient wallet balance. Available: ${currentBalance}`);
  }

  await User.update(
    { bglCash: nextBalance },
    {
      where: { id: userId },
      transaction: options.transaction,
    }
  );

  return nextBalance;
};

Transaction.calculateWalletSummaryForUser = async (userId) => {
  try {
    const [user, transactions] = await Promise.all([
      User.findByPk(userId, { attributes: ["bglCash"] }),
      Transaction.findAll({
        where: { user: userId },
      }),
    ]);

    const walletBalance = getWalletValue(user?.bglCash);
    let transactionTotalIn = 0;
    let totalOut = 0;

    for (const transaction of transactions) {
      const value = getWalletValue(transaction.value);

      if (transaction.type === "in") {
        transactionTotalIn += value;
      } else if (transaction.type === "out") {
        totalOut += value;
      }
    }

    return {
      baseBglCash: walletBalance,
      walletBalance,
      transactionTotalIn,
      totalIn: transactionTotalIn,
      totalOut,
      ledgerBalance: Math.max(transactionTotalIn - totalOut, 0),
      balance: walletBalance,
    };
  } catch (error) {
    console.error("Error calculating wallet balance:", error);
    return {
      baseBglCash: 0,
      walletBalance: 0,
      transactionTotalIn: 0,
      totalIn: 0,
      totalOut: 0,
      ledgerBalance: 0,
      balance: 0,
    };
  }
};

Transaction.calculateFinalValueForUser = async (userId) => {
  const summary = await Transaction.calculateWalletSummaryForUser(userId);
  return summary.balance;
};

Transaction.beforeCreate(async (transaction) => {
  const rawValue = Number(transaction.value) || 0;

  if (rawValue < 0) {
    throw new Error("Transaction value cannot be negative");
  }

  const value = getWalletValue(rawValue);
  transaction.value = value;

  if (transaction.type === "out") {
    const balance = await getUserWalletBalance(transaction.user);
    if (value > balance) {
      throw new Error(`Insufficient wallet balance. Available: ${balance}`);
    }
  }
});

Transaction.afterCreate(async (transaction, options) => {
  const value = getWalletValue(transaction.value);
  if (value <= 0) return;

  const delta = transaction.type === "in" ? value : -value;
  await updateUserWalletBalance(transaction.user, delta, options);
});

module.exports = Transaction;

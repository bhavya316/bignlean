const Transaction = require("../model/transaction");

const addTransaction = async (user, orderId, title, type, value) => {
  try {
    const newTransaction = await Transaction.create({
      user,
      orderId,
      title,
      type,
      value,
    });
    return {
      status: true,
      message: "Transaction added.",
      transaction: newTransaction,
    };
  } catch (error) {
    console.error(error);
    return { status: false, message: "Unable to add transaction." };
  }
};

const getTransactionsByUser = async (userId) => {
  const transactions = await Transaction.findAll({ where: { user: userId } });
  return transactions;
};

const removeTransactionById = async (transactionId) => {
  try {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return { status: false, message: "Transaction not found" };
    }

    await transaction.destroy();
    return { status: true, message: "Transaction removed." };
  } catch (error) {
    console.error(error);
    return { status: false, message: "Unable to remove transaction." };
  }
};

module.exports = {
  addTransaction,
  getTransactionsByUser,
  removeTransactionById,
};

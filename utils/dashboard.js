const moment = require("moment");
const Order = require("../user/model/order");
const User = require("../user/model/user");
const Product = require("../admin/model/product");
const Address = require("../user/model/address");
const sequelize = require("../config/database");
const { Op, or } = require("sequelize");
const Subscription = require("../user/model/subscription");
const Plan = require("../admin/model/plan");

const getSalesAnalysis = async (req, res) => {
  try {
    const currentDate = new Date();

    const yearlyAnalysis = await getAnalysisByPeriod(currentDate, "year");

    const monthlyAnalysis = await getAnalysisByPeriod(currentDate, "month");

    const currentYear = moment(currentDate).year();
    const lastYearStartDate = moment(currentDate)
      .subtract(1, "year")
      .startOf("year")
      .toDate();
    const lastYearEndDate = moment(currentDate)
      .subtract(1, "year")
      .endOf("year")
      .toDate();

    const currentYearMonthlyData = await getMonthlyData(currentYear);
    const lastYearMonthlyData = await getMonthlyData(
      currentYear - 1,
      lastYearStartDate,
      lastYearEndDate
    );

    const recentOrders = await getRecentOrders();
    const subscriptions = await getSubscription();

    res.status(200).json({
      status: true,
      message: "Sales analysis retrieved successfully.",
      dashboard: {
        yearly: yearlyAnalysis,
        monthly: monthlyAnalysis,
        monthlyChart: {
          currentYear: currentYearMonthlyData,
          lastYear: lastYearMonthlyData,
        },
        recentOrders: recentOrders,
        subscriptions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error retrieving sales analysis.",
      error: error.message,
    });
  }
};

const getMonthlyData = async (year, startDate, endDate) => {
  startDate = startDate || moment().year(year).startOf("year").toDate();
  endDate = endDate || moment().year(year).endOf("year").toDate();

  const monthlyData = await Order.findAll({
    attributes: [
      [sequelize.fn("MONTHNAME", sequelize.col("createdAt")), "month"],
      [sequelize.fn("SUM", sequelize.col("amount")), "totalPrice"],
    ],
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [sequelize.fn("MONTHNAME", sequelize.col("createdAt"))],
  });

  const allMonths = moment.months();
  const monthlyResults = allMonths.map((month) => {
    const matchingData = monthlyData.find(
      (data) => data.getDataValue("month") === month
    );
    return {
      month,
      totalPrice: matchingData ? matchingData.getDataValue("totalPrice") : 0,
    };
  });

  return monthlyResults;
};

const getAnalysisByPeriod = async (currentDate, period) => {
  try {
    let startDate, endDate;

    if (period === "year") {
      const currentYear = moment(currentDate).year();
      startDate = moment(currentDate).startOf("year").toDate();
      endDate = moment(currentDate).endOf("year").toDate();
      const lastYearStartDate = moment(currentDate)
        .subtract(1, "year")
        .startOf("year")
        .toDate();
      const lastYearEndDate = moment(currentDate)
        .subtract(1, "year")
        .endOf("year")
        .toDate();

      const currentYearAnalysis = await Order.findOne({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("qty")), "totalQty"],
          [sequelize.fn("SUM", sequelize.col("amount")), "totalPrice"],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const lastYearAnalysis = await Order.findOne({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("qty")), "totalQty"],
          [sequelize.fn("SUM", sequelize.col("amount")), "totalPrice"],
        ],
        where: {
          createdAt: {
            [Op.between]: [lastYearStartDate, lastYearEndDate],
          },
        },
      });

      const percentChangeSales = calculatePercentChange(
        currentYearAnalysis.dataValues.totalQty,
        lastYearAnalysis.dataValues.totalQty
      );
      const percentChangePrice = calculatePercentChange(
        currentYearAnalysis.dataValues.totalPrice,
        lastYearAnalysis.dataValues.totalPrice
      );

      return {
        totalQty: currentYearAnalysis.totalQty || 0,
        totalPrice: currentYearAnalysis.totalPrice || 0,
        percentChangeSales:
          percentChangeSales !== null
            ? percentChangeSales
            : currentYearAnalysis.totalQty === 0
            ? 100
            : -100,
        percentChangePrice:
          percentChangePrice !== null
            ? percentChangePrice
            : currentYearAnalysis.totalPrice === 0
            ? 100
            : -100,
      };
    } else if (period === "month") {
      startDate = moment(currentDate).startOf("month").toDate();
      endDate = moment(currentDate).endOf("month").toDate();

      const lastMonthStartDate = moment(currentDate)
        .subtract(1, "month")
        .startOf("month")
        .toDate();
      const lastMonthEndDate = moment(currentDate)
        .subtract(1, "month")
        .endOf("month")
        .toDate();

      const currentMonthAnalysis = await Order.findOne({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("qty")), "totalQty"],
          [sequelize.fn("SUM", sequelize.col("amount")), "totalPrice"],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const lastMonthAnalysis = await Order.findOne({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("qty")), "totalQty"],
          [sequelize.fn("SUM", sequelize.col("amount")), "totalPrice"],
        ],
        where: {
          createdAt: {
            [Op.between]: [lastMonthStartDate, lastMonthEndDate],
          },
        },
      });

      const percentChangeSales = calculatePercentChange(
        currentMonthAnalysis.dataValues.totalQty,
        lastMonthAnalysis.dataValues.totalQty
      );
      const percentChangePrice = calculatePercentChange(
        currentMonthAnalysis.dataValues.totalPrice,
        lastMonthAnalysis.dataValues.totalPrice
      );

      return {
        totalQty: currentMonthAnalysis.totalQty || 0,
        totalPrice: currentMonthAnalysis.totalPrice || 0,
        percentChangeSales:
          percentChangeSales !== null
            ? percentChangeSales
            : currentMonthAnalysis.totalQty === 0
            ? 100
            : -100,
        percentChangePrice:
          percentChangePrice !== null
            ? percentChangePrice
            : currentMonthAnalysis.totalPrice === 0
            ? 100
            : -100,
      };
    } else {
      throw new Error("Invalid period");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const calculatePercentChange = (currentValue, previousValue) => {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

const getRecentOrders = async () => {
  try {
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    const filtered = [];
    for (var order of recentOrders) {
      const user = await User.findByPk(order.user);
      if (user) {
        const address = await Address.findByPk(order.address);
        const productDetails = [];
        for (const pId of order.product) {
          const product = await Product.findByPk(pId);
          if (product) {
            productDetails.push(product.dataValues);
          }
        }
        const newOrder = {
          ...order.dataValues,
          user: user.dataValues,
          address: address.dataValues,
          product: productDetails,
        };
        filtered.push(newOrder);
      }
    }

    return filtered;
  } catch (error) {
    console.error(error);
  }
};

const getSubscription = async () => {
  try {
    const subscriptions = await Subscription.findAll();

    const filtered = [];
    let totalEarning = 0;
    const currentDate = new Date();

    for (const sub of subscriptions) {
      sub.plan = await Plan.findByPk(sub.plan);
      totalEarning += parseFloat(sub.plan.price);
      filtered.push(sub);
    }

    const yearStart = new Date(currentDate.getFullYear(), 0, 1);
    const yearEarnings = filtered.reduce((acc, sub) => {
      const purchaseDate = new Date(sub.purchaseAt);
      if (purchaseDate >= yearStart) {
        return acc + parseFloat(sub.plan.price);
      }
      return acc;
    }, 0);
    const yearPercentage = (yearEarnings / totalEarning) * 100;

    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const monthEarnings = filtered.reduce((acc, sub) => {
      const purchaseDate = new Date(sub.purchaseAt);
      if (purchaseDate >= monthStart) {
        return acc + parseFloat(sub.plan.price);
      }
      return acc;
    }, 0);
    const monthPercentage = (monthEarnings / totalEarning) * 100;

    const weekStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    const weekEarnings = filtered.reduce((acc, sub) => {
      const purchaseDate = new Date(sub.purchaseAt);
      if (purchaseDate >= weekStart) {
        return acc + parseFloat(sub.plan.price);
      }
      return acc;
    }, 0);
    const weekPercentage = (weekEarnings / totalEarning) * 100;
    return {
      totalEarning,
      yearPercentage,
      monthPercentage,
      weekPercentage,
    };
  } catch (e) {
    return null;
  }
};

module.exports = {
  getSalesAnalysis,
  getSubscription,
};

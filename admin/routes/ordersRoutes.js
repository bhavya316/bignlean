// const express = require("express");
// const router = express.Router();
// const Order = require("../../user/model/order");
// const Address = require("../../user/model/address");
// const User = require("../../user/model/user");
// const Product = require("../model/product");

// function formatDate(inputDate) {
//   const date = new Date(inputDate);
//   const options = { weekday: "short", day: "numeric", month: "short" };
//   const formattedDate = date.toLocaleDateString("en-US", options);
//   return formattedDate;
// }

// router.get("/orders", async (req, res) => {
//   try {
//     const orders = await Order.findAll();
//     const active = [];
//     const completed = [];
//     for (const order of orders) {
//       const productIds = order.product;
//       const productQty = order.qty;
//       let finalProductList = [];

//       for (var i = 0; i < productIds.length; i++) {
//         const product = await Product.findByPk(productIds[i]);
//         console.log(productIds[i]);
//         if (product) {
//           const newProduct = {
//             ...product.dataValues,
//             qty: productQty[i],
//           };
//           finalProductList.push(newProduct);
//         }
//       }

//       delete order.qty;
//       delete order.usedCoupon;
//       delete order.coupon;
//       delete order.amount;
//       delete order.updatedAt;
//       order.product = finalProductList;
//       const orderDate = formatDate(order.createdAt);
//       order.createdAt = orderDate;

//       order.address = await Address.findByPk(order.address);
//       order.user = await User.findByPk(order.user);

//       if (order.status == "Completed") {
//         completed.push(order);
//       } else {
//         active.push(order);
//       }
//     }

//     res.status(200).json({ status: true, message: "OK", active, completed });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Order = require("../../user/model/order");
const Address = require("../../user/model/address");
const User = require("../../user/model/user");
const Product = require("../model/product");

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { weekday: "short", day: "numeric", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

// router.get("/orders", async (req, res) => {
//   try {
//     // Fetch orders sorted by createdAt in descending order
//     const orders = await Order.findAll({
//       order: [['createdAt', 'DESC']]
//     });
//     const active = [];
//     const completed = [];
//     for (const order of orders) {
//       const productIds = order.product;
//       const productQty = order.qty;
//       let finalProductList = [];

//       for (let i = 0; i < productIds.length; i++) {
//         const product = await Product.findByPk(productIds[i]);
//         console.log(productIds[i]);
//         if (product) {
//           const newProduct = {
//             ...product.dataValues,
//             qty: productQty[i],
//           };
//           finalProductList.push(newProduct);
//         }
//       }

//       delete order.qty;
//       delete order.usedCoupon;
//       delete order.coupon;
//       delete order.amount;
//       delete order.updatedAt;
//       order.product = finalProductList;
//       const orderDate = formatDate(order.createdAt);
//       order.createdAt = orderDate;

//       order.address = await Address.findByPk(order.address);
//       order.user = await User.findByPk(order.user);

//       if (order.status === "Completed") {
//         completed.push(order);
//       } else {
//         active.push(order);
//       }
//     }

//     res.status(200).json({ status: true, message: "OK", active, completed });
//   } catch (error) {
//     console.error("Error in /orders endpoint:", error.message, error.stack);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

router.get("/orders", async (req, res) => {
  try {
    // Fetch orders sorted by createdAt in descending order
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });

    const active = [];
    const completed = [];

    // Process orders in parallel to improve performance
    const orderPromises = orders.map(async (order) => {
      const productIds = order.product || []; // Ensure product is an array
      const productQty = order.qty || []; // Ensure qty is an array

      // Fetch products in parallel
      const productPromises = productIds.map(async (id, index) => {
        const product = await Product.findByPk(id);
        return product ? { ...product.dataValues, qty: productQty[index] || 0 } : null;
      });

      const products = (await Promise.all(productPromises)).filter((p) => p !== null);

      // Remove unwanted fields
      const { qty, usedCoupon, coupon, amount, updatedAt, ...orderData } = order.dataValues;

      // Format order with necessary data
      orderData.product = products;
      orderData.createdAt = formatDate(order.createdAt);
      orderData.address = await Address.findByPk(order.address);
      orderData.user = await User.findByPk(order.user);

      // Categorize order based on status
      if (orderData.status === "Delivered") {
        completed.push(orderData);
      } else {
        active.push(orderData);
      }
    });

    await Promise.all(orderPromises);

    res.status(200).json({ status: true, message: "OK", active, completed });
  } catch (error) {
    console.error("Error in /orders endpoint:", error.message, error.stack);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
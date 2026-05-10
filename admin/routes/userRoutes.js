const express = require("express");
const router = express.Router();
const userController = require("../../user/controllers/userController");
const referController = require("../controllers/referController");

router.get("/users", userController.getAllUsers);
router.get("/getReferrals", referController.getReferes);

module.exports = router;

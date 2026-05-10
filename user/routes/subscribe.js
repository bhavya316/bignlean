const express = require("express");
const router = express.Router();
const subscribeController = require("../controllers/subscribe");

router.post("/subscribe", subscribeController.addSubscribe);
router.get("/subscribe", subscribeController.getAllSubscribe);
router.post("/checkEmail", subscribeController.checkEmail);

module.exports = router;

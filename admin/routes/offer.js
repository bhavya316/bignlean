const express = require("express");
const router = express.Router();
const OfferController = require("../controllers/offer");

router.post("/offers", OfferController.addOffer);
router.delete("/offers/:id", OfferController.deleteOffer);
router.get("/offers", OfferController.getAllOffers);
router.get("/offers/:id", OfferController.getOfferById);

module.exports = router;

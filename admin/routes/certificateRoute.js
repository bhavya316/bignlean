const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

router.post("/certificate", certificateController.addCertificate);
router.get("/certificate", certificateController.getAllCertificates);
router.put("/certificate/:id", certificateController.updateCertificate);
router.delete("/certificate/:id", certificateController.deleteCertificate);

module.exports = router;

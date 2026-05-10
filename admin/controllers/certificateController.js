const Certificate = require("../model/certificate");

const addCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Certificate added.", certificate });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to add certificate." });
  }
};

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", certificates });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve certificates." });
  }
};

const updateCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) {
      return res
        .status(404)
        .json({ status: false, message: "Certificate not found" });
    }

    const updatedCertificate = await certificate.update(req.body);
    res.status(200).json({
      status: true,
      message: "Certificate updated.",
      certificate: updatedCertificate,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to update certificate." });
  }
};

const deleteCertificate = async (req, res) => {
  const { id } = req.params;

  try {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) {
      return res
        .status(404)
        .json({ status: false, message: "Certificate not found" });
    }

    await certificate.destroy();
    res.status(200).json({ status: true, message: "Certificate deleted." });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to delete certificate." });
  }
};

module.exports = {
  addCertificate,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
};

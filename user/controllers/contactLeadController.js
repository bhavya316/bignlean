const ContactLead = require("../model/contactLead");

const addContactLead = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    const newContactLead = await ContactLead.create({
      name,
      phone,
      email,
      message,
    });
    res.status(201).json({
      status: true,
      message: "OK",
      contactLead: newContactLead,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to add ContactLead." });
  }
};

const getAllContactLeads = async (req, res) => {
  try {
    const contactLeads = await ContactLead.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", contactLeads });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve ContactLeads." });
  }
};

module.exports = {
  addContactLead,
  getAllContactLeads,
};

const Address = require("../model/address");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

const addAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    if (req.body.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { user: req.body.user, id: { [Op.ne]: null } } }
      );
    }

    const newAddress = await Address.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Address added.", address: newAddress });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to add address.",
      error: error.message,
    });
  }
};

const getAddressesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const addresses = await Address.findAll({
      where: {
        user: userId,
      },
    });

    res.status(200).json({
      status: true,
      message: "Addresses retrieved by user.",
      addresses,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to retrieve addresses by user.",
      error: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const address = await Address.findByPk(id);
    if (!address) {
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    }

    if (req.body.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { user: address.user, id: { [Op.ne]: address.id } } }
      );
    }

    const updatedAddress = await address.update(req.body);
    res.status(200).json({
      status: true,
      message: "Address updated.",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to update address.",
      error: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findByPk(id);
    if (!address) {
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    }

    await address.destroy();
    res.status(200).json({ status: true, message: "Address deleted." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to delete address.",
      error: error.message,
    });
  }
};

module.exports = {
  addAddress,
  getAddressesByUser,
  updateAddress,
  deleteAddress,
};

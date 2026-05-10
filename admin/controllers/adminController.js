const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Admin = require("../model/admin");

const createAdmin = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ status: false, message: "Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: true,
      message: "Admin created successfully.",
      admin: newAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const admin = await Admin.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!admin) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials." });
    }

    res.status(200).json({ status: true, message: "Login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    const admin = await Admin.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!admin) {
      return res
        .status(404)
        .json({ status: false, message: "Admin not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res
      .status(200)
      .json({ status: true, message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  resetPassword,
};

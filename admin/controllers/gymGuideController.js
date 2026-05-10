const GymGuide = require("../model/gymGuide");

const addGymGuide = async (req, res) => {
  try {
    const { file, description } = req.body;
    const newGymGuide = await GymGuide.create({ file, description });
    res.status(201).json({
      status: true,
      message: "GymGuide added.",
      gymGuide: newGymGuide,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to create GymGuide." });
  }
};

const getAllGymGuides = async (req, res) => {
  try {
    const gymGuideList = await GymGuide.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", gymGuideList });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve GymGuide records." });
  }
};

const deleteGymGuide = async (req, res) => {
  const gymGuideId = req.params.id;

  try {
    const gymGuide = await GymGuide.findByPk(gymGuideId);

    if (!gymGuide) {
      return res
        .status(404)
        .json({ status: false, message: "GymGuide not found" });
    }

    await gymGuide.destroy();

    res.status(200).json({ status: true, message: "GymGuide deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to delete GymGuide." });
  }
};

module.exports = {
  addGymGuide,
  getAllGymGuides,
  deleteGymGuide,
};

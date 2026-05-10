const AboutFitness = require("../model/aboutFitness");

const addAboutFitness = async (req, res) => {
  try {
    const { images, description, actors } = req.body;
    const newAboutFitness = await AboutFitness.create({
      images,
      description,
      actors,
    });
    res.status(201).json({
      status: true,
      message: "AboutFitness added.",
      aboutFitness: newAboutFitness,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to create AboutFitness." });
  }
};

const getAllAboutFitness = async (req, res) => {
  try {
    const aboutFitnessList = await AboutFitness.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: true, message: "OK", aboutFitnessList });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: "Unable to retrieve AboutFitness records.",
    });
  }
};

const deleteAboutFitness = async (req, res) => {
  const aboutFitnessId = req.params.id;

  try {
    const aboutFitness = await AboutFitness.findByPk(aboutFitnessId);

    if (!aboutFitness) {
      return res
        .status(404)
        .json({ status: false, message: "AboutFitness not found" });
    }

    await aboutFitness.destroy();
    res.status(200).json({ status: true, message: "AboutFitness deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to delete AboutFitness." });
  }
};

const updateAboutFitness = async (req, res) => {
  const aboutFitnessId = req.params.id;
  try {
    const aboutFitness = await AboutFitness.findByPk(aboutFitnessId);

    if (!aboutFitness) {
      return res
        .status(404)
        .json({ status: false, message: "AboutFitness not found" });
    }

    const updatedAboutFitness = await aboutFitness.update(req.body);
    res.status(200).json({
      status: true,
      message: "AboutFitness updated",
      aboutFitness: updatedAboutFitness,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to update AboutFitness." });
  }
};

module.exports = {
  addAboutFitness,
  getAllAboutFitness,
  deleteAboutFitness,
  updateAboutFitness,
};

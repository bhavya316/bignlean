const FAQ = require("../model/faq");

// Add a new FAQ
const addFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ status: true, message: "FAQ added.", faq });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to add FAQ." });
  }
};

// Get all FAQs
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ status: true, message: "OK", faqs });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve FAQs." });
  }
};

// Update a FAQ by ID
const updateFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({ status: false, message: "FAQ not found" });
    }
    const updatedFAQ = await faq.update(req.body);
    res
      .status(200)
      .json({ status: true, message: "FAQ updated.", faq: updatedFAQ });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to update FAQ." });
  }
};

// Delete a FAQ by ID
const deleteFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({ status: false, message: "FAQ not found" });
    }
    await faq.destroy();
    res.status(200).json({ status: true, message: "FAQ deleted." });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to delete FAQ." });
  }
};

// const getGroupedFAQs = async (req, res) => {
//   try {
//     const faqs = await FAQ.findAll({ order: [["createdAt", "DESC"]] });
//     const groupedFAQs = {};

//     // Group FAQs by heading
//     faqs.forEach((faq) => {
//       if (!groupedFAQs[faq.heading]) {
//         groupedFAQs[faq.heading] = [];
//       }
//       groupedFAQs[faq.heading].push(faq);
//     });

//     res
//       .status(200)
//       .json({ status: true, message: "Grouped FAQs", faqs: groupedFAQs });
//   } catch (error) {
//     res.status(400).json({ status: false, message: "Unable to group FAQs." });
//   }
// };
const getGroupedFAQs = async (req, res) => {
  try {
    // Fetch FAQs sorted by createdAt in ascending order
    const faqs = await FAQ.findAll({
      order: [["createdAt", "ASC"]],
      attributes: ["id", "heading", "question", "answer", "createdAt", "updatedAt"], // Explicitly select fields
    });

    // Group FAQs by heading
    const groupedFAQs = {};
    faqs.forEach((faq) => {
      // Validate required fields
      if (!faq.heading || !faq.question || !faq.answer) {
        console.warn(`FAQ with ID ${faq.id} is missing required fields:`, faq.dataValues);
        return; // Skip invalid FAQs
      }

      if (!groupedFAQs[faq.heading]) {
        groupedFAQs[faq.heading] = [];
      }
      groupedFAQs[faq.heading].push({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      });
    });

    // Ensure FAQs within each group are sorted by createdAt ASC (optional, for safety)
    Object.keys(groupedFAQs).forEach((heading) => {
      groupedFAQs[heading].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    res.status(200).json({
      status: true,
      message: "Grouped FAQs retrieved successfully",
      faqs: groupedFAQs,
    });
  } catch (error) {
    console.error("Error in /admin/faqs endpoint:", error.message, error.stack);
    res.status(500).json({
      status: false,
      message: "Unable to group FAQs due to server error",
      error: error.message,
    });
  }
};

module.exports = {
  addFAQ,
  getAllFAQs,
  updateFAQ,
  deleteFAQ,
  getGroupedFAQs,
};

// const Banner = require("../model/banners");

// const createBanner = async (req, res) => {
//   try {
//     await Banner.create(req.body);
//     res.status(201).json({ status: true, message: "Banner added." });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ status: false, message: "Unable to create banner." });
//   }
// };

// const getAllBanners = async (req, res) => {
//   try {
//     const banner = await Banner.findAll({ order: [["createdAt", "DESC"]] });
//     res.status(200).json({ status: true, message: "OK", banner });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ status: false, message: "Unable to retrieve banner." });
//   }
// };

// const deleteBanner = async (req, res) => {
//   try {
//     const { id } = req.query;
//     const deleted = await Banner.destroy({
//       where: { id },
//     });
//     if (deleted) {
//       res.json({ status: true, message: "Banner deleted" });
//     } else {
//       res.status(404).json({ status: false, message: "Banner not found" });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .json({ status: false, message: "Unable to delete banner." });
//   }
// };

// module.exports = { createBanner, getAllBanners, deleteBanner };

const Banner = require("../model/banners");

const normalizeLink = (link) => {
  if (Array.isArray(link)) return link.filter(Boolean);
  if (typeof link === "string" && link.trim() !== "") return [link.trim()];
  return [];
};

const createBanner = async (req, res) => {
  try {
    const { phone, tab, web, link, type } = req.body;
    // Ensure link is an array, default to [] if invalid
    const bannerData = {
      phone,
      tab,
      web,
      link: normalizeLink(link),
      type: type || 'Hero Slider', // Default to 'Hero Slider' if not provided
    };
    await Banner.create(bannerData);
    res.status(201).json({ status: true, message: "Banner added." });
  } catch (error) {
    console.error("Error creating banner:", error);
    res
      .status(400)
      .json({ status: false, message: "Unable to create banner.", error: error.message });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({ order: [["createdAt", "DESC"]] });
    // Ensure link is always an array
    const formattedBanners = banners.map((banner) => {
      let linkArray = [];
      try {
        if (typeof banner.link === "string") {
          // Handle legacy string values
          linkArray = banner.link === "" ? [] : JSON.parse(banner.link);
        } else if (Array.isArray(banner.link)) {
          linkArray = banner.link;
        }
      } catch (e) {
        console.warn(`Invalid JSON in link for banner ${banner.id}:`, e.message);
        linkArray = [];
      }
      return {
        ...banner.toJSON(),
        link: linkArray,
      };
    });
    res.status(200).json({ status: true, message: "OK", banner: formattedBanners });
  } catch (error) {
    console.error("Error retrieving banners:", error);
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve banner.", error: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, tab, web, link, type } = req.body;
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ status: false, message: "Banner not found" });
    }

    const bannerData = {
      phone: phone || banner.phone,
      tab: tab || banner.tab,
      web: web || banner.web,
      link: link === undefined ? banner.link : normalizeLink(link),
      type: type || banner.type,
    };

    await banner.update(bannerData);
    res.status(200).json({ status: true, message: "Banner updated." });
  } catch (error) {
    console.error("Error updating banner:", error);
    res
      .status(400)
      .json({ status: false, message: "Unable to update banner.", error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.query;
    const deleted = await Banner.destroy({
      where: { id },
    });
    if (deleted) {
      res.json({ status: true, message: "Banner deleted" });
    } else {
      res.status(404).json({ status: false, message: "Banner not found" });
    }
  } catch (error) {
    console.error("Error deleting banner:", error);
    res
      .status(400)
      .json({ status: false, message: "Unable to delete banner.", error: error.message });
  }
};

module.exports = { createBanner, getAllBanners, updateBanner, deleteBanner };

const RecentSearches = require("../model/recentSearches");

const addToRecentSearch = async (user, query) => {
  try {
    const oldEntry = await RecentSearches.findOne({ where: { user, query } });
    await oldEntry.distroy();
    await RecentSearches.create(user, query);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const getUserRecentSearches = async (req, res) => {
  try {
    const id = req.params.id;

    const recentSearches = await RecentSearches.findAll({
      where: { user: id },
    });

    res.status(200).json({ status: true, message: "OK", recentSearches });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: e.message });
  }
};

module.exports = { addToRecentSearch, getUserRecentSearches };

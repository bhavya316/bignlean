const Refer = require("../../user/model/refer");
const User = require("../../user/model/user");

const getReferes = async (req, res) => {
  try {
    const refers = await Refer.findAll({ order: [["createdAt", "DESC"]] });

    const result = [];
    for (const refer of refers) {
      const referBy = await User.findByPk(refer.referBy);
      const referTo = await User.findByPk(refer.referTo);
      refer.referBy = referBy;
      refer.referTo = referTo;
      result.push(refer);
    }

    res.status(200).json({ status: true, message: "OK", result });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to get Referrals." });
  }
};

module.exports = { getReferes };

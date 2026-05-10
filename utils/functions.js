const User = require("../user/model/user");

function generateRandomId() {
  const randomId = Math.floor(Math.random() * 900000) + 100000;
  return `#${randomId}`;
}

const generateRandomNumber = (length) => {
  const min = 1 * Math.pow(10, length - 1);
  const max = 9 * Math.pow(10, length - 1);
  return Math.floor(min + Math.random() * (max - min + 1));
};

const createUniqueReferCode = async (maxAttempts = 10) => {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const referCode = generateRandomNumber(6);
    const isUnique = !(await User.findOne({ where: { referCode } }));
    if (isUnique) {
      return `BGL${referCode}`;
    }
    attempts++;
  }
  throw new Error("Unable to generate a unique refer code.");
};

module.exports = {
  generateRandomId,
  createUniqueReferCode,
};

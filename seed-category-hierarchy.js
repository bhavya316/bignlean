const sequelize = require("./config/database");
const Category = require("./admin/model/category");
const SubCategory = require("./admin/model/subCategory");
const SubCategory2 = require("./admin/model/subCategory2");

const normalize = (value) => String(value || "").toLowerCase();

const hierarchyTemplates = [
  {
    match: ["sport", "nutrition", "protein", "supplement"],
    groups: [
      ["Whey Protein", ["Whey Concentrate", "Whey Isolate", "Plant Protein"]],
      ["Workout Essentials", ["Creatine", "BCAA", "Pre Workout"]],
      ["Mass Gainers", ["Weight Gainer", "Clean Bulk"]],
    ],
  },
  {
    match: ["vitamin", "wellness", "health"],
    groups: [
      ["Daily Wellness", ["Multivitamin", "Omega 3", "Minerals"]],
      ["Beauty Nutrition", ["Collagen", "Biotin"]],
      ["Immunity Support", ["Vitamin C", "Zinc"]],
    ],
  },
  {
    match: ["food", "snack", "drink", "breakfast"],
    groups: [
      ["Protein Foods", ["Protein Bars", "Peanut Butter"]],
      ["Breakfast Staples", ["Oats", "Muesli"]],
      ["Functional Drinks", ["Protein Water", "Electrolyte Drink"]],
    ],
  },
  {
    match: ["weight", "lean", "fat"],
    groups: [
      ["Weight Management", ["Fat Burner", "L-Carnitine"]],
      ["Lean Meals", ["Meal Replacement", "Diet Shake"]],
      ["Active Lifestyle", ["Green Tea", "Daily Fiber"]],
    ],
  },
  {
    match: ["ayurveda", "herb"],
    groups: [
      ["Herbal Wellness", ["Ashwagandha", "Shilajit"]],
      ["Plant Support", ["Amla", "Tulsi Giloy"]],
    ],
  },
  {
    match: ["personal", "care", "skin", "hair"],
    groups: [
      ["Hair Care", ["Biotin Shampoo", "Hair Growth Serum"]],
      ["Skin Care", ["Vitamin C Serum", "Collagen Cleanser"]],
    ],
  },
];

const fallbackGroups = [
  ["Popular Picks", ["Best Sellers", "New Arrivals"]],
  ["Goal Based", ["Daily Use", "Performance"]],
];

function groupsForCategory(categoryName) {
  const key = normalize(categoryName);
  const template = hierarchyTemplates.find((item) =>
    item.match.some((token) => key.includes(token))
  );
  return template ? template.groups : fallbackGroups;
}

async function resetCategoryHierarchy() {
  await sequelize.authenticate();
  const categories = await Category.findAll({ order: [["id", "ASC"]] });

  if (!categories.length) {
    throw new Error("No categories found. Create categories first, then run this seed.");
  }

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await SubCategory2.destroy({ where: {}, truncate: true, force: true });
  await SubCategory.destroy({ where: {}, truncate: true, force: true });
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

  let subcategoryCount = 0;
  let subcategory2Count = 0;

  for (const category of categories) {
    const categoryJson = category.toJSON();
    const groups = groupsForCategory(categoryJson.name);

    for (const [subcategoryName, subcategory2Names] of groups) {
      const subcategory = await SubCategory.create({
        name: subcategoryName,
        catId: categoryJson.id,
      });
      subcategoryCount += 1;

      for (const subcategory2Name of subcategory2Names) {
        await SubCategory2.create({
          name: subcategory2Name,
          subCategoryId: subcategory.id,
        });
        subcategory2Count += 1;
      }
    }
  }

  console.log(
    `Seeded ${subcategoryCount} subcategories and ${subcategory2Count} subcategory2 rows under ${categories.length} existing categories.`
  );
}

resetCategoryHierarchy()
  .then(() => {
    sequelize.close();
  })
  .catch(async (error) => {
    console.error(error);
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch (_) {}
    await sequelize.close();
    process.exit(1);
  });

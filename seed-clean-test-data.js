const sequelize = require("./config/database");
const { DataTypes } = require("sequelize");

const AboutFitness = require("./admin/model/aboutFitness");
const Banner = require("./admin/model/banners");
const Blog = require("./admin/model/blog");
const Brand = require("./admin/model/brand");
const Category = require("./admin/model/category");
const Certificate = require("./admin/model/certificate");
const Combo = require("./admin/model/combo");
const ComboCategory = require("./admin/model/comboCat");
const ComboProduct = require("./admin/model/comboProduct");
const Coupon = require("./admin/model/coupon");
const Deal = require("./admin/model/deal");
const FAQ = require("./admin/model/faq");
const GymGuide = require("./admin/model/gymGuide");
const Offer = require("./admin/model/offer");
const Plan = require("./admin/model/plan");
const Product = require("./admin/model/product");
const SubCategory = require("./admin/model/subCategory");
const SubCategory2 = require("./admin/model/subCategory2");
const SubscriptionBanner = require("./admin/model/subscriptionBanner");

const Address = require("./user/model/address");
const Cart = require("./user/model/cart");
const ContactLead = require("./user/model/contactLead");
const Favorite = require("./user/model/favorite");
const Order = require("./user/model/order");
const Rating = require("./user/model/rating");
const RecentSearches = require("./user/model/recentSearches");
const RecentView = require("./user/model/recentView");
const Subscribe = require("./user/model/subscribe");
const Subscription = require("./user/model/subscription");
const Transaction = require("./user/model/transaction");
const User = require("./user/model/user");

const resetModels = [
  Transaction,
  Cart,
  Favorite,
  Rating,
  RecentSearches,
  RecentView,
  Subscription,
  Address,
  Order,
  User,
  ContactLead,
  Subscribe,
  ComboProduct,
  Combo,
  Deal,
  Offer,
  Coupon,
  Banner,
  SubscriptionBanner,
  AboutFitness,
  GymGuide,
  Certificate,
  Blog,
  FAQ,
  Product,
  SubCategory2,
  SubCategory,
  Category,
  Brand,
  Plan,
  ComboCategory,
];

const colorPairs = {
  dark: ["111827", "ffffff"],
  green: ["dcfce7", "14532d"],
  blue: ["dbeafe", "1d4ed8"],
  amber: ["fef3c7", "92400e"],
  rose: ["ffe4e6", "9f1239"],
  slate: ["f8fafc", "111827"],
  violet: ["ede9fe", "5b21b6"],
  cyan: ["cffafe", "155e75"],
  orange: ["ffedd5", "9a3412"],
};

const asset = (width, height, text, pair = colorPairs.slate) =>
  `https://placehold.co/${width}x${height}/${pair[0]}/${pair[1]}.png?text=${encodeURIComponent(text)}`;

const logo = (text, pair = colorPairs.dark) => asset(500, 500, text, pair);
const hero = (text, pair = colorPairs.dark) => asset(1600, 520, text, pair);
const productImage = (text, pair = colorPairs.slate) => asset(900, 900, text, pair);

const longExpiry = "2027-12-31T00:00";

function makeVariant({ id = 1, units, weight, mrp, sellingPrice, premiumPrice, stock, flavors }) {
  return {
    id,
    units,
    weight,
    date: longExpiry,
    stock: String(stock),
    mrp: String(mrp),
    sellingPrice: String(sellingPrice),
    premiumPrice: String(premiumPrice || sellingPrice),
    flavor: flavors.map((name, index) => ({
      name,
      stock: Math.max(0, Number(stock) - index * 3),
      mrp,
      sellingPrice,
      premiumPrice: premiumPrice || sellingPrice,
    })),
  };
}

function contentBlocks(product) {
  return {
    overView: [
      { value: product.primaryValue, nutrients: product.primaryLabel },
      { value: product.secondaryValue, nutrients: product.secondaryLabel },
      { value: product.goal, nutrients: "Goal" },
      { value: product.isVeg ? "Veg" : "Non-veg", nutrients: "Type" },
    ],
    details: [
      {
        heading: "About this product",
        body: `${product.name} is clean test catalogue data for active shopping, filtering, cart and admin workflows. It uses realistic supplement attributes without representing live inventory.`,
      },
      {
        heading: "Suggested use",
        body: product.usage,
      },
      {
        heading: "Quality note",
        body: "Batch, expiry, country of origin, pricing and stock fields are populated so product detail, offer and order screens can be tested end to end.",
      },
    ],
    tables: [
      {
        title: "Product Snapshot",
        table: [
          { for: "Serving format", value: product.format },
          { for: "Diet type", value: product.isVeg ? "Vegetarian" : "Non-vegetarian" },
          { for: "Country of origin", value: product.countryOfOrigin },
        ],
      },
      {
        title: "Key Nutrition",
        table: [
          { for: product.primaryLabel, value: product.primaryValue },
          { for: product.secondaryLabel, value: product.secondaryValue },
        ],
      },
    ],
    information: [
      { nutrients: "Storage", value: "Store in a cool and dry place" },
      { nutrients: "Authenticity", value: "Use this row for admin certificate and product-detail testing" },
      { nutrients: "Expiry", value: "December 2027" },
    ],
    certificates: [asset(600, 360, "Authenticity Check", colorPairs.green)],
    supplements: [asset(600, 360, "Lab Tested", colorPairs.blue)],
    brand: {
      heading: product.brand,
      body: product.brandDescription,
    },
  };
}

async function tableNameFor(model, existingTables) {
  const modelTable = model.getTableName();
  const name = typeof modelTable === "object" ? modelTable.tableName : modelTable;
  return existingTables.find((table) => table.toLowerCase() === String(name).toLowerCase());
}

async function ensureColumn(model, columnName, definition) {
  const table = model.getTableName();
  const tableName = typeof table === "object" ? table.tableName : table;
  const queryInterface = sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable(tableName);

  if (!columns[columnName]) {
    await queryInterface.addColumn(tableName, columnName, definition);
  }
}

async function changeColumn(model, columnName, definition) {
  const table = model.getTableName();
  const tableName = typeof table === "object" ? table.tableName : table;
  await sequelize.getQueryInterface().changeColumn(tableName, columnName, definition);
}

async function ensureSchema() {
  await sequelize.sync();
  await changeColumn(Category, "brandId", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await ensureColumn(Brand, "subcatId", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await ensureColumn(Brand, "subcatId2", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await ensureColumn(Banner, "type", {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Hero Slider",
  });
  await ensureColumn(Coupon, "expiryDate", {
    type: DataTypes.DATE,
    allowNull: true,
  });
  await ensureColumn(ComboCategory, "ruleExactlyTwo", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
  await ensureColumn(Product, "subCatId2", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await ensureColumn(Product, "brandId", {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  });
  await ensureColumn(Product, "expiry_date", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await ensureColumn(Product, "countryOfOrigin", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await ensureColumn(Product, "isVeg", {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  });
  await ensureColumn(User, "isBlocked", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

async function resetData() {
  const existingTables = await sequelize.getQueryInterface().showAllTables();
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

  for (const model of resetModels) {
    const tableName = await tableNameFor(model, existingTables);
    if (tableName) {
      await sequelize.query(`TRUNCATE TABLE \`${tableName}\``);
    }
  }

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
}

async function seedCategories() {
  const categories = {};
  const subcategories = {};
  const subcategories2 = {};

  const categoryRows = [
    {
      name: "Sports Nutrition",
      imageOn: logo("Sports Nutrition", colorPairs.green),
      imageOff: logo("Sports", colorPairs.slate),
      groups: [
        ["Whey Proteins", ["Whey Concentrate", "Whey Isolate", "Beginner Whey", "Plant Protein"]],
        ["Gainers", ["Mass Gainer", "Weight Gainer"]],
        ["Pre/Post Workout", ["Creatine", "BCAA", "EAA", "Pre Workout", "Electrolytes"]],
      ],
    },
    {
      name: "Vitamins & Supplements",
      imageOn: logo("Vitamins", colorPairs.blue),
      imageOff: logo("Wellness", colorPairs.slate),
      groups: [
        ["Multivitamins", ["Men", "Women", "Daily Wellness"]],
        ["Omega & Minerals", ["Fish Oil", "Calcium Magnesium Zinc"]],
        ["Beauty Nutrition", ["Collagen", "Biotin"]],
      ],
    },
    {
      name: "Health Food & Drinks",
      imageOn: logo("Healthy Foods", colorPairs.amber),
      imageOff: logo("Foods", colorPairs.slate),
      groups: [
        ["Protein Foods", ["Peanut Butter", "Protein Bars"]],
        ["Breakfast Staples", ["Oats", "Muesli"]],
        ["Functional Drinks", ["Protein Water", "Electrolyte Drink"]],
      ],
    },
    {
      name: "Weight Management",
      imageOn: logo("Weight Goals", colorPairs.rose),
      imageOff: logo("Weight", colorPairs.slate),
      groups: [
        ["Lean Support", ["Meal Replacement", "L-Carnitine", "Fat Burner"]],
        ["Active Lifestyle", ["Green Tea", "Daily Fiber"]],
      ],
    },
    {
      name: "Ayurveda & Herbs",
      imageOn: logo("Ayurveda", colorPairs.green),
      imageOff: logo("Herbs", colorPairs.slate),
      groups: [
        ["Herbal Wellness", ["Ashwagandha", "Shilajit", "Amla"]],
        ["Plant Support", ["Milk Thistle", "Tulsi Giloy"]],
      ],
    },
    {
      name: "Personal Care",
      imageOn: logo("Personal Care", colorPairs.violet),
      imageOff: logo("Care", colorPairs.slate),
      groups: [
        ["Hair Care", ["Hair Growth Serum", "Biotin Shampoo"]],
        ["Skin Care", ["Collagen Cleanser", "Vitamin C Serum"]],
      ],
    },
  ];

  for (const row of categoryRows) {
    categories[row.name] = await Category.create({
      name: row.name,
      imageOn: row.imageOn,
      imageOff: row.imageOff,
      brandId: null,
    });

    for (const [groupName, childNames] of row.groups) {
      const subcategory = await SubCategory.create({
        name: groupName,
        catId: categories[row.name].id,
      });
      subcategories[groupName] = subcategory;

      for (const childName of childNames) {
        subcategories2[childName] = await SubCategory2.create({
          name: childName,
          subCategoryId: subcategory.id,
        });
      }
    }
  }

  return { categories, subcategories, subcategories2 };
}

async function seedBrands() {
  const rows = [
    ["BignLean Labs", "BignLean Labs test products cover protein, workout and healthy food journeys for the BignLean storefront.", "BIGNLEAN", colorPairs.dark],
    ["ActiveFuel", "ActiveFuel is a test sports nutrition brand for whey, creatine, amino and performance products.", "ACTIVE", colorPairs.rose],
    ["NutriForge", "NutriForge represents value-focused clean nutrition and daily pantry products in test data.", "FORGE", colorPairs.amber],
    ["VitalCore", "VitalCore covers vitamins, minerals and beauty nutrition for wellness flows.", "VITAL", colorPairs.blue],
    ["PrimeWell", "PrimeWell test SKUs focus on premium wellness, omega, collagen and daily health support.", "PRIME", colorPairs.green],
    ["HerbRoot", "HerbRoot provides ayurvedic and herbal wellness rows for alternate category testing.", "HERB", colorPairs.green],
    ["PureForm", "PureForm is used for personal care, skin and hair care product testing.", "PURE", colorPairs.violet],
    ["LeanFit", "LeanFit covers weight management, meal replacement and active lifestyle products.", "LEANFIT", colorPairs.cyan],
  ];

  const brands = {};
  for (const [name, description, mark, pair] of rows) {
    brands[name] = await Brand.create({
      name,
      description,
      image: logo(mark, pair),
      banner: [hero(`${name} Store`, pair)],
      subcatId: null,
      subcatId2: null,
    });
  }
  return brands;
}

async function seedProducts({ categories, subcategories, subcategories2, brands }) {
  const productRows = [
    {
      name: "BignLean Elite Whey Protein",
      cat: "Sports Nutrition",
      sub: "Whey Proteins",
      sub2: "Whey Concentrate",
      brand: "BignLean Labs",
      pair: colorPairs.green,
      imageText: "Elite Whey 2kg",
      variants: [makeVariant({ units: "2 kg", weight: 2000, mrp: 3499, sellingPrice: 2599, premiumPrice: 2499, stock: 64, flavors: ["Chocolate Fudge", "Cafe Mocha"] })],
      primaryValue: "24 g",
      primaryLabel: "Protein",
      secondaryValue: "5.4 g",
      secondaryLabel: "BCAA",
      goal: "Muscle Recovery",
      format: "Powder",
      usage: "Mix one scoop with 200 ml water or milk after training or between meals.",
      isBestSeller: true,
      isOnFlashSale: true,
      hit: 260,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "BignLean Whey Isolate 90",
      cat: "Sports Nutrition",
      sub: "Whey Proteins",
      sub2: "Whey Isolate",
      brand: "BignLean Labs",
      pair: colorPairs.blue,
      imageText: "Isolate 90",
      variants: [makeVariant({ units: "1.8 kg", weight: 1800, mrp: 5299, sellingPrice: 4299, premiumPrice: 4099, stock: 38, flavors: ["Vanilla Cream", "Chocolate"] })],
      primaryValue: "27 g",
      primaryLabel: "Protein",
      secondaryValue: "Low",
      secondaryLabel: "Carbs",
      goal: "Lean Muscle",
      format: "Powder",
      usage: "Use one serving after workouts or as a lean protein top-up during the day.",
      isBestSeller: true,
      isOnFlashSale: false,
      hit: 198,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "ActiveFuel Beginner Whey",
      cat: "Sports Nutrition",
      sub: "Whey Proteins",
      sub2: "Beginner Whey",
      brand: "ActiveFuel",
      pair: colorPairs.orange,
      imageText: "Beginner Whey",
      variants: [makeVariant({ units: "1 kg", weight: 1000, mrp: 1999, sellingPrice: 1399, premiumPrice: 1329, stock: 72, flavors: ["Cookies Cream", "Mango Smoothie"] })],
      primaryValue: "18 g",
      primaryLabel: "Protein",
      secondaryValue: "Easy",
      secondaryLabel: "Mixability",
      goal: "Beginner Fitness",
      format: "Powder",
      usage: "Mix one scoop with water after workouts or with breakfast.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 130,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "PrimeWell Plant Protein Blend",
      cat: "Sports Nutrition",
      sub: "Whey Proteins",
      sub2: "Plant Protein",
      brand: "PrimeWell",
      pair: colorPairs.green,
      imageText: "Plant Protein",
      variants: [makeVariant({ units: "1 kg", weight: 1000, mrp: 2499, sellingPrice: 1799, premiumPrice: 1699, stock: 44, flavors: ["Belgian Chocolate", "Natural Vanilla"] })],
      primaryValue: "22 g",
      primaryLabel: "Plant Protein",
      secondaryValue: "Pea+Rice",
      secondaryLabel: "Blend",
      goal: "Vegan Protein",
      format: "Powder",
      usage: "Shake one serving with water, almond milk or a smoothie base.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 86,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "NutriForge Creatine Monohydrate",
      cat: "Sports Nutrition",
      sub: "Pre/Post Workout",
      sub2: "Creatine",
      brand: "NutriForge",
      pair: colorPairs.cyan,
      imageText: "Creatine 250g",
      variants: [makeVariant({ units: "250 g", weight: 250, mrp: 1299, sellingPrice: 799, premiumPrice: 749, stock: 105, flavors: ["Unflavoured"] })],
      primaryValue: "3 g",
      primaryLabel: "Creatine",
      secondaryValue: "Pure",
      secondaryLabel: "Monohydrate",
      goal: "Strength",
      format: "Powder",
      usage: "Take one serving daily with water or your post-workout shake.",
      isBestSeller: true,
      isOnFlashSale: true,
      hit: 310,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "ActiveFuel Pre Workout Rush",
      cat: "Sports Nutrition",
      sub: "Pre/Post Workout",
      sub2: "Pre Workout",
      brand: "ActiveFuel",
      pair: colorPairs.rose,
      imageText: "Pre Workout",
      variants: [makeVariant({ units: "300 g", weight: 300, mrp: 1899, sellingPrice: 1199, premiumPrice: 1129, stock: 47, flavors: ["Fruit Punch", "Blue Raspberry"] })],
      primaryValue: "150 mg",
      primaryLabel: "Caffeine",
      secondaryValue: "2 g",
      secondaryLabel: "Beta Alanine",
      goal: "Energy",
      format: "Powder",
      usage: "Use one serving 20 minutes before training. Avoid late evening use.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 121,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "BignLean BCAA Hydration",
      cat: "Sports Nutrition",
      sub: "Pre/Post Workout",
      sub2: "BCAA",
      brand: "BignLean Labs",
      pair: colorPairs.cyan,
      imageText: "BCAA Hydration",
      variants: [makeVariant({ units: "400 g", weight: 400, mrp: 1699, sellingPrice: 999, premiumPrice: 929, stock: 53, flavors: ["Watermelon", "Lemon Lime"] })],
      primaryValue: "5 g",
      primaryLabel: "BCAA",
      secondaryValue: "Added",
      secondaryLabel: "Electrolytes",
      goal: "Hydration",
      format: "Powder",
      usage: "Sip during training or mix one serving in chilled water.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 112,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "NutriForge EAA Endurance",
      cat: "Sports Nutrition",
      sub: "Pre/Post Workout",
      sub2: "EAA",
      brand: "NutriForge",
      pair: colorPairs.violet,
      imageText: "EAA Endurance",
      variants: [makeVariant({ units: "350 g", weight: 350, mrp: 1799, sellingPrice: 1199, premiumPrice: 1099, stock: 41, flavors: ["Orange", "Cola Lime"] })],
      primaryValue: "8 g",
      primaryLabel: "EAA",
      secondaryValue: "Zero",
      secondaryLabel: "Sugar",
      goal: "Endurance",
      format: "Powder",
      usage: "Mix one serving with cold water before or during exercise.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 74,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "BignLean Clean Bulk Mass Gainer",
      cat: "Sports Nutrition",
      sub: "Gainers",
      sub2: "Mass Gainer",
      brand: "BignLean Labs",
      pair: colorPairs.amber,
      imageText: "Mass Gainer 3kg",
      variants: [makeVariant({ units: "3 kg", weight: 3000, mrp: 2999, sellingPrice: 2199, premiumPrice: 2099, stock: 36, flavors: ["Chocolate", "Banana Cream"] })],
      primaryValue: "52 g",
      primaryLabel: "Carbs",
      secondaryValue: "15 g",
      secondaryLabel: "Protein",
      goal: "Bulking",
      format: "Powder",
      usage: "Blend two scoops with milk between meals or post workout.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 97,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "ActiveFuel Weight Gainer",
      cat: "Sports Nutrition",
      sub: "Gainers",
      sub2: "Weight Gainer",
      brand: "ActiveFuel",
      pair: colorPairs.orange,
      imageText: "Weight Gainer",
      variants: [makeVariant({ units: "3 kg", weight: 3000, mrp: 2499, sellingPrice: 1799, premiumPrice: 1699, stock: 29, flavors: ["Kesar Badam", "Chocolate"] })],
      primaryValue: "420",
      primaryLabel: "Calories",
      secondaryValue: "12 g",
      secondaryLabel: "Protein",
      goal: "Weight Gain",
      format: "Powder",
      usage: "Use between meals as a calorie support shake.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 64,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "VitalCore Daily Multivitamin Men",
      cat: "Vitamins & Supplements",
      sub: "Multivitamins",
      sub2: "Men",
      brand: "VitalCore",
      pair: colorPairs.blue,
      imageText: "Men Multi",
      variants: [makeVariant({ units: "60 tablets", weight: 120, mrp: 799, sellingPrice: 529, premiumPrice: 499, stock: 88, flavors: ["Tablet"] })],
      primaryValue: "24",
      primaryLabel: "Nutrients",
      secondaryValue: "With",
      secondaryLabel: "Ginseng",
      goal: "Daily Wellness",
      format: "Tablet",
      usage: "Take one tablet after a main meal or as guided by a professional.",
      isBestSeller: true,
      isOnFlashSale: false,
      hit: 166,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "VitalCore Daily Multivitamin Women",
      cat: "Vitamins & Supplements",
      sub: "Multivitamins",
      sub2: "Women",
      brand: "VitalCore",
      pair: colorPairs.rose,
      imageText: "Women Multi",
      variants: [makeVariant({ units: "60 tablets", weight: 120, mrp: 849, sellingPrice: 579, premiumPrice: 549, stock: 74, flavors: ["Tablet"] })],
      primaryValue: "22",
      primaryLabel: "Nutrients",
      secondaryValue: "With",
      secondaryLabel: "Biotin",
      goal: "Daily Wellness",
      format: "Tablet",
      usage: "Take one tablet after a meal as part of a balanced diet.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 118,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "PrimeWell Omega 3 Fish Oil",
      cat: "Vitamins & Supplements",
      sub: "Omega & Minerals",
      sub2: "Fish Oil",
      brand: "PrimeWell",
      pair: colorPairs.cyan,
      imageText: "Omega 3",
      variants: [makeVariant({ units: "90 softgels", weight: 180, mrp: 1499, sellingPrice: 949, premiumPrice: 899, stock: 65, flavors: ["Softgel"] })],
      primaryValue: "1000 mg",
      primaryLabel: "Fish Oil",
      secondaryValue: "EPA+DHA",
      secondaryLabel: "Omega 3",
      goal: "Heart Wellness",
      format: "Softgel",
      usage: "Take one softgel after a meal or as advised by a professional.",
      isBestSeller: true,
      isOnFlashSale: true,
      hit: 214,
      countryOfOrigin: "India",
      isVeg: false,
    },
    {
      name: "PrimeWell Calcium Magnesium Zinc",
      cat: "Vitamins & Supplements",
      sub: "Omega & Minerals",
      sub2: "Calcium Magnesium Zinc",
      brand: "PrimeWell",
      pair: colorPairs.blue,
      imageText: "Cal Mag Zinc",
      variants: [makeVariant({ units: "60 tablets", weight: 110, mrp: 699, sellingPrice: 449, premiumPrice: 429, stock: 77, flavors: ["Tablet"] })],
      primaryValue: "3-in-1",
      primaryLabel: "Minerals",
      secondaryValue: "With",
      secondaryLabel: "Vitamin D3",
      goal: "Bone Support",
      format: "Tablet",
      usage: "Take one tablet after a meal.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 91,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "VitalCore Collagen Peptides",
      cat: "Vitamins & Supplements",
      sub: "Beauty Nutrition",
      sub2: "Collagen",
      brand: "VitalCore",
      pair: colorPairs.violet,
      imageText: "Collagen",
      variants: [makeVariant({ units: "200 g", weight: 200, mrp: 1299, sellingPrice: 899, premiumPrice: 849, stock: 46, flavors: ["Orange", "Watermelon"] })],
      primaryValue: "10 g",
      primaryLabel: "Collagen",
      secondaryValue: "With",
      secondaryLabel: "Vitamin C",
      goal: "Skin Support",
      format: "Powder",
      usage: "Mix one serving with water once daily.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 80,
      countryOfOrigin: "India",
      isVeg: false,
    },
    {
      name: "PureForm Biotin Hair & Skin",
      cat: "Vitamins & Supplements",
      sub: "Beauty Nutrition",
      sub2: "Biotin",
      brand: "PureForm",
      pair: colorPairs.violet,
      imageText: "Biotin",
      variants: [makeVariant({ units: "60 tablets", weight: 90, mrp: 699, sellingPrice: 399, premiumPrice: 379, stock: 59, flavors: ["Tablet"] })],
      primaryValue: "10000 mcg",
      primaryLabel: "Biotin",
      secondaryValue: "Added",
      secondaryLabel: "Zinc",
      goal: "Hair Support",
      format: "Tablet",
      usage: "Take one tablet after food.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 70,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "BignLean High Protein Peanut Butter",
      cat: "Health Food & Drinks",
      sub: "Protein Foods",
      sub2: "Peanut Butter",
      brand: "BignLean Labs",
      pair: colorPairs.amber,
      imageText: "Protein PB",
      variants: [makeVariant({ units: "1 kg", weight: 1000, mrp: 699, sellingPrice: 449, premiumPrice: 429, stock: 96, flavors: ["Dark Chocolate", "Crunchy"] })],
      primaryValue: "30 g",
      primaryLabel: "Protein/100g",
      secondaryValue: "No",
      secondaryLabel: "Added Sugar",
      goal: "Healthy Snack",
      format: "Spread",
      usage: "Use as a spread, smoothie add-on or snack ingredient.",
      isBestSeller: true,
      isOnFlashSale: true,
      hit: 244,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "NutriForge Protein Bar Box",
      cat: "Health Food & Drinks",
      sub: "Protein Foods",
      sub2: "Protein Bars",
      brand: "NutriForge",
      pair: colorPairs.rose,
      imageText: "Protein Bars",
      variants: [makeVariant({ units: "12 bars", weight: 720, mrp: 1199, sellingPrice: 799, premiumPrice: 759, stock: 82, flavors: ["Choco Almond", "Cookies Cream"] })],
      primaryValue: "20 g",
      primaryLabel: "Protein/bar",
      secondaryValue: "High",
      secondaryLabel: "Fiber",
      goal: "On-the-go Snack",
      format: "Bar",
      usage: "Use as a snack between meals or after training.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 116,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "NutriForge Rolled Oats",
      cat: "Health Food & Drinks",
      sub: "Breakfast Staples",
      sub2: "Oats",
      brand: "NutriForge",
      pair: colorPairs.amber,
      imageText: "Rolled Oats",
      variants: [makeVariant({ units: "1 kg", weight: 1000, mrp: 399, sellingPrice: 249, premiumPrice: 239, stock: 120, flavors: ["Classic"] })],
      primaryValue: "Wholegrain",
      primaryLabel: "Oats",
      secondaryValue: "High",
      secondaryLabel: "Fiber",
      goal: "Breakfast",
      format: "Oats",
      usage: "Cook with milk or water and add fruits, nuts or protein.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 88,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "PrimeWell Protein Muesli",
      cat: "Health Food & Drinks",
      sub: "Breakfast Staples",
      sub2: "Muesli",
      brand: "PrimeWell",
      pair: colorPairs.green,
      imageText: "Protein Muesli",
      variants: [makeVariant({ units: "700 g", weight: 700, mrp: 599, sellingPrice: 389, premiumPrice: 369, stock: 69, flavors: ["Fruit Nut", "Chocolate"] })],
      primaryValue: "12 g",
      primaryLabel: "Protein",
      secondaryValue: "Multi",
      secondaryLabel: "Grain",
      goal: "Breakfast",
      format: "Muesli",
      usage: "Serve with milk, curd or fruit bowls.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 76,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "ActiveFuel Sparkling Protein Water",
      cat: "Health Food & Drinks",
      sub: "Functional Drinks",
      sub2: "Protein Water",
      brand: "ActiveFuel",
      pair: colorPairs.cyan,
      imageText: "Protein Water",
      variants: [makeVariant({ units: "12 cans", weight: 3000, mrp: 1199, sellingPrice: 899, premiumPrice: 849, stock: 42, flavors: ["Lemon", "Peach"] })],
      primaryValue: "10 g",
      primaryLabel: "Protein/can",
      secondaryValue: "Zero",
      secondaryLabel: "Added Sugar",
      goal: "Hydration",
      format: "Drink",
      usage: "Serve chilled as a light protein beverage.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 58,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "LeanFit Meal Replacement Shake",
      cat: "Weight Management",
      sub: "Lean Support",
      sub2: "Meal Replacement",
      brand: "LeanFit",
      pair: colorPairs.cyan,
      imageText: "Meal Shake",
      variants: [makeVariant({ units: "1 kg", weight: 1000, mrp: 2299, sellingPrice: 1599, premiumPrice: 1499, stock: 43, flavors: ["Vanilla", "Cafe Mocha"] })],
      primaryValue: "22 g",
      primaryLabel: "Protein",
      secondaryValue: "Balanced",
      secondaryLabel: "Macros",
      goal: "Meal Support",
      format: "Powder",
      usage: "Replace one planned meal only when it fits your nutrition routine.",
      isBestSeller: true,
      isOnFlashSale: false,
      hit: 142,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "LeanFit L-Carnitine Liquid",
      cat: "Weight Management",
      sub: "Lean Support",
      sub2: "L-Carnitine",
      brand: "LeanFit",
      pair: colorPairs.rose,
      imageText: "L-Carnitine",
      variants: [makeVariant({ units: "450 ml", weight: 450, mrp: 999, sellingPrice: 699, premiumPrice: 659, stock: 52, flavors: ["Key Lime", "Berry"] })],
      primaryValue: "1100 mg",
      primaryLabel: "L-Carnitine",
      secondaryValue: "Liquid",
      secondaryLabel: "Format",
      goal: "Active Lifestyle",
      format: "Liquid",
      usage: "Use one serving before activity as part of a controlled diet plan.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 122,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "LeanFit Thermo Green Tea",
      cat: "Weight Management",
      sub: "Active Lifestyle",
      sub2: "Green Tea",
      brand: "LeanFit",
      pair: colorPairs.green,
      imageText: "Green Tea",
      variants: [makeVariant({ units: "100 tea bags", weight: 250, mrp: 599, sellingPrice: 349, premiumPrice: 329, stock: 101, flavors: ["Lemon Honey", "Mint"] })],
      primaryValue: "0",
      primaryLabel: "Sugar",
      secondaryValue: "Green",
      secondaryLabel: "Tea",
      goal: "Lifestyle",
      format: "Tea Bags",
      usage: "Brew one tea bag in hot water for 2-3 minutes.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 62,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "HerbRoot Ashwagandha Tablets",
      cat: "Ayurveda & Herbs",
      sub: "Herbal Wellness",
      sub2: "Ashwagandha",
      brand: "HerbRoot",
      pair: colorPairs.green,
      imageText: "Ashwagandha",
      variants: [makeVariant({ units: "60 tablets", weight: 90, mrp: 599, sellingPrice: 349, premiumPrice: 329, stock: 83, flavors: ["Tablet"] })],
      primaryValue: "500 mg",
      primaryLabel: "Extract",
      secondaryValue: "Herbal",
      secondaryLabel: "Support",
      goal: "Stress Support",
      format: "Tablet",
      usage: "Take after meals as guided by a qualified professional.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 68,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "HerbRoot Shilajit Resin",
      cat: "Ayurveda & Herbs",
      sub: "Herbal Wellness",
      sub2: "Shilajit",
      brand: "HerbRoot",
      pair: colorPairs.dark,
      imageText: "Shilajit",
      variants: [makeVariant({ units: "20 g", weight: 20, mrp: 1199, sellingPrice: 799, premiumPrice: 749, stock: 31, flavors: ["Natural"] })],
      primaryValue: "Resin",
      primaryLabel: "Format",
      secondaryValue: "Fulvic",
      secondaryLabel: "Minerals",
      goal: "Vitality",
      format: "Resin",
      usage: "Use a small pea-sized serving with warm water or milk.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 83,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "HerbRoot Amla Juice",
      cat: "Ayurveda & Herbs",
      sub: "Herbal Wellness",
      sub2: "Amla",
      brand: "HerbRoot",
      pair: colorPairs.amber,
      imageText: "Amla Juice",
      variants: [makeVariant({ units: "1 L", weight: 1000, mrp: 399, sellingPrice: 249, premiumPrice: 229, stock: 76, flavors: ["Natural"] })],
      primaryValue: "Amla",
      primaryLabel: "Juice",
      secondaryValue: "Vitamin C",
      secondaryLabel: "Source",
      goal: "Daily Wellness",
      format: "Liquid",
      usage: "Dilute one serving in water before consumption.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 54,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "PureForm Hair Growth Serum",
      cat: "Personal Care",
      sub: "Hair Care",
      sub2: "Hair Growth Serum",
      brand: "PureForm",
      pair: colorPairs.violet,
      imageText: "Hair Serum",
      variants: [makeVariant({ units: "60 ml", weight: 60, mrp: 899, sellingPrice: 599, premiumPrice: 569, stock: 55, flavors: ["Serum"] })],
      primaryValue: "Topical",
      primaryLabel: "Use",
      secondaryValue: "With",
      secondaryLabel: "Peptides",
      goal: "Hair Care",
      format: "Serum",
      usage: "Apply as directed on the pack. For external use only.",
      isBestSeller: false,
      isOnFlashSale: true,
      hit: 73,
      countryOfOrigin: "India",
      isVeg: true,
    },
    {
      name: "PureForm Collagen Face Cleanser",
      cat: "Personal Care",
      sub: "Skin Care",
      sub2: "Collagen Cleanser",
      brand: "PureForm",
      pair: colorPairs.blue,
      imageText: "Face Cleanser",
      variants: [makeVariant({ units: "150 ml", weight: 150, mrp: 599, sellingPrice: 399, premiumPrice: 379, stock: 61, flavors: ["Cleanser"] })],
      primaryValue: "Gentle",
      primaryLabel: "Cleanse",
      secondaryValue: "With",
      secondaryLabel: "Collagen",
      goal: "Skin Care",
      format: "Cleanser",
      usage: "Use on damp skin and rinse. Avoid contact with eyes.",
      isBestSeller: false,
      isOnFlashSale: false,
      hit: 49,
      countryOfOrigin: "India",
      isVeg: true,
    },
  ];

  const products = {};
  for (const row of productRows) {
    const brand = brands[row.brand];
    const blocks = contentBlocks({ ...row, brandDescription: brand.description });
    products[row.name] = await Product.create({
      catId: categories[row.cat].id,
      subCatId: subcategories[row.sub].id,
      subCatId2: subcategories2[row.sub2].id,
      brandId: brand.id,
      name: row.name,
      isBestSeller: row.isBestSeller,
      isOnFlashSale: row.isOnFlashSale,
      images: [
        productImage(row.imageText, row.pair),
        productImage(`${row.imageText} Back`, colorPairs.slate),
        productImage(`${row.imageText} Nutrition`, colorPairs.blue),
      ],
      hit: row.hit,
      varients: row.variants,
      expiry_date: "2027-12-31",
      countryOfOrigin: row.countryOfOrigin,
      isVeg: row.isVeg,
      ...blocks,
    });
  }

  return products;
}

async function seedMerchandising(products) {
  const productIds = Object.values(products).map((product) => product.id);
  const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const later = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);

  const bannerRows = [
    ["Hero Slider", "BignLean Mega Nutrition Sale", colorPairs.dark, ["/product"]],
    ["Hero Slider", "Proteins, Vitamins, Healthy Foods", colorPairs.green, ["/shop-by-category"]],
    ["Hero Slider", "Build Your Workout Stack", colorPairs.rose, ["/combo/1"]],
    ["Banner 1 Section", "Best Seller Supplements", colorPairs.amber, ["/best-seller"]],
    ["Banner 2 Section", "Daily Wellness Essentials", colorPairs.blue, ["/shop-by-brands"]],
    ["Banner 3 Section", "Clean Food and Protein Snacks", colorPairs.cyan, ["/product"]],
  ];

  for (const [type, text, pair, link] of bannerRows) {
    const image = hero(text, pair);
    await Banner.create({
      phone: image,
      tab: image,
      web: image,
      link,
      type,
    });
  }

  const coupons = {};
  for (const row of [
    ["BIGNLEAN25", 25, 500, "Percentage-wise"],
    ["FIRST500", 500, 250, "Price-wise"],
    ["STACK10", 10, 300, "Percentage-wise"],
    ["WELLNESS15", 15, 200, "Percentage-wise"],
  ]) {
    const [coupon, discount, qty, category] = row;
    coupons[coupon] = await Coupon.create({
      coupon,
      discount,
      qty,
      category,
      expiryDate: later,
    });
  }

  await Offer.bulkCreate([
    {
      name: "Build Your Protein Stack",
      image: hero("Build Your Protein Stack", colorPairs.green),
      products: [
        products["BignLean Elite Whey Protein"].id,
        products["NutriForge Creatine Monohydrate"].id,
        products["BignLean BCAA Hydration"].id,
      ],
    },
    {
      name: "Daily Wellness Sale",
      image: hero("Daily Wellness Sale", colorPairs.blue),
      products: [
        products["VitalCore Daily Multivitamin Men"].id,
        products["PrimeWell Omega 3 Fish Oil"].id,
        products["PrimeWell Calcium Magnesium Zinc"].id,
      ],
    },
    {
      name: "Healthy Snack Picks",
      image: hero("Healthy Snack Picks", colorPairs.amber),
      products: [
        products["BignLean High Protein Peanut Butter"].id,
        products["NutriForge Protein Bar Box"].id,
        products["PrimeWell Protein Muesli"].id,
      ],
    },
  ]);

  const comboCategory = await ComboCategory.create({
    name: "Choose Any 2 Workout Essentials",
    image: hero("Choose Any 2 Workout Essentials", colorPairs.dark),
    ruleExactlyTwo: true,
  });

  const comboProductNames = [
    "BignLean Elite Whey Protein",
    "NutriForge Creatine Monohydrate",
    "ActiveFuel Pre Workout Rush",
    "BignLean BCAA Hydration",
    "VitalCore Daily Multivitamin Men",
  ];

  for (const name of comboProductNames) {
    const source = products[name].toJSON();
    await ComboProduct.create({
      catId: source.catId,
      comboCatId: comboCategory.id,
      subCatId: source.subCatId,
      subCatId2: source.subCatId2,
      brandId: source.brandId,
      name: `${source.name} Combo Pick`,
      isBestSeller: source.isBestSeller,
      isOnFlashSale: source.isOnFlashSale,
      images: source.images,
      overView: source.overView,
      details: source.details,
      tables: source.tables,
      information: source.information,
      certificates: source.certificates,
      supplements: source.supplements,
      brand: source.brand,
      hit: source.hit,
      varients: source.varients,
      expiry_date: source.expiry_date,
    });
  }

  await Combo.create({
    catId: comboCategory.id,
    products: comboProductNames.map((name) => products[name].id),
  });

  await Deal.bulkCreate([
    {
      name: "Best Seller Supplements",
      type: "Single",
      products: [
        products["BignLean Elite Whey Protein"].id,
        products["NutriForge Creatine Monohydrate"].id,
        products["PrimeWell Omega 3 Fish Oil"].id,
        products["BignLean High Protein Peanut Butter"].id,
        products["LeanFit Meal Replacement Shake"].id,
      ],
      isForLimitedTime: false,
      expireDateTime: null,
    },
    {
      name: "Price Slash Today",
      type: "Single",
      products: productIds.filter((_, index) => index % 4 === 0).slice(0, 8),
      isForLimitedTime: true,
      expireDateTime: soon,
    },
    {
      name: "Protein Starter Picks",
      type: "Single",
      products: [
        products["ActiveFuel Beginner Whey"].id,
        products["BignLean Elite Whey Protein"].id,
        products["PrimeWell Plant Protein Blend"].id,
        products["NutriForge Protein Bar Box"].id,
      ],
      isForLimitedTime: false,
      expireDateTime: null,
    },
    {
      name: "Wellness Essentials",
      type: "Single",
      products: [
        products["VitalCore Daily Multivitamin Women"].id,
        products["PrimeWell Calcium Magnesium Zinc"].id,
        products["VitalCore Collagen Peptides"].id,
        products["HerbRoot Ashwagandha Tablets"].id,
      ],
      isForLimitedTime: false,
      expireDateTime: null,
    },
    {
      name: "Combo Builder",
      type: "Combo",
      products: [comboCategory.id],
      isForLimitedTime: false,
      expireDateTime: null,
    },
  ]);

  await SubscriptionBanner.bulkCreate([
    { image: hero("Premium Member Extra Savings", colorPairs.dark) },
    { image: hero("Get Better Prices on Every Stack", colorPairs.green) },
  ]);

  return { coupons };
}

async function seedContent() {
  await Plan.bulkCreate([
    {
      duration: "1 Month",
      price: 199,
      benefits: ["Extra member prices", "Early sale access", "Wallet cashback on selected orders"],
    },
    {
      duration: "3 Months",
      price: 499,
      benefits: ["Extra member prices", "Priority support", "Higher wallet cashback"],
    },
    {
      duration: "12 Months",
      price: 1499,
      benefits: ["Best member prices", "Birthday coupon", "Priority delivery support"],
    },
  ]);

  await FAQ.bulkCreate([
    {
      heading: "Authenticity",
      question: "Are these seeded products real inventory?",
      answer: "No. This is clean test data for development and QA. It is structured like a supplement marketplace but does not represent live stock.",
    },
    {
      heading: "Orders",
      question: "Can seeded orders be used for admin testing?",
      answer: "Yes. The script creates active and delivered orders with users, addresses, coupons and product references.",
    },
    {
      heading: "Products",
      question: "Why do product images show text labels?",
      answer: "The images are stable generated placeholders so every admin and storefront screen has predictable visuals during testing.",
    },
    {
      heading: "Coupons",
      question: "Which test coupons are available?",
      answer: "Use BIGNLEAN25, FIRST500, STACK10 and WELLNESS15 for coupon and pricing flow checks.",
    },
    {
      heading: "Premium",
      question: "Is premium pricing available in the seed?",
      answer: "Yes. Product variants include MRP, selling price and premium member price fields.",
    },
    {
      heading: "Shipping",
      question: "Do orders include multiple delivery statuses?",
      answer: "Yes. Seeded orders include Processing, Accepted, Shipped, Out_for_Delivery, Delivered and Cancelled statuses.",
    },
  ]);

  await Blog.bulkCreate([
    {
      heading: "How to build a simple protein and creatine stack",
      images: [hero("Protein + Creatine Guide", colorPairs.green)],
      bodyText:
        "Start with a protein product that fits your daily intake gap. Add creatine when strength training is consistent. Keep flavours, serving size and budget visible so users can compare products clearly.",
      tags: ["sports nutrition", "protein", "creatine"],
      duration: "5",
      category: "Guides",
    },
    {
      heading: "Wellness products that work well in a daily routine",
      images: [hero("Daily Wellness Guide", colorPairs.blue)],
      bodyText:
        "Multivitamins, omega products and mineral support are common wellness catalogue rows. The seed keeps product claims conservative and focuses on comparison fields for QA.",
      tags: ["wellness", "vitamins"],
      duration: "4",
      category: "Wellness",
    },
    {
      heading: "Healthy food merchandising for a nutrition store",
      images: [hero("Healthy Foods Guide", colorPairs.amber)],
      bodyText:
        "Protein peanut butter, bars, oats and muesli help test grocery-style listing, snack bundles and cart values alongside supplement products.",
      tags: ["healthy foods", "snacks"],
      duration: "4",
      category: "Nutrition",
    },
  ]);

  await Certificate.bulkCreate([
    {
      brandName: "BignLean Labs",
      description: "Sample authenticity certificate for admin certificate upload and display testing.",
      image: asset(700, 500, "BignLean Certificate", colorPairs.green),
    },
    {
      brandName: "ActiveFuel",
      description: "Sample batch verification certificate used by test product detail screens.",
      image: asset(700, 500, "ActiveFuel Certificate", colorPairs.rose),
    },
  ]);

  await AboutFitness.create({
    images: [
      hero("Train Clean", colorPairs.dark),
      hero("Eat Better", colorPairs.green),
    ],
    description:
      "BignLean test content for the fitness information module. Use it to validate image carousels, actor cards and long-form admin editing.",
    actors: [
      { name: "Aarav Mehta", role: "Strength Coach", image: logo("AM", colorPairs.dark) },
      { name: "Nisha Rao", role: "Sports Nutritionist", image: logo("NR", colorPairs.rose) },
      { name: "Kabir Singh", role: "Endurance Coach", image: logo("KS", colorPairs.blue) },
    ],
  });

  await GymGuide.bulkCreate([
    {
      file: "https://example.com/bignlean/guides/beginner-strength-guide.pdf",
      description: "Beginner strength guide placeholder for admin guide management testing.",
    },
    {
      file: "https://example.com/bignlean/guides/nutrition-checklist.pdf",
      description: "Nutrition checklist placeholder for file and description testing.",
    },
  ]);

  await Subscribe.bulkCreate([
    { email: "dev.customer1@example.com" },
    { email: "dev.customer2@example.com" },
    { email: "qa.user@example.com" },
  ]);

  await ContactLead.bulkCreate([
    {
      name: "Rohan Kapoor",
      phone: "9876500011",
      email: "rohan.qa@example.com",
      message: "Need help choosing a beginner protein stack.",
    },
    {
      name: "Meera Shah",
      phone: "9876500012",
      email: "meera.qa@example.com",
      message: "Looking for premium membership details.",
    },
  ]);
}

async function seedCustomersAndOrders(products, coupons) {
  const users = {};
  const userRows = [
    ["Aarav Sharma", "9876500001", "aarav.sharma@example.com", "Male", "1995-04-12", 178, 76, 220],
    ["Nisha Verma", "9876500002", "nisha.verma@example.com", "Female", "1998-08-22", 164, 58, 150],
    ["Kabir Malhotra", "9876500003", "kabir.malhotra@example.com", "Male", "1992-11-05", 181, 84, 310],
    ["Meera Iyer", "9876500004", "meera.iyer@example.com", "Female", "1997-02-17", 160, 54, 90],
    ["Rohan Sethi", "9876500005", "rohan.sethi@example.com", "Male", "1990-06-30", 174, 81, 60],
  ];

  for (const [name, phone, email, gender, dob, height, weight, bglCash] of userRows) {
    users[name] = await User.create({
      name,
      phone,
      email,
      gender,
      dob,
      height,
      weight,
      bglCash,
      image: logo(name.split(" ").map((part) => part[0]).join(""), colorPairs.slate),
      referCode: `BGL${phone.slice(-4)}`,
      otp: null,
      otpExpiry: null,
      firebaseUid: null,
      googleId: null,
      facebookId: null,
      isBlocked: false,
    });
  }

  const addresses = {};
  for (const row of [
    ["Aarav Sharma", "Flat 1202, Green Heights", "Near Metro Station", "Gurugram", "Haryana", "122001", "Home"],
    ["Nisha Verma", "A-44, Pearl Residency", "Opposite City Mall", "Mumbai", "Maharashtra", "400053", "Home"],
    ["Kabir Malhotra", "21, Lake View Road", "Sector 8", "Bengaluru", "Karnataka", "560102", "Work"],
    ["Meera Iyer", "8B, Lotus Apartments", "Anna Nagar", "Chennai", "Tamil Nadu", "600040", "Home"],
    ["Rohan Sethi", "House 19, Rose Avenue", "Model Town", "Delhi", "Delhi", "110009", "Home"],
  ]) {
    const [userName, flat, landmark, city, state, pincode, type] = row;
    const user = users[userName];
    addresses[userName] = await Address.create({
      user: user.id,
      flat,
      landmark,
      city,
      state,
      pincode,
      type,
      name: user.name,
      phone: user.phone,
      isDefault: true,
    });
  }

  const now = Date.now();
  const orderRows = [
    {
      user: "Aarav Sharma",
      products: ["BignLean Elite Whey Protein", "NutriForge Creatine Monohydrate"],
      qty: [1, 2],
      amount: 4197,
      shiping: 0,
      coupon: "STACK10",
      couponDiscount: 420,
      totalAmount: 3777,
      paymentMethod: "Prepaid",
      status: "Delivered",
      daysAgo: 12,
    },
    {
      user: "Nisha Verma",
      products: ["VitalCore Daily Multivitamin Women", "PrimeWell Omega 3 Fish Oil"],
      qty: [1, 1],
      amount: 1528,
      shiping: 49,
      coupon: "WELLNESS15",
      couponDiscount: 229,
      totalAmount: 1348,
      paymentMethod: "COD",
      status: "Shipped",
      daysAgo: 3,
    },
    {
      user: "Kabir Malhotra",
      products: ["BignLean Whey Isolate 90", "ActiveFuel Pre Workout Rush", "BignLean BCAA Hydration"],
      qty: [1, 1, 1],
      amount: 6497,
      shiping: 0,
      coupon: "BIGNLEAN25",
      couponDiscount: 1624,
      totalAmount: 4873,
      paymentMethod: "Prepaid",
      status: "Out_for_Delivery",
      daysAgo: 1,
    },
    {
      user: "Meera Iyer",
      products: ["BignLean High Protein Peanut Butter", "NutriForge Protein Bar Box", "PrimeWell Protein Muesli"],
      qty: [2, 1, 1],
      amount: 2086,
      shiping: 49,
      coupon: "FIRST500",
      couponDiscount: 500,
      totalAmount: 1635,
      paymentMethod: "Prepaid",
      status: "Accepted",
      daysAgo: 0,
    },
    {
      user: "Rohan Sethi",
      products: ["LeanFit Meal Replacement Shake", "LeanFit L-Carnitine Liquid"],
      qty: [1, 1],
      amount: 2298,
      shiping: 0,
      coupon: null,
      couponDiscount: 0,
      totalAmount: 2298,
      paymentMethod: "COD",
      status: "Processing",
      daysAgo: 0,
    },
    {
      user: "Aarav Sharma",
      products: ["HerbRoot Shilajit Resin"],
      qty: [1],
      amount: 799,
      shiping: 49,
      coupon: null,
      couponDiscount: 0,
      totalAmount: 848,
      paymentMethod: "Prepaid",
      status: "Cancelled",
      daysAgo: 5,
    },
  ];

  const orders = [];
  for (const [index, row] of orderRows.entries()) {
    const user = users[row.user];
    const coupon = row.coupon ? coupons[row.coupon] : null;
    const createdAt = new Date(now - row.daysAgo * 24 * 60 * 60 * 1000);
    const order = await Order.create({
      user: user.id,
      product: row.products.map((name) => products[name].id),
      address: addresses[row.user].id,
      usedCoupon: Boolean(coupon),
      coupon: coupon ? coupon.id : 0,
      couponDiscount: row.couponDiscount,
      amount: row.amount,
      qty: row.qty,
      paymentMethod: row.paymentMethod,
      transactionId: row.paymentMethod === "Prepaid" ? `PAY_TEST_${1000 + index}` : null,
      usedBGLCash: index === 0,
      bglCash: index === 0 ? 120 : 0,
      earnedBglCash: Math.floor(row.totalAmount * 0.02),
      shiping: row.shiping,
      totalAmount: row.totalAmount,
      orderID: `BGLTEST${String(index + 1).padStart(4, "0")}`,
      trackingID: ["Shipped", "Out_for_Delivery", "Delivered"].includes(row.status)
        ? `TRK${String(720000 + index)}`
        : null,
      status: row.status,
      createdAt,
      updatedAt: createdAt,
    });
    orders.push(order);
  }

  await Cart.bulkCreate([
    {
      user: users["Aarav Sharma"].id,
      product: products["ActiveFuel Sparkling Protein Water"].id,
      varientId: 1,
      flavour: "Lemon",
      qty: 1,
      mrp: 1199,
      sellingPrice: 899,
      premiumPrice: 849,
    },
    {
      user: users["Nisha Verma"].id,
      product: products["PureForm Biotin Hair & Skin"].id,
      varientId: 1,
      flavour: "Tablet",
      qty: 2,
      mrp: 699,
      sellingPrice: 399,
      premiumPrice: 379,
    },
  ]);

  await Favorite.bulkCreate([
    { user: users["Aarav Sharma"].id, product: products["BignLean Whey Isolate 90"].id },
    { user: users["Nisha Verma"].id, product: products["VitalCore Collagen Peptides"].id },
    { user: users["Kabir Malhotra"].id, product: products["ActiveFuel Pre Workout Rush"].id },
    { user: users["Meera Iyer"].id, product: products["BignLean High Protein Peanut Butter"].id },
  ]);

  await RecentView.bulkCreate([
    { userId: users["Aarav Sharma"].id, productId: products["NutriForge Creatine Monohydrate"].id },
    { userId: users["Aarav Sharma"].id, productId: products["BignLean BCAA Hydration"].id },
    { userId: users["Nisha Verma"].id, productId: products["PrimeWell Omega 3 Fish Oil"].id },
    { userId: users["Kabir Malhotra"].id, productId: products["LeanFit Meal Replacement Shake"].id },
  ]);

  await RecentSearches.bulkCreate([
    { user: users["Aarav Sharma"].id, query: "whey protein" },
    { user: users["Nisha Verma"].id, query: "collagen" },
    { user: users["Kabir Malhotra"].id, query: "pre workout" },
  ]);

  await Rating.bulkCreate([
    {
      user: users["Aarav Sharma"].id,
      product: products["BignLean Elite Whey Protein"].id,
      images: [],
      rate: 4.6,
      tasteRate: 4.5,
      mixabilityRate: 4.7,
      efficacyRate: 4.6,
      valueForMoneyRate: 4.4,
      review: "Clean test review: mixes well and works for the product detail rating UI.",
    },
    {
      user: users["Kabir Malhotra"].id,
      product: products["NutriForge Creatine Monohydrate"].id,
      images: [],
      rate: 4.8,
      tasteRate: 4.5,
      mixabilityRate: 4.9,
      efficacyRate: 4.8,
      valueForMoneyRate: 4.7,
      review: "Useful for testing best-seller and review sorting flows.",
    },
    {
      user: users["Nisha Verma"].id,
      product: products["PrimeWell Omega 3 Fish Oil"].id,
      images: [],
      rate: 4.4,
      tasteRate: 4.1,
      mixabilityRate: 4.3,
      efficacyRate: 4.4,
      valueForMoneyRate: 4.2,
      review: "Good seeded wellness product review for admin moderation screens.",
    },
  ]);

  await Subscription.create({
    user: users["Aarav Sharma"].id,
    plan: 2,
    purchaseAt: new Date(now - 10 * 24 * 60 * 60 * 1000),
    expireAt: new Date(now + 80 * 24 * 60 * 60 * 1000),
  });

  await Transaction.bulkCreate([
    {
      user: users["Aarav Sharma"].id,
      orderId: orders[0].id,
      title: "Wallet cashback from delivered order",
      type: "in",
      value: 75,
    },
    {
      user: users["Aarav Sharma"].id,
      orderId: orders[0].id,
      title: "Wallet cash used on order",
      type: "out",
      value: 120,
    },
  ]);

  return { users, orders };
}

async function seed() {
  await sequelize.authenticate();
  await ensureSchema();
  await resetData();

  const categoryData = await seedCategories();
  const brands = await seedBrands();
  const products = await seedProducts({ ...categoryData, brands });
  const merchandising = await seedMerchandising(products);
  await seedContent();
  const customerData = await seedCustomersAndOrders(products, merchandising.coupons);

  const counts = {
    categories: await Category.count(),
    subcategories: await SubCategory.count(),
    subcategories2: await SubCategory2.count(),
    brands: await Brand.count(),
    products: await Product.count(),
    banners: await Banner.count(),
    deals: await Deal.count(),
    coupons: await Coupon.count(),
    users: await User.count(),
    orders: await Order.count(),
    ratings: await Rating.count(),
  };

  console.log("Clean BignLean test data seeded successfully.");
  console.log(JSON.stringify(counts, null, 2));
  console.log(`Seeded users: ${Object.keys(customerData.users).join(", ")}`);
}

seed()
  .catch((error) => {
    console.error("Failed to seed clean test data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });

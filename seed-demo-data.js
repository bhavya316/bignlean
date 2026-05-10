const sequelize = require("./config/database");
const { DataTypes } = require("sequelize");

const Banner = require("./admin/model/banners");
const Brand = require("./admin/model/brand");
const Category = require("./admin/model/category");
const SubCategory = require("./admin/model/subCategory");
const SubCategory2 = require("./admin/model/subCategory2");
const Product = require("./admin/model/product");
const Blog = require("./admin/model/blog");
const FAQ = require("./admin/model/faq");
const Coupon = require("./admin/model/coupon");
const Deal = require("./admin/model/deal");
const Offer = require("./admin/model/offer");
const ComboCategory = require("./admin/model/comboCat");
const ComboProduct = require("./admin/model/comboProduct");

const hero =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80";
const gym =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80";
const nutrition =
  "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1200&q=80";
const snacks =
  "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80";

const logo = (text, bg = "111827", fg = "ffffff") =>
  `https://placehold.co/500x500/${bg}/${fg}.png?text=${encodeURIComponent(text)}`;

const banner = (text, bg = "111827", fg = "ffffff") =>
  `https://placehold.co/1600x520/${bg}/${fg}.png?text=${encodeURIComponent(text)}`;

const productImage = (text, bg = "f8fafc", fg = "111827") =>
  `https://placehold.co/900x900/${bg}/${fg}.png?text=${encodeURIComponent(text)}`;

async function upsertBy(model, where, values) {
  const existing = await model.findOne({ where });
  if (existing) {
    await existing.update(values);
    return existing;
  }
  return model.create({ ...where, ...values });
}

async function ensureDemoColumns() {
  const queryInterface = sequelize.getQueryInterface();
  const coupons = await queryInterface.describeTable("coupons");
  const comboCategories = await queryInterface.describeTable("comboCategories");

  if (!coupons.expiryDate) {
    await queryInterface.addColumn("coupons", "expiryDate", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  }

  if (!comboCategories.ruleExactlyTwo) {
    await queryInterface.addColumn("comboCategories", "ruleExactlyTwo", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
}

function productBasics({ mrp, sellingPrice, premiumPrice, stock, units, flavor, weight }) {
  return [
    {
      id: 1,
      mrp: String(mrp),
      date: "2026-12-31T00:00",
      stock: String(stock),
      units,
      weight,
      flavor,
      premiumPrice: String(premiumPrice),
      sellingPrice: String(sellingPrice),
    },
  ];
}

function contentBlocks(name) {
  return {
    overView: [
      { value: "24g", nutrients: "Protein" },
      { value: "5.5g", nutrients: "BCAA" },
      { value: "Fast", nutrients: "Mixability" },
      { value: "Veg", nutrients: "Type" },
    ],
    details: [
      {
        heading: "About the product",
        body: `${name} is a demo nutrition product for the Bignlean store. It is written to show the product detail layout, variant selector, delivery panel, and admin catalogue data.`,
      },
      {
        heading: "How to use",
        body: "Mix one serving with chilled water or milk. Use after training or between meals as part of a balanced nutrition plan.",
      },
    ],
    tables: [
      {
        title: "General Traits",
        table: [
          { for: "Serving size", value: "1 scoop" },
          { for: "Goal", value: "Muscle recovery" },
        ],
      },
    ],
    information: [
      { value: "No added sugar", nutrients: "Sugar" },
      { value: "India", nutrients: "Country of origin" },
    ],
    certificates: [logo("AUTHENTIC", "dcfce7", "166534")],
    supplements: [logo("LAB TESTED", "dbeafe", "1d4ed8")],
  };
}

async function seed() {
  await sequelize.authenticate();
  await ensureDemoColumns();

  const categories = {};
  for (const item of [
    ["Sports Nutrition", "Protein, creatine, amino acids and workout support"],
    ["Vitamins & Wellness", "Daily wellness and immunity essentials"],
    ["Healthy Foods", "Protein snacks, nut butters and clean foods"],
    ["Weight Management", "Lean goals and active lifestyle support"],
    ["Performance", "Pre-workout and endurance essentials"],
  ]) {
    const [name] = item;
    categories[name] = await upsertBy(Category, { name }, {
      imageOn: logo(name, "fef3c7", "92400e"),
      imageOff: logo(name, "f3f4f6", "111827"),
      brandId: null,
    });
  }

  const subcategories = {};
  for (const item of [
    ["Whey Protein", "Sports Nutrition"],
    ["Creatine", "Sports Nutrition"],
    ["Mass Gainers", "Sports Nutrition"],
    ["Amino Acids", "Sports Nutrition"],
    ["Multivitamins", "Vitamins & Wellness"],
    ["Omega & Minerals", "Vitamins & Wellness"],
    ["Protein Snacks", "Healthy Foods"],
    ["Nut Butters", "Healthy Foods"],
    ["Fat Burners", "Weight Management"],
    ["Meal Replacements", "Weight Management"],
    ["Pre Workout", "Performance"],
    ["Intra Workout", "Performance"],
  ]) {
    const [name, catName] = item;
    subcategories[name] = await upsertBy(SubCategory, { name, catId: categories[catName].id }, {});
  }

  const subcategory2 = {};
  for (const item of [
    ["Isolate Whey", "Whey Protein"],
    ["Monohydrate", "Creatine"],
    ["Clean Bulk", "Mass Gainers"],
    ["BCAA Blend", "Amino Acids"],
    ["Daily Wellness", "Multivitamins"],
    ["Omega 3", "Omega & Minerals"],
    ["Mineral Support", "Omega & Minerals"],
    ["High Protein", "Protein Snacks"],
    ["Crunchy Spread", "Nut Butters"],
    ["Thermo Support", "Fat Burners"],
    ["Lean Shake", "Meal Replacements"],
    ["Energy Blend", "Pre Workout"],
    ["Electrolyte Blend", "Intra Workout"],
  ]) {
    const [name, subName] = item;
    subcategory2[name] = await upsertBy(SubCategory2, {
      name,
      subCategoryId: subcategories[subName].id,
    }, {});
  }

  const brands = {};
  for (const item of [
    ["Bignlean Labs", "Bignlean Labs curates sports nutrition for Indian athletes with verified ingredients and practical pricing.", "BIGNLEAN"],
    ["MuscleBlaze", "A performance nutrition brand for everyday athletes and serious lifters.", "MB"],
    ["GNC", "Wellness and performance supplements with a global nutrition footprint.", "GNC"],
    ["Optimum Nutrition", "Protein and sports nutrition staples for consistent training routines.", "ON"],
    ["Vital Pro", "Daily wellness, vitamins and active lifestyle essentials.", "VITAL"],
  ]) {
    const [name, description, mark] = item;
    brands[name] = await upsertBy(Brand, { name }, {
      image: logo(mark, "ffffff", "111827"),
      banner: [banner(`${name} Store`)],
      description,
      subcatId: null,
      subcatId2: null,
    });
  }

  const productRows = [
    {
      name: "Bignlean Elite Whey Protein",
      cat: "Sports Nutrition",
      sub: "Whey Protein",
      sub2: "Isolate Whey",
      brand: "Bignlean Labs",
      image: productImage("Elite Whey Protein"),
      mrp: 3499,
      premiumPrice: 3199,
      sellingPrice: 2499,
      stock: 42,
      units: "2 kg",
      flavor: ["Chocolate Fudge", "Mango Smoothie"],
      weight: 2000,
      bestSeller: true,
      flash: true,
    },
    {
      name: "MuscleBlaze Biozyme Performance Whey",
      cat: "Sports Nutrition",
      sub: "Whey Protein",
      sub2: "Isolate Whey",
      brand: "MuscleBlaze",
      image: productImage("Biozyme Whey", "fff7ed", "9a3412"),
      mrp: 4299,
      premiumPrice: 3999,
      sellingPrice: 3199,
      stock: 35,
      units: "2 kg",
      flavor: ["Rich Chocolate"],
      weight: 2000,
      bestSeller: true,
      flash: false,
    },
    {
      name: "GNC Creatine Monohydrate",
      cat: "Sports Nutrition",
      sub: "Creatine",
      sub2: "Monohydrate",
      brand: "GNC",
      image: productImage("Creatine 250g", "ecfeff", "155e75"),
      mrp: 1499,
      premiumPrice: 1299,
      sellingPrice: 899,
      stock: 54,
      units: "250 g",
      flavor: ["Unflavoured"],
      weight: 250,
      bestSeller: true,
      flash: true,
    },
    {
      name: "Optimum Nutrition Gold Standard Whey",
      cat: "Sports Nutrition",
      sub: "Whey Protein",
      sub2: "Isolate Whey",
      brand: "Optimum Nutrition",
      image: productImage("Gold Standard Whey", "eef2ff", "3730a3"),
      mrp: 5999,
      premiumPrice: 5599,
      sellingPrice: 4999,
      stock: 18,
      units: "2 lb",
      flavor: ["Double Rich Chocolate"],
      weight: 907,
      bestSeller: false,
      flash: false,
    },
    {
      name: "GNC Isolate Whey Ultra",
      cat: "Sports Nutrition",
      sub: "Whey Protein",
      sub2: "Isolate Whey",
      brand: "GNC",
      image: productImage("Isolate Whey Ultra", "eff6ff", "1d4ed8"),
      mrp: 5299,
      premiumPrice: 4899,
      sellingPrice: 4299,
      stock: 24,
      units: "1.8 kg",
      flavor: ["Vanilla Cream", "Chocolate"],
      weight: 1800,
      bestSeller: false,
      flash: true,
    },
    {
      name: "Vital Pro Daily Multivitamin",
      cat: "Vitamins & Wellness",
      sub: "Multivitamins",
      sub2: "Daily Wellness",
      brand: "Vital Pro",
      image: productImage("Daily Multivitamin", "f0fdf4", "166534"),
      mrp: 999,
      premiumPrice: 899,
      sellingPrice: 599,
      stock: 80,
      units: "60 tablets",
      flavor: ["Tablet"],
      weight: 120,
      bestSeller: false,
      flash: false,
    },
    {
      name: "MuscleBlaze Mass Gainer XXL",
      cat: "Sports Nutrition",
      sub: "Mass Gainers",
      sub2: "Clean Bulk",
      brand: "MuscleBlaze",
      image: productImage("Mass Gainer XXL", "fef2f2", "991b1b"),
      mrp: 2899,
      premiumPrice: 2699,
      sellingPrice: 2199,
      stock: 38,
      units: "3 kg",
      flavor: ["Chocolate", "Kesar Kulfi"],
      weight: 3000,
      bestSeller: false,
      flash: true,
    },
    {
      name: "Optimum Nutrition Micronized Creatine",
      cat: "Sports Nutrition",
      sub: "Creatine",
      sub2: "Monohydrate",
      brand: "Optimum Nutrition",
      image: productImage("Micronized Creatine", "f5f3ff", "5b21b6"),
      mrp: 1799,
      premiumPrice: 1599,
      sellingPrice: 1199,
      stock: 47,
      units: "300 g",
      flavor: ["Unflavoured"],
      weight: 300,
      bestSeller: false,
      flash: false,
    },
    {
      name: "Bignlean BCAA Hydration",
      cat: "Sports Nutrition",
      sub: "Amino Acids",
      sub2: "BCAA Blend",
      brand: "Bignlean Labs",
      image: productImage("BCAA Hydration", "ecfdf5", "047857"),
      mrp: 1699,
      premiumPrice: 1499,
      sellingPrice: 999,
      stock: 44,
      units: "400 g",
      flavor: ["Watermelon", "Blue Raspberry"],
      weight: 400,
      bestSeller: false,
      flash: true,
    },
    {
      name: "GNC Triple Strength Fish Oil",
      cat: "Vitamins & Wellness",
      sub: "Omega & Minerals",
      sub2: "Omega 3",
      brand: "GNC",
      image: productImage("Fish Oil", "e0f2fe", "075985"),
      mrp: 1599,
      premiumPrice: 1399,
      sellingPrice: 1099,
      stock: 66,
      units: "90 softgels",
      flavor: ["Softgel"],
      weight: 180,
      bestSeller: true,
      flash: false,
    },
    {
      name: "Vital Pro Magnesium Zinc",
      cat: "Vitamins & Wellness",
      sub: "Omega & Minerals",
      sub2: "Mineral Support",
      brand: "Vital Pro",
      image: productImage("Magnesium Zinc", "faf5ff", "7e22ce"),
      mrp: 899,
      premiumPrice: 799,
      sellingPrice: 549,
      stock: 72,
      units: "60 tablets",
      flavor: ["Tablet"],
      weight: 100,
      bestSeller: false,
      flash: true,
    },
    {
      name: "Bignlean High Protein Peanut Butter",
      cat: "Healthy Foods",
      sub: "Protein Snacks",
      sub2: "High Protein",
      brand: "Bignlean Labs",
      image: productImage("Protein Peanut Butter", "fefce8", "854d0e"),
      mrp: 699,
      premiumPrice: 649,
      sellingPrice: 449,
      stock: 95,
      units: "1 kg",
      flavor: ["Dark Chocolate", "Crunchy"],
      weight: 1000,
      bestSeller: true,
      flash: false,
    },
    {
      name: "MuscleBlaze Protein Bar Box",
      cat: "Healthy Foods",
      sub: "Protein Snacks",
      sub2: "High Protein",
      brand: "MuscleBlaze",
      image: productImage("Protein Bar Box", "fdf2f8", "be185d"),
      mrp: 999,
      premiumPrice: 899,
      sellingPrice: 699,
      stock: 58,
      units: "12 bars",
      flavor: ["Choco Almond", "Cookies Cream"],
      weight: 720,
      bestSeller: false,
      flash: false,
    },
    {
      name: "Bignlean Almond Crunch Peanut Butter",
      cat: "Healthy Foods",
      sub: "Nut Butters",
      sub2: "Crunchy Spread",
      brand: "Bignlean Labs",
      image: productImage("Almond Crunch PB", "fffbeb", "92400e"),
      mrp: 799,
      premiumPrice: 749,
      sellingPrice: 529,
      stock: 88,
      units: "1 kg",
      flavor: ["Almond Crunch"],
      weight: 1000,
      bestSeller: false,
      flash: true,
    },
    {
      name: "Bignlean Green Coffee Fat Burner",
      cat: "Weight Management",
      sub: "Fat Burners",
      sub2: "Thermo Support",
      brand: "Bignlean Labs",
      image: productImage("Green Coffee", "ecfccb", "3f6212"),
      mrp: 1299,
      premiumPrice: 1199,
      sellingPrice: 799,
      stock: 60,
      units: "60 capsules",
      flavor: ["Capsule"],
      weight: 150,
      bestSeller: false,
      flash: true,
    },
    {
      name: "GNC CLA Lean Formula",
      cat: "Weight Management",
      sub: "Fat Burners",
      sub2: "Thermo Support",
      brand: "GNC",
      image: productImage("CLA Lean Formula", "f7fee7", "4d7c0f"),
      mrp: 1899,
      premiumPrice: 1699,
      sellingPrice: 1299,
      stock: 41,
      units: "90 capsules",
      flavor: ["Capsule"],
      weight: 180,
      bestSeller: false,
      flash: false,
    },
    {
      name: "Vital Pro Lean Meal Shake",
      cat: "Weight Management",
      sub: "Meal Replacements",
      sub2: "Lean Shake",
      brand: "Vital Pro",
      image: productImage("Lean Meal Shake", "f0f9ff", "0369a1"),
      mrp: 2199,
      premiumPrice: 1999,
      sellingPrice: 1499,
      stock: 36,
      units: "1 kg",
      flavor: ["Vanilla", "Cafe Mocha"],
      weight: 1000,
      bestSeller: true,
      flash: false,
    },
    {
      name: "Bignlean Pre Workout Rush",
      cat: "Performance",
      sub: "Pre Workout",
      sub2: "Energy Blend",
      brand: "Bignlean Labs",
      image: productImage("Pre Workout Rush", "fee2e2", "991b1b"),
      mrp: 1899,
      premiumPrice: 1699,
      sellingPrice: 1199,
      stock: 32,
      units: "300 g",
      flavor: ["Fruit Punch"],
      weight: 300,
      bestSeller: false,
      flash: true,
    },
    {
      name: "MuscleBlaze Pre Workout 200 Xtreme",
      cat: "Performance",
      sub: "Pre Workout",
      sub2: "Energy Blend",
      brand: "MuscleBlaze",
      image: productImage("Pre Workout 200", "fef2f2", "b91c1c"),
      mrp: 2299,
      premiumPrice: 2099,
      sellingPrice: 1599,
      stock: 29,
      units: "300 g",
      flavor: ["Orange Mango"],
      weight: 300,
      bestSeller: false,
      flash: true,
    },
    {
      name: "Bignlean Electrolyte Fuel",
      cat: "Performance",
      sub: "Intra Workout",
      sub2: "Electrolyte Blend",
      brand: "Bignlean Labs",
      image: productImage("Electrolyte Fuel", "f0fdfa", "0f766e"),
      mrp: 999,
      premiumPrice: 899,
      sellingPrice: 649,
      stock: 75,
      units: "500 g",
      flavor: ["Lemon Lime", "Orange"],
      weight: 500,
      bestSeller: false,
      flash: false,
    },
  ];

  const products = {};
  for (const item of productRows) {
    const blocks = contentBlocks(item.name);
    products[item.name] = await upsertBy(Product, { name: item.name }, {
      catId: categories[item.cat].id,
      subCatId: subcategories[item.sub].id,
      subCatId2: subcategory2[item.sub2].id,
      brandId: brands[item.brand].id,
      isBestSeller: item.bestSeller,
      isOnFlashSale: item.flash,
      images: [item.image, nutrition, gym],
      ...blocks,
      brand: {
        heading: item.brand,
        body: brands[item.brand].description,
      },
      hit: item.bestSeller ? 120 : 40,
      varients: productBasics(item),
      expiry_date: "2026-12-31",
      countryOfOrigin: "India",
      isVeg: true,
    });
  }

  const productIds = Object.values(products).map((product) => product.id);
  const newest = new Date();
  const dealRows = [
    ["Price Slash Alert", "Single", productIds.slice(0, 5), 0],
    ["Popular Products", "Single", productIds.slice(2, 8), 1],
    ["Workout Essentials", "Single", [products["Bignlean Elite Whey Protein"].id, products["GNC Creatine Monohydrate"].id, products["Bignlean Pre Workout Rush"].id], 2],
  ];

  for (const [name, type, ids, offset] of dealRows) {
    const deal = await upsertBy(Deal, { name }, {
      type,
      products: ids,
      isForLimitedTime: name === "Price Slash Alert",
      expireDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    deal.set("createdAt", new Date(newest.getTime() - offset * 60 * 1000));
    await deal.save({ silent: true });
  }

  await upsertBy(Offer, { name: "Buy 2 @ 15% Off" }, {
    image: banner("Buy 2 @ 15% Off", "fee2e2", "991b1b"),
    products: productIds.slice(0, 6),
  });

  for (const item of [
    ["Hero Slider", banner("Mega Nutrition Sale | Up to 45% Off", "0f172a", "ffffff"), ["/shop-by-brands"]],
    ["Hero Slider", banner("Protein, Creatine & Wellness Essentials", "1f2937", "ffffff"), ["/product"]],
    ["Banner 1 Section", banner("Combo Stack | Build Your Workout Pack", "dcfce7", "14532d"), ["/combo/1"]],
    ["Banner 2 Section", banner("Certified Authentic Supplements", "dbeafe", "1e3a8a"), ["/authenticity"]],
    ["Banner 3 Section", banner("Daily Vitamins For Active Routines", "fef9c3", "713f12"), ["/shop-by-brands"]],
  ]) {
    const [type, web, link] = item;
    await upsertBy(Banner, { web }, {
      phone: web,
      tab: web,
      link,
      type,
    });
  }

  for (const item of [
    ["BIGNLEAN25", 25, 500, "Percentage-wise"],
    ["FIRST500", 500, 250, "Price-wise"],
    ["STACK10", 10, 300, "Percentage-wise"],
  ]) {
    const [coupon, discount, qty, category] = item;
    await upsertBy(Coupon, { coupon }, {
      discount,
      qty,
      category,
      expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    });
  }

  for (const item of [
    ["General Questions", "Are these products authentic?", "Yes. The demo catalogue is seeded to show the authenticity and admin workflows. In production, each listed product should map to verified inventory and invoices."],
    ["General Questions", "How do I track my order?", "Use the My Orders page after checkout. The seeded website also includes shipping and tracking routes for the order flow."],
    ["Payments & Coupons", "Can I use coupons on discounted products?", "Coupon eligibility depends on the coupon type, expiry date and available quantity configured in the admin panel."],
    ["Shipping", "How fast is delivery?", "Delivery timelines depend on serviceability at the destination pincode and the selected shipping partner."],
    ["Products", "How do I choose a protein?", "Start with your goal, dietary preference, budget and serving size. Product detail pages show variants, nutrition details and origin country."],
  ]) {
    const [heading, question, answer] = item;
    await upsertBy(FAQ, { question }, { heading, answer });
  }

  for (const item of [
    {
      heading: "How to build a supplement stack without overbuying",
      category: "Guides",
      image: nutrition,
      body: "A simple stack starts with protein, creatine and a daily micronutrient base.\nChoose one product for each actual gap in your diet.\nUse the product detail nutrition panel before comparing flavours and variants.",
    },
    {
      heading: "Whey protein vs mass gainer: what should you pick?",
      category: "Nutrition",
      image: hero,
      body: "Whey protein supports protein intake without adding many calories.\nMass gainers are useful when total calories are the bottleneck.\nYour training goal and current diet should decide the choice.",
    },
    {
      heading: "Five checks before buying sports nutrition online",
      category: "Authenticity",
      image: gym,
      body: "Check seller details, expiry date, seal quality, batch information and return policy.\nPrefer products with transparent nutrition panels and support channels.\nKeep invoices for authenticity claims.",
    },
  ]) {
    await upsertBy(Blog, { heading: item.heading }, {
      images: [item.image],
      bodyText: item.body,
      tags: [item.category, "Bignlean"],
      duration: "5",
      category: item.category,
    });
  }

  const comboCategory = await upsertBy(ComboCategory, { name: "Choose Any 2 Essentials" }, {
    image: banner("Choose Any 2 Essentials", "f8fafc", "111827"),
    ruleExactlyTwo: true,
  });

  const comboItems = [
    products["Bignlean Elite Whey Protein"],
    products["GNC Creatine Monohydrate"],
    products["Bignlean Pre Workout Rush"],
    products["Vital Pro Daily Multivitamin"],
  ];

  for (const product of comboItems) {
    const baseProduct = product.toJSON();
    await upsertBy(ComboProduct, { name: `${baseProduct.name} Combo Pick` }, {
      catId: baseProduct.catId,
      comboCatId: comboCategory.id,
      subCatId: baseProduct.subCatId,
      subCatId2: baseProduct.subCatId2,
      brandId: baseProduct.brandId,
      isBestSeller: baseProduct.isBestSeller,
      isOnFlashSale: baseProduct.isOnFlashSale,
      images: baseProduct.images,
      overView: baseProduct.overView,
      details: baseProduct.details,
      tables: baseProduct.tables,
      information: baseProduct.information,
      certificates: baseProduct.certificates,
      supplements: baseProduct.supplements,
      brand: baseProduct.brand,
      hit: baseProduct.hit,
      varients: baseProduct.varients,
      expiry_date: baseProduct.expiry_date,
    });
  }

  await upsertBy(Deal, { name: "Combo Builder" }, {
    type: "Combo",
    products: [comboCategory.id],
    isForLimitedTime: false,
    expireDateTime: null,
  });

  console.log("Seeded demo marketplace data successfully.");
  console.log(`Categories: ${Object.keys(categories).length}`);
  console.log(`Brands: ${Object.keys(brands).length}`);
  console.log(`Products: ${Object.keys(products).length}`);
}

seed()
  .catch((error) => {
    console.error("Failed to seed demo data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });

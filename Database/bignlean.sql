-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 09, 2025 at 12:04 PM
-- Server version: 8.0.36-28
-- PHP Version: 8.1.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bignlean`
--

-- --------------------------------------------------------

--
-- Table structure for table `aboutFitnesses`
--

CREATE TABLE `aboutFitnesses` (
  `id` int NOT NULL,
  `images` json NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `actors` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aboutFitnesses`
--

INSERT INTO `aboutFitnesses` (`id`, `images`, `description`, `actors`, `createdAt`, `updatedAt`) VALUES
(16, '[\"https://bignlean-api.synoventum.site//uploads/1742315111151.jpeg\"]', 'Bodybuilding and fitness have ancient roots, tracing back to early civilizations like Egypt, Greece, and Rome, where physical strength and aesthetics were highly valued. The modern era of bodybuilding began in the late 19th century with strongmen like Eugen Sandow, who is often called the \"father of modern bodybuilding.\" Sandow popularized muscle display performances and organized the first major bodybuilding contest in 1901.\n\nIn the mid-20th century, figures like Steve Reeves and later Arnold Schwarzenegger brought bodybuilding into mainstream culture, especially through movies and competitions like Mr. Olympia, established in 1965. The fitness movement expanded in the 1970s and 1980s with the rise of gyms, aerobics, and health clubs, influenced by icons like Jane Fonda and Jack LaLanne.\n\nToday, bodybuilding and fitness encompass a wide range of activities, from professional competitions to general health and wellness, supported by global industries focused on training, nutrition, and supplements.', '[{\"name\": \"Pooja Batra\", \"images\": [\"https://bignlean-api.synoventum.site//uploads/1742315134210.jpeg\"], \"description\": \"Pooja Batra Shah is an Indian-American actress and model who primarily works in Hindi films. She won the runner-up title at the Femina Miss India contest in 1993 and was crowned Femina Miss India International 1993 and represented India at Miss International 1993.\\n\\nPooja Batra Shows Trust and support on Bignlean.com\"}, {\"name\": \"Nilesh Dagade\", \"images\": [\"https://bignlean-api.synoventum.site//uploads/1742315234958.jpeg\"], \"description\": \"Nilesh Dagade is an Indian Bodybuilder and also Won Mr. India Competition And Mumbai Shree.  \"}, {\"name\": \"Atul Ambre\", \"images\": [\"https://bignlean-api.synoventum.site//uploads/1742315442230.jpeg\"], \"description\": \"Atul Ambre - Indian Gaint A proffessional bodybuilder - He Won Many Tile Like Mumbai Shree, Maharashtra Shree & Mr. India Title as well. Atul Ambre is a great bodybuilder coach in India with his massive level of knowledge he had created many bodybuilders. he shows trust and support on bignlean.com and he was our Former Brand Ambassador.\"}, {\"name\": \"Sunit Jadhav\", \"images\": [\"https://bignlean-api.synoventum.site//uploads/1742315517177.jpeg\"], \"description\": \"Sunit Jadhav - Sunit Jadhav known for His career achieved Goal he won Many titles Like. Mumbai Shree, Maharashtra Shree, Mr. India & IFBB Pro he also Qualified Winner For Pro Card he was Bignlean.com Former Brand Partner \"}, {\"name\": \"Abhishek Bajaj\", \"images\": [\"https://bignlean-api.synoventum.site//uploads/1742315633787.jpeg\"], \"description\": \"Abhishek Bajaj is an Indian actor known for starring in the film Student of the Year 2 in the year 2019 and playing the role of Sandy in a film titled Chandigarh Kare Aashiqui.\\nAbhishek Bajaj is very passionate to fitness industry and toward  his healthy lifestyle \"}, {\"name\": \"Nawab Shah\", \"images\": [\"https://bignlean-api.synoventum.site//uploads/1742315650210.jpeg\"], \"description\": \"Nawab Shah is an Indian actor, who works in Hindi, Malayalam, Tamil, Telugu and Kannada-language films and television series. Before entering into films, he played character roles in television serials.\\n\\nNawab Shah Has A Wonderful physique and to maintain his physique he need always good quality products. Nawab Shah shows his complete trust and support on Us. \"}]', '2025-03-18 16:26:00', '2025-03-18 16:34:34');

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `flat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `landmark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pincode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user`, `flat`, `landmark`, `city`, `state`, `pincode`, `name`, `phone`, `type`, `isDefault`, `createdAt`, `updatedAt`) VALUES
(1, 6, 'C 202,Posh Complex, Mira Bhayandar Road Hatkesh Udhog Nagar Mira Road', '', 'Mira Bhayandar', '', '401107', 'Nupur Kadam', '', '', 0, '2024-07-29 07:27:57', '2024-07-29 07:27:57'),
(2, 5, 'Baner', 'PUNE', 'PUNE', '', '411045', 'Harshal Adarkar', '9673954645', 'HOME', 0, '2024-08-13 09:39:17', '2024-08-13 09:39:17'),
(3, 7, 'H.no-267, prakash vihar colony', 'Palwal', 'Palwal', 'Haryana', '121102', 'Ankit kumar', '8295451564', 'Home', 0, '2024-08-13 11:23:48', '2024-08-13 11:23:48'),
(4, 2, '1600 Amphitheatre Pkwy Building 43', 'Mountain View', 'Raipur', 'California', '497331', 'Deepak Kushwaha', '9399369854', 'Home', 1, '2024-08-14 06:35:42', '2024-08-14 06:35:42'),
(5, 11, 'Shop No 16, Lodha Freshia Building Kalyan Shil Road Nilje', 'Xperia mall', 'Dombivali', '', '421204', 'Sid v', '9321257310', '', 0, '2024-09-02 01:56:24', '2024-09-02 01:56:24'),
(7, 24, 'dsadas', 'rajkot', 'rajkot', '', '321321', 'parth', '1155225522', '', 0, '2025-05-05 09:24:44', '2025-05-05 09:24:44'),
(8, 20, 'Exercitation non vel', 'Quia repellendus En', 'Sed tempor reprehend', '', 'Voluptas exercitatio', 'Culpa pariatur Arch', 'Tenetur qu', 'office', 0, '2025-05-05 11:14:09', '2025-05-05 12:49:19'),
(9, 11, '201, Casa Bella, Victoria', 'Xperia Mall', 'Kalyan', '', '421204', 'Sid', '9321257310', 'office', 0, '2025-05-08 13:53:43', '2025-05-08 13:53:43'),
(10, 39, 'FLAT-503 SV NIVAAS APARTMENT GPR LAYOUT NIZAMPET', 'MEENAKSHI OLDAGE HOME', 'Hyderabad', '', '500090', 'VALAVALA SATISH', '8466952410', 'home', 0, '2025-05-29 11:24:40', '2025-05-29 11:24:40'),
(11, 39, 'FLAT-503 SV NIVAAS APARTMENT , GPR LAYOUT PLOT 448 AND 449 NIZAMPET BACHUPALLY', 'MEENAKSHI OLDAGE HOME', 'Hyderabad', '', '500090', 'VALAVALA SATISH', '', '', 0, '2025-05-29 11:25:43', '2025-05-29 11:25:43'),
(12, 4, 'D-2 1503, Runwal Pearl', 'Aban Park', 'Thane', '', '400607', 'Mervin Agera', '8655997455', 'home', 0, '2025-06-19 08:43:40', '2025-06-19 08:43:40'),
(13, 65, '52', 'ssss', 'pune', '', '7474', 'tester parth', '8855885588', 'home', 0, '2025-06-27 12:14:40', '2025-06-27 12:14:40'),
(14, 65, 'sda', 'eewwee', 'mDADA', '', '58585', 'tester parth', '8585858585', 'office', 0, '2025-06-27 12:15:23', '2025-06-27 12:15:23'),
(15, 40, 'Et rerum ipsum dese', 'Officia magnam cupid', 'Sunt debitis sint nu', 'MAHARASHTRA', 'Mollit et eum simili', 'Cumque voluptatibus ', 'Sequi minu', 'home', 0, '2025-06-27 12:45:24', '2025-06-27 12:45:24');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `phone`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'Alhn', '9399369854', 'contact@alhn.dev', '$2b$10$FFXWhKjomKFUzDNa8M9iAefQsJXySCXTMC8/NPPViqo5poj28Pjr.', '2024-07-10 16:25:36', '2024-07-10 16:25:36'),
(2, 'Rey Clothing', '1234567890', 'admin@test.dev', '$2b$10$3J6WB9Neu4uGvJ69Fj04T.xu/f.NfDf48zdifUSkZU9kCJuZCC70S', '2024-09-04 16:35:27', '2024-09-04 16:35:27');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tab` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `web` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `phone`, `tab`, `web`, `link`, `createdAt`, `updatedAt`) VALUES
(40, 'https://example.com/phone.jpg', 'https://example.com/tab.jpg', 'https://example.com/web.jpg', '[]', '2025-03-20 11:12:55', '2025-07-04 05:52:02'),
(41, 'https://bignlean-api.synoventum.site//uploads/1750943970291.jpg', 'https://bignlean-api.synoventum.site//uploads/1750943975771.jpg', 'https://bignlean-api.synoventum.site//uploads/1750943978598.jpg', '', '2025-06-26 13:19:39', '2025-06-26 13:19:39'),
(43, 'https://bignlean-api.synoventum.site//uploads/1751607127742.jpg', 'https://bignlean-api.synoventum.site//uploads/1751607131151.jpg', 'https://bignlean-api.synoventum.site//uploads/1751607134346.jpg', '[\"test\",\"test1\",\"test3\"]', '2025-07-04 05:32:22', '2025-07-04 05:57:11');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int NOT NULL,
  `images` json NOT NULL,
  `heading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bodyText` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tags` json NOT NULL,
  `duration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `images`, `heading`, `bodyText`, `tags`, `duration`, `category`, `createdAt`, `updatedAt`) VALUES
(5, '[\"https://bignlean-api.synoventum.site//uploads/1721210231623.png\", \"https://bignlean-api.synoventum.site//uploads/1721210277487.png\", \"https://bignlean-api.synoventum.site//uploads/1721210279717.png\"]', 'Here’s what you need to know about diet plans', 'Are you looking to improve your health\nand overall wellbeing, following a\nhealthy diet plan is a great place to start.\n\nA balanced diet can provide your body\nwith the nutrients it needs to function\noptimally, while reducing your risk of\ndeveloping chronic diseases such as heart\ndisease, diabetes, and cancer. Here are\nsome tips for creating a healthy and\nsustainable diet plan:\n\nChoose nutrient-dense foods: Nutrient-dense foods are those that provide a high amount of nutrients relative to their calorie content. Examples of nutrient-dense foods include fruits, vegetables, whole grains, lean proteins, and healthy fats.\nLimit processed foods: Processed foods are often high in sugar, salt, and unhealthy fats, and provide little nutritional value. Try to limit your intake of processed foods as much as possible and opt for whole, natural foods instead.\nFocus on balance: Aim to include a variety of different foods in your diet, including fruits, vegetables, whole grains, lean proteins, and healthy fats. Avoid extreme diets or cutting out entire food groups unless medically necessary.\nPay attention to portion sizes: Even healthy foods can lead to weight gain if consumed in excess. Pay attention to portion sizes and aim to eat until you\'re satisfied, not stuffed.\nStay hydrated: Drinking enough water is crucial for optimal health. Aim to drink at least 8 glasses of water per day, and more if you\'re physically active or live in a hot climate.\nBe mindful of your eating habits: Eating mindfully can help you tune into your body\'s hunger and fullness cues, as well as help you make healthier food choices. Try to eat without distractions, chew your food thoroughly, and pay attention to how you feel while eating.', '[\"Food\"]', '6', 'popular', '2024-07-17 09:59:03', '2024-07-17 09:59:03'),
(6, '[\"https://bignlean-api.synoventum.site//uploads/1747488478961.jpeg\"]', 'Testing blog', 'Abhishek Bajaj is an Indian actor known for starring in the film Student of the Year 2 in the year 2019 and playing the role of Sandy in a film titled Chandigarh Kare Aashiqui.\nAbhishek Bajaj is very passionate to fitness industry and toward  his healthy lifestyle \n\nMuskan Varshney A beautiful actors known for her Crime Patrol Actor, Recently she Did Bollywood movie and soon she will be seen in Many bollywood upcoming projects. she is the heartbeat of many young fans. she has a wonderful social media engage platform too. Muskan shows her trust and support on Bignlean.com \n\n\nAashi Sharma - She is a great actor, Model & Social Media Influencer. a great youtuber and known for her content creator. she has the great talent. a beautiful model trusted on Bignlean.com\n\n\nAnuja Shinde - known for her dashing modeling career, she played great roles with Legend Mr. Amitab Bachhan & Many Actors she is also shows Topper ', '[\"Fitness\"]', '10', 'Actor', '2025-05-17 13:29:38', '2025-05-17 13:29:38');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `banner` json NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `image`, `banner`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(44, 'https://bignlean-api.synoventum.site//uploads/1742463936815.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468652533.png\"]', 'Isopure', 'Isopure® provides everyday nutrition made with minimal ingredients, and only those you trust. From exploring new recipes with your family in the kitchen to solitary hikes on remote trails, we go where you go so you can experience life to the fullest.\n\n\nWe demonstrate our commitment to purity, simplicity, and quality through our ingredients. That’s why we use 100% whey protein isolate in formulas with reduced carbohydrates, sugar, and fat. So, you can get out there and do amazing things – all while you inspire others to do the same.\n', '2025-03-20 09:46:16', '2025-03-20 12:23:24'),
(45, 'https://bignlean-api.synoventum.site//uploads/1742464005861.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468644304.png\"]', 'Allmax Nutrition ', 'High Quality Products Provide the Best Results.\nOur customers and clients worldwide have had a healthy obsession with ALLMAX for over 15 years because they get results. They understand the importance of following a solid diet and training hard in the gym in combination with utilizing our high-quality supplements. We understand that our customers demand more, which is why we consistently supply cutting-edge supplements to help them achieve their goals as quickly and efficiently as possible.\n', '2025-03-20 09:46:59', '2025-03-20 12:16:53'),
(46, 'https://bignlean-api.synoventum.site//uploads/1742464033075.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468634985.png\"]', 'Cellucor', 'Cellucor is the leader in sports nutrition. For 20 years, we’ve obsessed over results — your results. Every Cellucor product is engineered with performance in mind to maximize your potential. Made with clinically studied ingredients and recognized by elite athletes and top performers around the world, Cellucor is your partner to evolve into your 2.0.\n', '2025-03-20 09:47:23', '2025-03-20 12:22:55'),
(47, 'https://bignlean-api.synoventum.site//uploads/1742464055820.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468625283.png\"]', 'Condemned Labs', 'Established in 2016, Condemned Labz was created to define the battle of fitness enthusiasts. We’ve become masochists; gaining pleasure from pain. Reps for results are what drives us deeper, fuels our fire and cements our love for the sport. This is where the obsession of striving for the perfect physique is conceived. Condemned Labz: We are sentenced to greatness!\n', '2025-03-20 09:47:48', '2025-03-20 12:16:25'),
(48, 'https://bignlean-api.synoventum.site//uploads/1742464084994.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468611185.png\"]', 'Dymatize ', 'When you choose Dymatize, you’re choosing quality. We are a market leader for good reason: we provide the best possible products to meet and exceed your fitness goals. You’re choosing purity. When you see the Dymatize label, you know you’re getting clean, safe products that have passed rigorous testing. You’re choosing innovation. We go above and beyond to develop the best overall experience. Repeatedly recognized as one of the best — and best tasting — product lines on the market, we never stop pushing ourselves, because you never stop pushing yourself.\n\n\nA market leader worldwide since 1994, we use high-quality premium proteins to not only help athletes reach their goals– but crush them. We specialize in great tasting, quality nutrition, with a focus on muscle strength and recovery. To achieve that, our line of scientifically proven products have gone through rigorous trials, including being put to the test by elite athletes. Whatever your fitness goals, we’re here to support you, every step of the way. ', '2025-03-20 09:48:13', '2025-03-20 12:22:32'),
(49, 'https://bignlean-api.synoventum.site//uploads/1742464104412.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468599750.png\"]', 'GAT Sports ', '20 YEARS OF DEDICATION TO YOUR SUCCESS\nGAT Sport is here to help you achieve all your fitness and training goals. Think of GAT as a trusted training partner with truly legendary product recommendations that help push athletes like you to attain your very best results. We are here to supplement your efforts in the weight room, the board room, and everywhere life takes you.\n', '2025-03-20 09:48:34', '2025-03-20 12:15:35'),
(50, 'https://bignlean-api.synoventum.site//uploads/1742464126463.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468584375.png\"]', 'GNC', 'GNC is a leading global specialty retailer of health and wellness products that takes pride to be the world\'s largest company of its kind devoted exclusively to help its customers improve the quality of their lives. Headquartered in Pittsburgh, US, and with over 9,000 locations in approximately 50 countries, GNC sets the standard in the nutritional supplement industry by demanding truth in labeling, Ingredient safety and Product potency, all while remaining on the cutting-edge of nutritional science.\nFrom scientific research and new product discovery to the manufacturing and packaging processes, GNC is highly regarded for its rigorous approach to ensuring quality world over. Built on 80 years of superior product quality and innovation, GNC assists its consumers to bridge the gap of inadequate nutrition intakes with the assistance of health and nourishment products. The assortment of GNC’s range includes protein, performance supplements, weight management supplements, vitamins, herbs and greens and wellness supplements.\n', '2025-03-20 09:48:53', '2025-03-20 12:21:35'),
(51, 'https://bignlean-api.synoventum.site//uploads/1742464145087.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468568878.png\"]', 'Insane Labz', 'Located in the rolling hills of the Ozark Mountains is a manufacturing and distribution facility we call \'“The Asylum”…a place where our brand mascot “The Mad Chemist” creates new products and flavors, oversees production and provides unparalleled customer service. Insane Labz’® reputation as being “crazy” about pre-workouts is well earned - and understood after just one (or 1/2) serving of our flagship pre-workout, Psychotic® - but we’re no one trick pony. Insane Labz® is at the forefront of innovation in the sports nutrition industry, most recently being first to market with a hemp-based pre-workout, Strain®, and the only collaboratively partnered product line based on a comic book & movie character, the Insane Labz® Hellboy line.  \n', '2025-03-20 09:49:18', '2025-03-20 12:15:00'),
(52, 'https://bignlean-api.synoventum.site//uploads/1742464169986.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468556590.png\"]', 'International Protein ', 'Established in 2001, International Protein set-out to manufacture the best-tasting proteins that money can buy while remaining manufacturers of clean, Australian made supplements, designed for high-performance athletes. The brand now includes fat burners, pre-workouts, creatines, mass gainers, glutamines, amino supplements, and of course, both our plant-based and dairy proteins. Proudly Australian made with quality ingredients on the Gold Coast of Australia. We ship to most countries worldwide.\n', '2025-03-20 09:49:49', '2025-03-20 12:20:55'),
(53, 'https://bignlean-api.synoventum.site//uploads/1742464213939.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468539314.png\"]', 'Kaged', 'Marketing nowadays is a damn science. \"Health\" companies have used every psychological trick in the book to get you to click their \"buy now\" button. You’ve been fooled by Instagram influencers with unrealistic physiques.\n\nYou shouldn\'t have to become a sports nutrition scientist to understand supplements. You deserve to trust a company that doesn\'t cut corners; one that sources the highest quality ingredients, and creates products that actually work to support your goals.\n\n', '2025-03-20 09:50:21', '2025-03-20 12:14:34'),
(54, 'https://bignlean-api.synoventum.site//uploads/1742464232429.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468813034.PNG\"]', 'Muscleblaze', 'MuscleBlaze® was founded in 2012 with the idea of providing India with sports nutrition supplements that are specifically focused on Indian customer needs and listens to their sentiments day in day out.\nMuscleBlaze® has quickly risen as consumer’s favorite brand with industry-first concept introductions like authenticity, protein test certificates, scoop on top, clinically researched products, etc. \n', '2025-03-20 09:50:43', '2025-03-20 12:20:32'),
(55, 'https://bignlean-api.synoventum.site//uploads/1742464253985.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468507842.png\"]', 'Muscletech', 'MuscleTech™ was born out of an obsession to redefine the limits of science and human potential. With our commitment to research, development and innovation, we’ve been globally recognized as one of the leading sports nutrition brands in the industry and continue to be one of America’s elite names for redefining performance through cutting-edge products and high-quality ingredients. Backed by America’s #1 selling sports supplement company, and with distribution in over 140 countries, MuscleTech™ has emerged as one of the most recognized sports nutrition brands worldwide.\n', '2025-03-20 09:51:03', '2025-03-20 12:13:56'),
(56, 'https://bignlean-api.synoventum.site//uploads/1742464276478.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468494730.png\"]', 'Mutant Nation', 'MUTANT® — Leave Humanity Behind!\nThe dedicated. The hardcore. At MUTANT, we know where our loyalty lies. You\'re not interested in average, and you certainly don\'t care about fitting in with the crowd. MUTANT understands, and that\'s why we bring you top-quality products made with the best ingredients in the world and manufactured in our own federally licensed facility. Amazing formulas like our legendary MUTANT MASS, the multi-award-winning original #1 big bag muscle mass gainer. Or MUTANT MADNESS, the ultimate pre-workout experience. Or the best gourmet whey isolate of all time, MUTANT ISO SURGE!\nWe make these formulas, along with the highest quality video content in the business, because we live for this! The hard and heavy lifting, the nasty workouts, the grind of the day to day. This lifestyle isn\'t for everyone, and that\'s just the way we like it! MUTANT — Leave Humanity Behind.\n', '2025-03-20 09:51:27', '2025-03-20 12:20:05'),
(57, 'https://bignlean-api.synoventum.site//uploads/1742464324286.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468470647.png\"]', 'My Protein ', 'In 2011, Myprotein found its home within the THG family, marking the start of an exciting new chapter. By 2016, we proudly claimed the title of the world\'s leading online sports nutrition brand, bringing you unmatched quality protein, vitamins, and essential supplements conveniently delivered right to your doorstep.\n', '2025-03-20 09:52:15', '2025-03-20 12:13:25'),
(59, 'https://bignlean-api.synoventum.site//uploads/1742464371953.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468455376.png\"]', 'PhD Nutrition', 'At PhD, we believe in maximising the things you can do, instead of punishing yourself for what you can’t. Whether it’s an extra rep or a recovery day, we know that small choices drive big impact. That’s why we’ve spent years optimising our range, scrutinising the science behind every ingredient, giving you products that work smarter and taste better, to help you get more out of each day. So from your morning boost to your evening refuel, we make it easier for you to upgrade your everyday. \n', '2025-03-20 09:53:03', '2025-03-20 12:19:33'),
(60, 'https://bignlean-api.synoventum.site//uploads/1742464407632.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468441326.png\"]', 'ProSupps', 'At ProSupps, our mission is to empower individuals at every stage of their fitness journey. We deliver supplements that work as hard as you do, giving you the edge to push your limits and master your goals. It’s time to show up, put in the work, and unleash your full potential.  From day one, ProSupps was built by fitness enthusiasts, for fitness enthusiasts. We’re not just creators; we’re warriors in the trenches, living the grind alongside you. Born from a tight-knit crew of friends, our bond was forged in sweat, dedication, and an unyielding pursuit of greatness. We’re here to extend that brotherhood to you, welcoming you into a community where everyone has each other’s back. At ProSupps, you\'re not just a customer—you’re part of our family. We want you to feel the unity, the shared victories, and the relentless drive that fuels us. Together, we’re unstoppable.', '2025-03-20 09:53:36', '2025-03-20 12:13:01'),
(61, 'https://bignlean-api.synoventum.site//uploads/1742464435230.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468824037.PNG\"]', 'Redcon1', 'We create formulas and products that redefine the gold standard in sports nutrition without considering margins or profits. Above all, we’re proud of the products we make.\n\n2 TIME VITAMIN SHOPPE BRAND OF THE YEAR, 2022 & 2019  VITAMIN SHOPPE PROTEIN BAR OF THE YEAR, 2022  VITAMIN SHOPPE PREWORKOUT OF THE YEAR, 2022  2 TIME STACKED 3D BRAND OF THE YEAR\n\n', '2025-03-20 09:54:08', '2025-03-20 12:19:12'),
(62, 'https://bignlean-api.synoventum.site//uploads/1742464465879.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468333769.png\"]', 'Ronnie Coleman', 'Ronnie Coleman Signature Series® is owned and operated by 8 time Mr. Olympia champion Ronnie Coleman and his team. We are not an extension of nor are we leveraged by an already established brand or manufacturer. Our team is comprised of industry veterans who embrace the health and fitness lifestyle on a daily basis allowing us to better understand our customer’s needs. We built this company from the ground up through grass roots marketing efforts including a grueling travel schedule for Ronnie himself. This type of unique commitment to his fans has afforded us the opportunity to have a rare and intimate relationship with our customers all over the globe. We embody this commitment in our products by using only the most effective, proven and safe ingredients on the market as well as striving to be at the forefront of new product innovation.\n', '2025-03-20 09:54:37', '2025-03-20 11:42:24'),
(63, 'https://bignlean-api.synoventum.site//uploads/1742464490848.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468794333.PNG\"]', 'Rule1', 'You’ll see the words “Better Input = Better Output” all over our products. It means we’re relentlessly pursuing better input to improve the performance of our output. We closely engage with our customers, athletes, retail partners and material suppliers to stay ahead of the latest trends and better understand the needs of our end-users. But after all the input has been collected, it’s really simple…we will never put a product on our site - or on a shelf - that we wouldn’t put in our own gym bag. \n', '2025-03-20 09:54:57', '2025-03-20 12:18:24'),
(64, 'https://bignlean-api.synoventum.site//uploads/1742464508633.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468201096.png\"]', 'SAN Nutrition ', 'SAN Nutrition isn’t just a brand—it’s a legacy forged in the crucible of science, sweat, and unwavering dedication. Let me take you back to the genesis of our story—a tale that began with a young man’s hunger for knowledge and a heart pulsing with the rhythm of iron plates.', '2025-03-20 09:55:24', '2025-03-20 11:41:33'),
(65, 'https://bignlean-api.synoventum.site//uploads/1742464543023.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468187027.png\"]', 'Optimum Nutrition ', 'Optimum Nutrition, Inc. (ON) is part of the Glanbia global nutrition group and has been setting the Gold Standard in sports nutrition for more than 35 years - helping performance focused athletes achieve their goals.\n\nCOMPANY OWNED & OPERATED MANUFACTURING\nWith state-of-the-art production facilities in the US, UK and India, Optimum Nutrition is one of the few sports nutrition companies to manufacture and offer products in every product category. From the very beginning in 1986, Optimum Nutrition has always taken a hands-on approach to maintaining the very highest standards of quality.\n', '2025-03-20 09:55:55', '2025-03-20 12:17:53'),
(66, 'https://bignlean-api.synoventum.site//uploads/1742464570445.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468170898.png\"]', 'Universal Nutrition ', 'Our roots go back to 1977 and a small manufacturing factory in Linden, New Jersey. Started by a hard-working and passionate family in that year, Universal is still a privately held company today – still owned and operated by that same family. Our values have remained the same, values based on “old school” ideals where one’s word and a handshake meant something.', '2025-03-20 09:56:22', '2025-03-20 11:41:02'),
(67, 'https://bignlean-api.synoventum.site//uploads/1742464593352.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468155493.png\"]', 'Unmatched Supps', 'In a crowded and often stagnant supplement industry, it can be hard to find a brand that stands out. Unmatched is here to change that. Founded by two industry leaders, Kris Gethin and Doug Miller, Unmatched sets a new standard for excellence, ethics, transparency, and innovation.\nDoug Miller is a two-time Natural World Bodybuilding Champion, and Kris Gethin has been voted the Worlds #1 Trainer on three occasions, and they have surrounded themselves with the best team they could find because we believe that you deserve the best possible support on your journey.\n', '2025-03-20 09:56:41', '2025-03-20 12:17:29'),
(68, 'https://bignlean-api.synoventum.site//uploads/1742464613048.png', '[\"https://bignlean-api.synoventum.site//uploads/1742468137193.png\"]', 'Scivation Xtend', 'On everyone\'s fitness journey there comes a moment when you need to decide. You\'re tired from work, you\'ve got chores to do, errands to run, friends waiting. But no matter the demands of life, your goals don\'t go away. Maybe it\'s a marathon, maybe it\'s dropping a few pounds, maybe it\'s just being healthy enough to play with the kids. Those moments, those decisions, they\'re yours to own.\nFor 15 years, Cellucor\'s mission has been to support personal journeys of improvement and evolution. Evolving right with you, Cellucor has dedicated itself to becoming the best sports nutrition brand in the world, delivering the most-effective, best-tasting and highest-quality products...for you.\n', '2025-03-20 09:57:06', '2025-03-20 11:40:05'),
(70, 'https://bignlean-api.synoventum.site//uploads/1751021404133.png', '[\"https://bignlean-api.synoventum.site//uploads/1751021416817.png\", \"https://bignlean-api.synoventum.site//uploads/1751021431605.png\"]', 'testing by parth', 'info testing', '2025-06-27 10:50:46', '2025-06-27 10:50:46');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `product` int NOT NULL,
  `varientId` int DEFAULT NULL,
  `flavour` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `qty` int NOT NULL,
  `mrp` float DEFAULT NULL,
  `sellingPrice` float DEFAULT NULL,
  `premiumPrice` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user`, `product`, `varientId`, `flavour`, `qty`, `mrp`, `sellingPrice`, `premiumPrice`, `createdAt`, `updatedAt`) VALUES
(4, 4, 4, 1, 'Test', 4, 20, 20, 20, '2024-07-19 14:08:40', '2025-06-19 08:42:37'),
(16, 5, 12, 1, 'Rich Chocolate ', 3, 10999, 7000, 6500, '2024-08-13 10:10:46', '2025-03-08 07:12:46'),
(18, 7, 17, 1, 'Unflavoured', 5, 750, 500, 450, '2024-08-13 11:30:29', '2024-08-24 14:55:07'),
(22, 1, 17, 1, 'Unflavoured', 21, 750, 500, 450, '2024-08-14 07:01:56', '2025-06-19 07:30:32'),
(25, 3, 3, 1, 'Test', 1, 10, 10, 10, '2024-08-14 07:38:51', '2024-08-14 07:38:51'),
(27, 2, 17, 1, 'Unflavoured', 2, 750, 500, 450, '2024-08-14 08:01:00', '2024-09-18 06:16:20'),
(28, 3, 17, 1, 'Unflavoured', 1, 750, 500, 450, '2024-08-14 09:55:47', '2024-08-14 09:55:47'),
(30, 10, 17, 1, 'Unflavoured', 1, 750, 500, 450, '2024-08-14 12:45:37', '2024-08-14 12:45:37'),
(31, 10, 13, 1, 'Flavor', 1, 10, 10, 10, '2024-08-14 12:50:53', '2024-08-14 12:50:53'),
(32, 8, 13, 1, 'Flavor', 4, 10, 10, 10, '2024-08-16 11:03:09', '2024-08-16 11:03:18'),
(33, 8, 12, 1, 'Rich Chocolate ', 5, 10999, 7000, 6500, '2024-08-16 11:03:33', '2024-08-16 11:05:41'),
(34, 2, 13, 1, 'Flavor', 1, 10, 10, 10, '2024-08-22 11:07:02', '2024-08-22 11:07:02'),
(35, 1, 4, 1, 'Test', 10, 20, 20, 20, '2024-08-24 15:41:43', '2024-09-10 12:15:02'),
(37, 1, 3, 1, 'Test', 4, 10, 10, 10, '2024-09-05 12:34:56', '2024-09-05 12:35:07'),
(38, 1, 19, 1, 'Gourmet Chocolate', 1, 16999, 10800, 10400, '2024-09-18 06:34:14', '2024-09-18 06:34:14'),
(39, 1, 24, 1, 'PinknStrar', 5, 5999, 4000, 3800, '2025-03-03 06:49:19', '2025-03-18 14:11:25'),
(40, 1, 25, 1, 'Mango', 2, 7999, 5000, 4800, '2025-03-18 16:42:59', '2025-03-19 07:52:05'),
(41, 1, 12, 1, 'Rich Chocolate ', 5, 10999, 7000, 6500, '2025-03-19 03:50:22', '2025-05-30 23:04:33'),
(42, 1, 13, 1, 'Flavor', 6, 10, 10, 10, '2025-03-22 06:06:10', '2025-06-19 07:28:11'),
(43, 1, 27, 1, 'Strawberry kiwi', 3, 8999, 3500, 3200, '2025-04-08 07:11:22', '2025-06-18 17:05:34'),
(44, 18, 13, 1, 'Flavor', 1, 10, 10, 10, '2025-04-29 06:44:12', '2025-04-29 06:44:12'),
(45, 21, 25, 1, 'Mango', 4, 7999, 5000, 4800, '2025-04-29 09:02:44', '2025-04-29 10:57:09'),
(75, 1, 26, 1, 'Rich Chocolate', 2, 7999, 6799, 6500, '2025-05-13 19:51:39', '2025-05-13 19:51:39'),
(83, 4, 17, 1, 'Unflavoured', 11, 750, 500, 450, '2025-06-19 08:42:18', '2025-06-19 08:43:19'),
(93, 12, 17, 1, 'Unflavoured', 1, 750, 500, 450, '2025-06-19 10:00:20', '2025-06-19 10:00:20'),
(94, 12, 13, 1, 'Flavor', 1, 10, 10, 10, '2025-06-19 10:01:11', '2025-06-19 10:01:11'),
(95, 65, 17, 1, 'Unflavoured', 6, 750, 500, 450, '2025-06-19 10:14:30', '2025-06-20 05:49:33');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `imageOn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `imageOff` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `brandId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `imageOn`, `imageOff`, `brandId`, `createdAt`, `updatedAt`) VALUES
(2, 'test', 'https://bignlean-api.synoventum.site//uploads/1720694178387.png', 'https://bignlean-api.synoventum.site//uploads/1720694180339.jpg', 1, '2024-07-11 10:36:21', '2024-07-11 10:36:21'),
(4, 'test', 'https://bignlean-api.synoventum.site//uploads/1720852851257.jpg', 'https://bignlean-api.synoventum.site//uploads/1720852853751.webp', 2, '2024-07-13 06:40:55', '2024-07-13 06:40:55'),
(5, 'Test Category', 'https://bignlean-api.synoventum.site//uploads/1720934817947.png', 'https://bignlean-api.synoventum.site//uploads/1720934821422.jpg', 4, '2024-07-14 05:27:12', '2024-07-14 05:27:12'),
(6, 'Test Category 2', 'https://bignlean-api.synoventum.site//uploads/1720934836267.jpg', 'https://bignlean-api.synoventum.site//uploads/1720934839596.png', 4, '2024-07-14 05:27:22', '2024-07-14 05:27:22'),
(7, 'Test Category', 'https://bignlean-api.synoventum.site//uploads/1721043731053.jpeg', 'https://bignlean-api.synoventum.site//uploads/1721043734895.png', 3, '2024-07-15 11:42:21', '2024-07-15 11:42:21'),
(8, 'Protein Powders', 'https://bignlean-api.synoventum.site//uploads/1721112814046.png', 'https://bignlean-api.synoventum.site//uploads/1721112817451.png', 10, '2024-07-16 06:53:43', '2024-07-16 06:53:43'),
(9, 'Whey Protein ', 'https://bignlean-api.synoventum.site//uploads/1721115156925.webp', 'https://bignlean-api.synoventum.site//uploads/1721115163473.png', 8, '2024-07-16 07:33:05', '2024-07-16 07:33:05'),
(10, 'Protein Powders', 'https://bignlean-api.synoventum.site//uploads/1721140448900.png', 'https://bignlean-api.synoventum.site//uploads/1721140451657.png', 11, '2024-07-16 14:34:15', '2024-07-16 14:34:15'),
(11, 'Protein Powders', 'https://bignlean-api.synoventum.site//uploads/1721995388148.png', 'https://bignlean-api.synoventum.site//uploads/1721995392539.png', 12, '2024-07-26 12:03:21', '2024-07-26 12:03:21'),
(12, 'Protein Powders', 'https://bignlean-api.synoventum.site//uploads/1722064033771.png', 'https://bignlean-api.synoventum.site//uploads/1722064035780.png', 13, '2024-07-27 07:07:19', '2024-07-27 07:07:19'),
(13, 'test cat', 'https://bignlean-api.synoventum.site//uploads/1722067399452.png', 'https://bignlean-api.synoventum.site//uploads/1722067403092.jpg', 15, '2024-07-27 08:03:26', '2024-07-27 08:03:26'),
(14, 'Creatine', 'https://bignlean-api.synoventum.site//uploads/1722067819047.png', 'https://bignlean-api.synoventum.site//uploads/1722067822771.png', 13, '2024-07-27 08:10:24', '2024-07-27 08:10:24'),
(15, 'Protein Powders', 'https://bignlean-api.synoventum.site//uploads/1723805266992.png', 'https://bignlean-api.synoventum.site//uploads/1723805272033.png', 3, '2024-08-16 10:47:55', '2024-08-16 10:47:55'),
(16, 'Whey Isolate', 'https://bignlean-api.synoventum.site//uploads/1725870167605.png', 'https://bignlean-api.synoventum.site//uploads/1725870183579.png', 5, '2024-09-09 08:23:10', '2024-09-09 08:23:10'),
(17, 'Elite Whey', 'https://bignlean-api.synoventum.site//uploads/1725963071508.jpg', 'https://bignlean-api.synoventum.site//uploads/1725963075708.jpg', 5, '2024-09-10 10:11:16', '2024-09-10 10:11:16'),
(18, 'BCAA', 'https://bignlean-api.synoventum.site//uploads/1726038474186.jpg', 'https://bignlean-api.synoventum.site//uploads/1726038512470.jpg', 5, '2024-09-11 07:08:33', '2024-09-11 07:08:33'),
(19, 'Isolate Protein', 'https://bignlean-api.synoventum.site//uploads/1726408304854.webp', 'https://bignlean-api.synoventum.site//uploads/1726408328842.webp', 35, '2024-09-15 13:52:29', '2024-09-15 13:52:29'),
(20, 'Test saree', 'https://ray.shellcode.cloud/uploads/1727782977710.jpg', 'https://ray.shellcode.cloud/uploads/1727782990707.jpg', 36, '2024-10-01 11:43:11', '2024-10-01 11:43:11'),
(21, 'Whey Protein ', 'https://bignlean-api.synoventum.site//uploads/1738353955493.jpeg', 'https://bignlean-api.synoventum.site//uploads/1738353983445.jpeg', 39, '2025-01-31 20:06:25', '2025-01-31 20:06:25'),
(22, 'Unmatched', 'https://bignlean-api.synoventum.site//uploads/1741531421226.webp', 'https://bignlean-api.synoventum.site//uploads/1741531430617.webp', 39, '2025-03-09 14:44:02', '2025-03-09 14:44:02'),
(23, 'Whey', 'https://bignlean-api.synoventum.site//uploads/1742315903031.webp', 'https://bignlean-api.synoventum.site//uploads/1742315909842.webp', 40, '2025-03-18 16:38:34', '2025-03-18 16:38:34'),
(26, 'Protein Powders', 'https://bignlean-api.synoventum.site//uploads/1742463264000.png', 'https://bignlean-api.synoventum.site//uploads/1742463270258.png', 43, '2025-03-20 09:34:47', '2025-03-20 09:34:47'),
(27, 'Mass Gainers', 'https://bignlean-api.synoventum.site//uploads/1742463300134.png', 'https://bignlean-api.synoventum.site//uploads/1742463310074.png', 43, '2025-03-20 09:35:19', '2025-03-20 09:35:19'),
(28, 'BCAAs Intra-Workout ', 'https://bignlean-api.synoventum.site//uploads/1742463331560.png', 'https://bignlean-api.synoventum.site//uploads/1742463336842.png', 43, '2025-03-20 09:36:00', '2025-03-20 09:36:00'),
(29, 'Pre-Post Workout ', 'https://bignlean-api.synoventum.site//uploads/1742463392391.png', 'https://bignlean-api.synoventum.site//uploads/1742463396577.png', 43, '2025-03-20 09:36:55', '2025-03-20 09:36:55'),
(30, 'Health & Wellness ', 'https://bignlean-api.synoventum.site//uploads/1742463429154.png', 'https://bignlean-api.synoventum.site//uploads/1742463437981.png', 43, '2025-03-20 09:37:30', '2025-03-20 09:37:30'),
(31, 'Workout Essentials ', 'https://bignlean-api.synoventum.site//uploads/1742463457938.png', 'https://bignlean-api.synoventum.site//uploads/1742463463193.png', 43, '2025-03-20 09:37:55', '2025-03-20 09:37:55'),
(32, 'Fitness ', 'https://bignlean-api.synoventum.site//uploads/1742463485404.png', 'https://bignlean-api.synoventum.site//uploads/1742463489163.png', 43, '2025-03-20 09:38:14', '2025-03-20 09:38:14'),
(33, 'Intra Workout ', 'https://bignlean-api.synoventum.site//uploads/1742464711774.png', 'https://bignlean-api.synoventum.site//uploads/1742464723937.png', 68, '2025-03-20 09:58:58', '2025-03-20 09:58:58'),
(38, 'Unmatched', 'https://bignlean-api.synoventum.site//uploads/1747489605143.png', 'https://bignlean-api.synoventum.site//uploads/1747489623014.jpeg', 67, '2025-05-17 13:47:12', '2025-05-17 13:47:12'),
(39, 'Collagen', 'https://bignlean-api.synoventum.site//uploads/1751004519638.png', 'https://bignlean-api.synoventum.site//uploads/1751004570225.jpeg', 63, '2025-06-27 06:09:34', '2025-06-27 06:09:34'),
(40, 'testing by parth', 'https://bignlean-api.synoventum.site//uploads/1751021478418.png', 'https://bignlean-api.synoventum.site//uploads/1751021490657.png', 70, '2025-06-27 10:51:53', '2025-06-27 10:51:53');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int NOT NULL,
  `brandName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comboCategories`
--

CREATE TABLE `comboCategories` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comboCategories`
--

INSERT INTO `comboCategories` (`id`, `name`, `image`, `createdAt`, `updatedAt`) VALUES
(5, 'test', 'https://bignlean-api.synoventum.site//uploads/1720854083279.webp', '2024-07-13 07:01:24', '2024-07-13 07:01:24'),
(6, 'test', 'https://bignlean-api.synoventum.site//uploads/1720940662677.jpg', '2024-07-14 07:04:23', '2024-07-14 07:04:23'),
(7, 'combo name', 'https://bignlean-api.synoventum.site//uploads/1721044250492.jpeg', '2024-07-15 11:50:58', '2024-07-15 11:50:58');

-- --------------------------------------------------------

--
-- Table structure for table `combos`
--

CREATE TABLE `combos` (
  `id` int NOT NULL,
  `catId` int NOT NULL,
  `products` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `combos`
--

INSERT INTO `combos` (`id`, `catId`, `products`, `createdAt`, `updatedAt`) VALUES
(1, 6, '[3, 1, 4]', '2024-07-14 07:56:00', '2024-07-14 08:05:14'),
(2, 7, '[4, 3]', '2024-07-15 11:51:10', '2024-07-15 11:51:10'),
(3, 8, '[34, 27]', '2025-06-27 06:05:41', '2025-06-27 06:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `comboSubCategories`
--

CREATE TABLE `comboSubCategories` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `catId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contactLeads`
--

CREATE TABLE `contactLeads` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contactLeads`
--

INSERT INTO `contactLeads` (`id`, `name`, `phone`, `email`, `message`, `createdAt`, `updatedAt`) VALUES
(1, 'Varun Kubal', '7738540986', 'varun.Kubal@gmail.com', '.j,fxcyjgvvghu.icgḥmjhcmxyfchvkhgxh ytfv', '2024-08-14 09:25:37', '2024-08-14 09:25:37');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int NOT NULL,
  `coupon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `qty` int NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `coupon`, `discount`, `qty`, `category`, `createdAt`, `updatedAt`) VALUES
(20, 'SUMMER25', 25.00, 2, 'Percentage-wise', '2025-05-03 04:52:41', '2025-05-03 04:52:41');

-- --------------------------------------------------------

--
-- Table structure for table `deals`
--

CREATE TABLE `deals` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `products` json DEFAULT NULL,
  `isForLimitedTime` tinyint(1) NOT NULL DEFAULT '0',
  `expireDateTime` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deals`
--

INSERT INTO `deals` (`id`, `name`, `type`, `products`, `isForLimitedTime`, `expireDateTime`, `createdAt`, `updatedAt`) VALUES
(38, 'Pick of the Day', 'Single', '[17, 13, 12]', 0, NULL, '2024-07-27 12:06:27', '2024-07-27 12:06:27'),
(39, 'Buy 2 @ 15% Off', 'Single', '[17, 13, 12]', 0, NULL, '2024-07-27 12:06:45', '2024-07-27 12:06:45'),
(40, 'Popular Products', 'Single', '[12, 13, 17]', 0, NULL, '2024-07-27 12:06:59', '2024-07-27 12:11:42'),
(41, 'Price slash alert', 'Single', '[17, 13, 12, 3]', 1, '2024-08-14 17:37:00', '2024-07-27 12:07:28', '2024-07-27 12:11:47');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int NOT NULL,
  `heading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `question` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `heading`, `question`, `answer`, `createdAt`, `updatedAt`) VALUES
(14, 'General Questions', 'What products do you offer on your platform?', 'We offer a wide range of health supplements, sports equipment, and apparel catering to fitness enthusiasts, athletes, and health-conscious individuals.', '2024-09-11 17:59:57', '2024-09-11 17:59:57'),
(15, 'General Questions', 'How can I place an order?', 'You can place an order through our website or mobile app. Simply browse the products, add them to your cart, and proceed to checkout.', '2024-09-11 18:00:46', '2024-09-11 18:00:46'),
(16, 'General Questions', 'What payment methods do you accept?', 'We accept various payment methods such as credit/debit cards, PayPal, Razorpay, Paytm, Simpl, Cred & other secure online payment gateways.', '2024-09-11 18:01:42', '2024-09-11 18:01:42'),
(17, 'General Questions', 'Do you ship internationally?', 'Yes, we offer international shipping to several countries. Shipping details can be found during the checkout process. International shipping is chargeable. ', '2024-09-11 18:03:24', '2024-09-11 18:03:24'),
(18, 'General Questions', ' What is your return/exchange policy?', 'We have a hassle-free return/exchange policy within a certain timeframe. Details regarding returns and exchanges can be found on our website or app.', '2024-09-11 18:03:53', '2024-09-11 18:03:53'),
(19, 'Coupons & Bignlean Coins', 'What is a promo coupon?', 'To give you the best deals around, we occasionally issue promo coupons. It is a simple code which can be applied to get discounts.', '2024-09-11 18:05:18', '2024-09-11 18:05:18'),
(20, 'Coupons & Bignlean Coins', 'Can I club two coupons in one purchase?', 'No two coupons can be applied at the same time. In general our promotions cannot be used in conjunction with any other offer.', '2024-09-11 18:06:20', '2024-09-11 18:06:20'),
(21, 'Coupons & Bignlean Coins', 'How do I use a promo coupon?', 'Add products you want to shop in your cart. Once you are on the cart page, you will see the list of offers available for you which you can apply on your cart. Also you can enter the coupon code on this page. You would have to be logged in to be able to use any offers or coupons.', '2024-09-11 18:08:09', '2024-09-11 18:08:09'),
(22, 'Coupons & Bignlean Coins', 'What is the validity period of Bignlean cash points?', 'The validity period of Bignlean cash is generally 90 days from the date of issue. Please check your Bignlean Coins email for exact date.', '2024-09-11 18:09:34', '2024-09-11 18:09:34'),
(23, 'Health Information Disclaimer', 'Health Disclaimer ', 'The information provided on this website is for educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. You should not use the information on this site for diagnosing or treating any health problem or disease. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. The products and information mentioned on this website are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Any statements regarding dietary supplements or health-related products have not been evaluated by the Food and Drug Administration (FDA) and are not intended to diagnose, treat, cure, or prevent any disease. Please consult your healthcare provider before starting any new fitness or nutritional program or before using any products during pregnancy or if you have a serious medical condition. The content provided on this website, including text, graphics, images, and other material, is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Reliance on any information provided by this website is solely at your own risk. We do not endorse or recommend any specific products, tests, physicians, procedures, opinions, or other information that may be mentioned on this website. Reliance on any information provided by this website is solely at your own risk. We reserve the right to modify or update this disclaimer at any time without prior notice.  Enhancing the body’s natural defence system (immunity) plays an important role in maintaining optimum health. However, it is important to know that strong immune system may not prevent you from contracting COVID-19, but various research reports suggest that patients with good immunity levels are able to fight the COVID-19 infection better.  Recommendations provided by our Nutritionist may help in improving your immunity. These recommendations must not be considered as medical advice for prevention and/or treatment of COVID-19. Adherence to these recommendations will not ensure successful prevention and/or treatment of COVID-19. Furthermore, these recommendations must not be interpreted as setting a standard of care or be deemed inclusive of all proper methods of care nor exclusive of other methods of care for prevention and/or treatment of COVID-19. If you are COVID-19 patient or have COVID-19 related symptoms, you must consult a doctor for proper medical advice.', '2024-09-11 18:10:33', '2024-09-11 18:10:33'),
(24, 'Returns & Refunds', 'Returns & Refunds', 'Please visit Our Return & Refund Page Policy to see the Return and Refunds ', '2024-09-11 18:11:45', '2024-09-11 18:11:45'),
(25, 'Delivery Related', 'How can you raise the delivery dispute issue?', 'If the order is showing delivered but you have not received the parcel physically, then you should raise the issue/ delivery dispute to Bignlean.com C-Care within 48 business hours. (Customer Helpline @ 1800-266-1313 for further support)', '2024-09-11 18:13:08', '2024-09-11 18:13:08'),
(26, 'Delivery Related', 'What are the installation policies for fitness equipment?', '1. No extra charges will be taken for installation of fitness equipment. 2. All the parts of equipment will be delivered by Bignlean.com 3. The installation will be done within 72 business hours of product delivery.', '2024-09-11 18:14:03', '2024-09-11 18:14:03'),
(27, 'Delivery Related', 'The customer is liable to fill road permit/declaration/inward form and/or pay the entry tax to fulfill the order.', 'The failure of filling the form or not paying the entry tax leads to shipment hold, which eventually may lead to order cancellation & refund. Hence, to have a smooth product dispatch process, form filling and payment of entry taxes wherever required plays a major role.', '2024-09-11 18:15:13', '2024-09-11 18:15:13'),
(28, 'Delivery Related', 'Why dispatch of heavy products take more than the expected time?', 'Certain times waybill/road permit is required for heavy products transferred from one state to another so, if you don\'t fall under this, consider yourself lucky!! Dispatch of heavy products take more than the expected time: 1. Firstly, the fulfillment of your order may require a certain road permit/declaration/inward form to be filled,which can either be downloaded from the respective state\'s sales tax website or one has to physically go to the nearest sales tax office to procure the above. 2. Also, at times entry taxes as per the Commercial Tax Government rules are levied by the respective state where the goods are shipped However, it might vary from product to product.', '2024-09-11 18:16:08', '2024-09-11 18:16:08'),
(29, 'Delivery Related', 'How long do you take to dispatch an order?', 'The duration of dispatching an order depends on the type of order you have placed. Usually all orders dispatch same day if order placed before 11am IST. post 12pm IST Orders will move next business days.  JIT Items (Just-in-time Items): These items are procured from vendors on receiving your confirmation on an order. It takes 2-7 business days to dispatch JIT orders after you have placed an order. Drop-ship Items: These items are shipped directly by our vendors to you. It takes 2-5 business days to dispatch drop-ship orders. We strive to dispatch your order as soon as possible. In case you have placed a mixed order of In-stock, JIT and Drop-ship items, we sub-divide your order and dispatch it in parts, shipping the earliest available items first. At all steps of your order processing, we are in constant touch with you over phone, email and SMS to keep you updated.  what are the shipping charges on Bignlean.com The shipping charges may apply to a product. The charges will vary depending on the quantity of a product. The charges will be mentioned on the product page along with other product details otherwise we obtain free shipping across India.', '2024-09-11 18:16:59', '2024-09-11 18:16:59'),
(30, 'Delivery Related', 'How can I track my order?', 'As soon as we ship your order, you receive an e-mail notification with a link to track your order. You can also access this information from your \'My Account\' section at the top right corner on our website www.bignlean.com Or on Our Bignlean.com App Online tracking usually goes live within 24-48 business hours post shipping.', '2024-09-11 18:17:48', '2024-09-11 18:17:48'),
(31, 'Delivery Related', 'How much time does it take for an order to be delivered?', 'We deliver your order within 2-3 working days post-dispatch in A-1 and A-2 Metros (New Delhi, Mumbai, Kolkata, Bengaluru, Chennai, Pune, Ahmedabad and Hyderabad). For the rest of the cities, we deliver between 2-5 business days. Delivery by ground takes a little longer than air couriers. Ground-shipped orders are delivered to you between 5-7 business days post-dispatch. Deliveries to very remote locations such as North East may take up to 7 business days or longer, depending on the location\'s geographical constraints.', '2024-09-11 18:18:31', '2024-09-11 18:18:31'),
(32, 'Delivery Related', 'Do you ship to international locations?', 'Yes. International Shipping is Chargeable.', '2024-09-11 18:19:01', '2024-09-11 18:19:01'),
(33, 'Delivery Related', 'How do you ship your orders?', 'We ship certain heavy items such as treadmills, dumbbells etc. by ground couriers while other light items are shipped by air. We deliver most of our orders through our own Assign aggregator Partners - Bignlean.com Reach, or through courier partners such as Bluedart, Fedex, Xpressbees & Delhivery . For a few remote locations where there is no other courier service available, we use India Post to deliver your orders.', '2024-09-11 18:19:33', '2024-09-11 18:19:33'),
(34, 'EMI plans / Interest charge', 'Plans', ' EMI monthly schedules begin from the next card billing statement post the transaction date as determined by your bank. For any queries regarding foreclosure/ pre-closure of your EMI transaction or on amounts charged on your credit card, please contact your bank.', '2024-09-11 18:21:12', '2024-09-11 18:21:12'),
(35, 'EMI plans / Interest charge', 'EMI is not applicable for debit cards.', 'For any item which is priced at or over the EMI eligibility threshold, the product page will automatically show a label that this item is eligible for EMI and also display a table with the EMI rates and amounts for that item across different EMI tenures and banks. In case of cancellation or return, interest charged by the bank till that time will not be refundable under any circumstances. Partial cancellation is allowed. EMI purchases need to be made on a single credit card and cannot be split across multiple cards The Bank charges annual interest rates (as shown below) according to the reducing monthly balance. In the monthly reducing cycle, the principal is reduced with every EMI and the interest is calculated on the balance outstanding.', '2024-09-11 18:22:18', '2024-09-11 18:22:18'),
(36, 'EMI plans / Interest charge', 'What is Bignlean.com\'s EMI payment option?', 'Bignlean.com\'s EMI payment option is available for credit card holders only. You may choose to pay in 3, 6, 9,12, 18, or 24-month installments. There is NO processing fee charged for availing Bignlean.com\'s EMI payment option.', '2024-09-11 18:22:59', '2024-09-11 18:22:59'),
(37, 'Payments / Credit / Debit Cards', 'What should I do if my payment fails?', 'In case of a payment failure, please retry ensuring: Information passed on to payment gateway is accurate i.e. account details, billing address, password (for net banking) Your Internet connection is not disrupted in the process. If your account has been debited after a payment failure, it is normally rolled back to your bank account within 7 business days. You can email us on orders@bignlean.com or please give us a call with your order number for any clarification.', '2024-09-11 18:25:06', '2024-09-11 18:25:06'),
(38, 'Payments / Credit / Debit Cards', 'I tried placing my order using my debit card/credit card/Net Banking but the order was not successful. What happens to Bignlean.com COINS & Cash Back deducted from my Account?', 'n case your order is not successful and Bignlean.com COINS & cash has been deducted from your account we would proactively initiate refund within 3 days.', '2024-09-11 18:25:46', '2024-09-11 18:25:46'),
(39, 'Payments / Credit / Debit Cards', 'I tried placing my order using my debit card/credit card/Net Banking but the order was not successful. What happens to the money deducted from the card?', 'Please check your bank/credit card account to first ensure if your account has been debited. If your account has been debited after a payment failure, it is normally rolled back by banks within 7 business days. The time taken can vary from bank to bank and we unfortunately won\'t be able to expedite this. Please check with your bank for more details. If your bank informs you otherwise please get back to us. If the money has been credited to our account we would initiate refund within 3 days of your request. Receipt of the refund would however depend on the mode of payment mode chosen by you. The expected timelines are as below: Net Banking 2-4 business days Debit Card 5-7 business days Credit Card 7-21 business days', '2024-09-11 18:26:25', '2024-09-11 18:26:25'),
(40, 'COD - Cash On Delivery ', 'Why is COD not available to me?', 'Cash on Delivery (COD) option is not offered by our Courier partners at few serviceable locations. Also, COD option is not available on some of our products. Hence, based on your location and your choice of products, COD option may not be available to you. However, you can always opt for payment through Net Banking or Credit/Debit Card.', '2024-09-11 18:27:27', '2024-09-11 18:27:27'),
(41, 'How do I pay using a credit/debit card? Credit cards', 'Payment Using Cards', 'We accept payments made using Visa, MasterCard and American Express credit cards. To pay using your credit card at checkout, you will need your card number, expiry date, three-digit CVV number (found on the backside of your card). After entering these details, you will be redirected to the bank\'s page for entering the online 3D Secure password. Find out various types of Payment Partners Debit cards', '2024-09-11 18:28:52', '2024-09-11 18:28:52'),
(42, 'How do I pay using a credit/debit card? Credit cards', 'Debit cards', 'We accept payments made using Visa, MasterCard and Maestro debit cards. To pay using your debit card at checkout, you will need your card number, expiry date (optional for Maestro cards), three-digit CVV number (optional for Maestro cards). You will then be redirected to your bank\'s secure page for entering your online password (issued by your bank) to complete the payment.', '2024-09-11 18:29:40', '2024-09-11 18:29:40'),
(43, 'COD - Cash On Delivery', 'How do I place a Cash on Delivery (COD) order?', 'All items that have the \"Cash on Delivery Available\" icon are valid for order by Cash on Delivery. Add the item(s) to your cart and proceed to checkout. When prompted to choose a payment option, select \"Pay By Cash on Delivery\". Enter the name and contact details of the person who would be receiving the COD order. Please verify your order by giving us a  call on 1800-266-1313 from the number you have given as Cash On Delivery number in the payment options. In case you are unable to make this call, we will give you a call to confirm the order. Once verified and confirmed, your order will be processed for shipment in the time specified, from the date of confirmation. You will be required to make a cash-only payment to our courier partner at the time of delivery of your order to complete the payment. Terms & Conditions: The maximum order value for COD is Rd 15000 Rs XYZ COD charges for orders under Rs 500.', '2024-09-11 18:30:36', '2024-09-11 18:30:36'),
(44, 'Payment Related', 'How do I pay for a Bignlean.com purchase?', 'There are zero hidden charges when you make a purchase on Bignlean.com. The prices listed for all the items are final and all-inclusive. The price you see on the product page is exactly what you pay. You may use Credit cards/Debit cards, Internet Banking and Cash on Delivery to make your purchase.', '2024-09-11 18:31:38', '2024-09-11 18:31:38'),
(45, 'Payment Related', 'Are there any hidden charges when I make a purchase on Bignlean.com?', 'There are zero hidden charges when you make a purchase on Bignlean.com. The prices listed for all the items are final and all-inclusive. The price you see on the product page is exactly what you pay. You would be charged XYZ Amount as delivery charges if your order is less than Rs 500. Also, a Rs XYZ For COD charges are applicable if your COD purchase is less than Rs 500.', '2024-09-11 18:32:13', '2024-09-11 18:32:13'),
(46, 'Order Status Related', 'How do I check the current status of my orders?', 'You can review the status of your orders and other related information in the \'My Account\' section In the My Account page, click on the \'My Orders\' link to view the status of all your orders. To view the status of a specific order, click on the \'Order Number\' link.', '2024-09-11 18:32:50', '2024-09-11 18:32:50'),
(47, 'Order Status Related', 'Can I order a product that is \'Sold Out\'?', 'Unfortunately, products listed as \'Sold Out\' are not available for sale. Please use the \'Notify Me\' feature to be informed of the product\'s availability.', '2024-09-11 18:33:24', '2024-09-11 18:33:24'),
(48, 'Order Status Related', 'How do I know my order has been confirmed?', 'Once your order has been logged and payment authorization has been received, the seller confirms receipt of the order and begins processing it. You will receive an email containing the details of your order when the seller receives it and confirms the same. In this mail you will be provided with a unique Order ID, a listing of the item(s) you have ordered and the expected dispatch or delivery time. You will also be notified when the item(s) are shipped to you. Shipping details will be provided with the respective tracking number(s).', '2024-09-11 18:34:01', '2024-09-11 18:34:01'),
(49, 'Order Status Related', 'Order Cancelled ?', 'The order was cancelled.', '2024-09-11 18:34:46', '2024-09-11 18:34:46'),
(50, 'Order Status Related', 'Order Shipped ?', 'Your order has been shipped by the seller and is on its way to the location specified by you for delivery.', '2024-09-11 18:35:30', '2024-09-11 18:35:30'),
(51, 'Order Status Related', 'COD Verification Pending ?', 'Your order has been received by us but is processed only after a verification call if made to your number and you verify the COD order.', '2024-09-11 18:36:14', '2024-09-11 18:36:14'),
(52, 'Order Status Related', 'Payment Authorized, Order under Processing ?', 'Authorization has been received from the payment gateway and your order is being processed by the seller.', '2024-09-11 18:36:57', '2024-09-11 18:36:57'),
(53, 'Order Status Related', 'Payment Pending Authorization ?', 'Your order has been logged and we are waiting for authorization from the payment gateway.', '2024-09-11 18:37:32', '2024-09-11 18:37:32'),
(54, 'Account and Support Questions', 'Is my personal information secure on your platform?', 'Yes, we take data security and privacy seriously. We use encryption and follow industry-standard practices to secure your information. Feel free to customize these FAQs according to the specific details and policies of your e-commerce platform for health supplements, sports materials, and apparel.', '2024-09-11 18:38:20', '2024-09-11 18:38:20'),
(55, 'Account and Support Questions', 'Can I track my order?', 'Yes, once your order is processed, you\'ll receive a tracking number via email & SMS. You can use this number to track the status of your delivery.', '2024-09-11 18:38:53', '2024-09-11 18:38:53'),
(56, 'Account and Support Questions', 'What if I have an issue with my order?', 'If you encounter any issues with your order, you can reach out to our customer support team via email, phone.', '2024-09-11 18:39:37', '2024-09-11 18:39:37'),
(57, 'Account and Support Questions', 'How can I create an account?', 'You can easily create an account on our website or app by providing basic information like your email address and creating a password.', '2024-09-11 18:40:13', '2024-09-11 18:40:13'),
(58, 'Product-Specific Questions', 'Do you offer customization or personalization options for sports equipment or apparel?', 'Currently, we may offer customization or personalization for specific products. Please check our website for available options.', '2024-09-11 18:40:46', '2024-09-11 18:40:46'),
(59, 'Product-Specific Questions', 'What materials are used in your sports apparel?', 'Our sports apparel is made from high-quality, performance-enhancing materials designed for comfort, durability, and breathability.', '2024-09-11 18:41:21', '2024-09-11 18:41:21'),
(60, 'Product-Specific Questions', 'Can you provide guidance on product usage and dosage?', 'We offer general usage guidelines on our website. However, for specific queries, we recommend consulting a healthcare professional or you can simply reach to us via contact information.', '2024-09-11 18:41:52', '2024-09-11 18:41:52'),
(61, 'Product-Specific Questions', 'Are your supplements and products certified or approved?', 'Yes, our supplements are sourced from reputable manufacturers and are certified or approved by relevant health authorities.', '2024-09-11 18:42:28', '2024-09-11 18:42:28');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `product` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user`, `product`, `createdAt`, `updatedAt`) VALUES
(1, 5, 3, '2024-07-23 15:40:23', '2024-07-23 15:40:23'),
(2, 5, 1, '2024-07-23 16:05:19', '2024-07-23 16:05:19'),
(4, 6, 13, '2024-07-29 07:41:39', '2024-07-29 07:41:39'),
(5, 1, 17, '2024-08-13 11:52:26', '2024-08-13 11:52:26'),
(6, 3, 17, '2024-08-14 07:41:50', '2024-08-14 07:41:50'),
(9, 10, 17, '2024-08-14 13:16:07', '2024-08-14 13:16:07'),
(10, 10, 12, '2024-08-14 13:16:08', '2024-08-14 13:16:08'),
(11, 10, 13, '2024-08-16 09:27:40', '2024-08-16 09:27:40'),
(15, 2, 27, '2025-04-09 06:53:03', '2025-04-09 06:53:03'),
(16, 18, 13, '2025-04-29 06:41:33', '2025-04-29 06:41:33'),
(21, 21, 17, '2025-04-29 10:56:28', '2025-04-29 10:56:28'),
(22, 21, 25, '2025-04-29 10:56:52', '2025-04-29 10:56:52'),
(33, 24, 17, '2025-05-05 09:20:05', '2025-05-05 09:20:05'),
(36, 11, 34, '2025-05-14 16:22:00', '2025-05-14 16:22:00'),
(38, 11, 12, '2025-05-17 07:27:43', '2025-05-17 07:27:43'),
(48, 65, 13, '2025-06-27 11:53:07', '2025-06-27 11:53:07'),
(50, 65, 4, '2025-06-27 11:55:13', '2025-06-27 11:55:13'),
(51, 65, 12, '2025-06-27 11:55:31', '2025-06-27 11:55:31'),
(52, 65, 17, '2025-06-27 11:56:05', '2025-06-27 11:56:05'),
(53, 65, 3, '2025-06-27 11:56:06', '2025-06-27 11:56:06'),
(54, 40, 17, '2025-07-04 07:22:35', '2025-07-04 07:22:35'),
(55, 40, 13, '2025-07-04 07:22:36', '2025-07-04 07:22:36'),
(56, 40, 12, '2025-07-04 07:22:37', '2025-07-04 07:22:37'),
(57, 40, 3, '2025-07-04 07:22:39', '2025-07-04 07:22:39');

-- --------------------------------------------------------

--
-- Table structure for table `gymGuides`
--

CREATE TABLE `gymGuides` (
  `id` int NOT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gymGuides`
--

INSERT INTO `gymGuides` (`id`, `file`, `description`, `createdAt`, `updatedAt`) VALUES
(3, 'https://bignlean-api.synoventum.site//uploads/1720935731614.pdf', 'Description', '2024-07-14 05:42:16', '2024-07-14 05:42:16'),
(4, 'https://bignlean-api.synoventum.site//uploads/1720935748229.pdf', 'Description', '2024-07-14 05:42:34', '2024-07-14 05:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `image`, `title`, `link`, `body`, `createdAt`, `updatedAt`) VALUES
(1, 'https://bignlean-api.synoventum.site//uploads/1720694236635.png', 'test', 'test', 'test', '2024-07-11 10:37:23', '2024-07-11 10:37:23'),
(2, 'https://bignlean-api.synoventum.site//uploads/1720695535735.png', 'test', 'test', 'test', '2024-07-11 10:59:06', '2024-07-11 10:59:06');

-- --------------------------------------------------------

--
-- Table structure for table `notificationSchedules`
--

CREATE TABLE `notificationSchedules` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `body` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notificationSchedules`
--

INSERT INTO `notificationSchedules` (`id`, `title`, `body`, `image`, `date`, `time`, `createdAt`, `updatedAt`) VALUES
(6, 'schedule notification', 'test', 'https://bignlean-api.synoventum.site//uploads/1721043921102.jpeg', '2024-07-15T18:30:00.000Z', '05:02 pm', '2024-07-15 11:45:52', '2024-07-15 11:45:52');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `products` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `name`, `image`, `products`, `createdAt`, `updatedAt`) VALUES
(2, 'Offer Name', 'https://bignlean-api.synoventum.site//uploads/1720935772824.jpg', '[4, 1, 3]', '2024-07-14 05:42:57', '2024-07-14 05:42:57'),
(3, 'Offer 2', 'https://bignlean-api.synoventum.site//uploads/1720935796599.png', '[1, 4]', '2024-07-14 05:43:17', '2024-07-14 05:43:17');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `product` json NOT NULL,
  `address` int NOT NULL,
  `usedCoupon` tinyint(1) NOT NULL DEFAULT '0',
  `coupon` int NOT NULL DEFAULT '0',
  `couponDiscount` float NOT NULL DEFAULT '0',
  `amount` float NOT NULL,
  `qty` json NOT NULL,
  `paymentMethod` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `transactionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `usedBGLCash` tinyint(1) NOT NULL DEFAULT '0',
  `bglCash` int NOT NULL DEFAULT '0',
  `earnedBglCash` int NOT NULL DEFAULT '0',
  `shiping` float NOT NULL,
  `totalAmount` float NOT NULL,
  `orderID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `trackingID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Processing',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user`, `product`, `address`, `usedCoupon`, `coupon`, `couponDiscount`, `amount`, `qty`, `paymentMethod`, `transactionId`, `usedBGLCash`, `bglCash`, `earnedBglCash`, `shiping`, `totalAmount`, `orderID`, `trackingID`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 5, '[13]', 2, 0, 0, 0, 10, '[1]', 'RazorPay', 'pay_OkKyLjEupg49DS', 1, 0, 0, 34, 9, '#516014', NULL, 'Processing', '2024-08-13 09:40:14', '2024-08-13 09:40:14'),
(2, 40, '[17]', 3, 0, 0, 0, 500, '[1]', 'COD', NULL, 1, 0, 0, 54, 499, '#630655', NULL, 'Processing', '2024-08-13 11:23:56', '2025-07-01 07:16:11'),
(3, 11, '[17]', 5, 0, 0, 0, 500, '[1]', 'COD', NULL, 1, 0, 0, 106, 499, '#913552', NULL, 'Processing', '2024-09-02 01:56:40', '2024-09-18 05:54:01'),
(4, 20, '[13]', 6, 0, 0, 0, 30, '[3]', 'COD', NULL, 1, 0, 0, 80, -70, '#115978', NULL, 'Processing', '2025-05-03 05:35:36', '2025-05-03 05:42:53'),
(5, 20, '[17, 13, 3]', 6, 0, 0, 0, 570, '[1, 6, 1]', 'COD', NULL, 0, 0, 0, 80, 570, '#921533', NULL, 'Processing', '2025-05-03 05:44:49', '2025-05-03 05:44:49'),
(6, 20, '[13]', 6, 0, 0, 0, 40, '[4]', 'COD', NULL, 0, 0, 0, 80, 40, '#156155', NULL, 'Processing', '2025-05-03 06:04:08', '2025-05-03 06:04:08'),
(7, 20, '[17]', 6, 0, 0, 0, 1000, '[2]', 'COD', NULL, 0, 0, 0, 0, 1000, '#541757', NULL, 'Cancelled', '2025-05-03 06:27:36', '2025-05-05 12:47:37'),
(8, 24, '[27]', 7, 0, 0, 0, 17500, '[5]', 'COD', NULL, 0, 0, 7, 0, 17500, '#354760', NULL, 'Processing', '2025-05-05 09:43:02', '2025-05-05 11:19:47'),
(9, 20, '[17]', 8, 0, 0, 0, 500, '[1]', 'COD', NULL, 0, 0, 8, 80, 500, '#425580', 'MANUAL-1746444497', 'PP', '2025-05-05 11:15:05', '2025-05-05 11:24:07'),
(10, 11, '[27]', 5, 0, 0, 0, 10500, '[3]', 'COD', NULL, 0, 0, 1, 32, 10500, '#977022', NULL, 'Processing', '2025-05-08 13:54:21', '2025-05-13 10:26:53'),
(11, 11, '[12]', 5, 0, 0, 0, 14000, '[2]', 'COD', NULL, 0, 0, 6, 32, 14000, '#935140', NULL, 'Processing', '2025-05-08 14:02:40', '2025-05-14 11:36:40'),
(12, 11, '[20]', 5, 0, 0, 0, 3000, '[1]', 'COD', NULL, 0, 0, 10, 32, 3000, '#535647', NULL, 'Processing', '2025-05-13 10:26:38', '2025-05-13 10:26:38'),
(13, 11, '[17]', 9, 0, 0, 0, 2500, '[5]', 'COD', NULL, 0, 0, 2, 32, 2500, '#183238', NULL, 'Pending', '2025-05-14 11:25:45', '2025-07-03 06:24:39'),
(14, 39, '[13]', 11, 0, 0, 0, 10, '[1]', 'COD', NULL, 0, 0, 2, 361, 10, '#819035', NULL, 'Processing', '2025-05-29 11:26:17', '2025-05-29 11:26:17'),
(15, 40, '[17, 13, 12]', 15, 0, 0, 0, 8520, '[3, 2, 1]', 'COD', NULL, 0, 0, 6, 0, 8520, '#686379', NULL, 'Cancelled', '2025-06-27 12:45:31', '2025-07-04 09:56:30'),
(16, 40, '[13]', 15, 0, 0, 0, 10, '[1]', 'COD', NULL, 0, 0, 9, 80, 10, '#836947', NULL, 'PP', '2025-07-04 09:56:16', '2025-07-04 09:56:16');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int NOT NULL,
  `duration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `benefits` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `duration`, `price`, `benefits`, `createdAt`, `updatedAt`) VALUES
(2, '30 Days plan ', 199.00, '[\"This is a test line\"]', '2024-07-14 05:35:16', '2025-05-17 13:36:10');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `catId` int NOT NULL,
  `subCatId` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `isBestSeller` tinyint(1) NOT NULL DEFAULT '0',
  `isOnFlashSale` tinyint(1) NOT NULL DEFAULT '0',
  `images` json NOT NULL,
  `overView` json NOT NULL,
  `details` json NOT NULL,
  `tables` json NOT NULL,
  `information` json NOT NULL,
  `certificates` json NOT NULL,
  `supplements` json NOT NULL,
  `brand` json NOT NULL,
  `hit` int NOT NULL DEFAULT '0',
  `varients` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `catId`, `subCatId`, `name`, `isBestSeller`, `isOnFlashSale`, `images`, `overView`, `details`, `tables`, `information`, `certificates`, `supplements`, `brand`, `hit`, `varients`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'test', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1720694122555.png\"]', '[{\"value\": \"10\", \"nutrients\": \"10\"}]', '[{\"body\": \"test\", \"heading\": \"headinf\"}]', '[{\"table\": [{\"for\": \"for\", \"value\": \"10\"}], \"title\": \"traits\"}]', '[{\"value\": \"10\", \"nutrients\": \"nutri\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1720694150354.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1720694152989.jpg\"]', '{\"body\": \"text\", \"heading\": \"heading\"}', 0, '[{\"id\": 1, \"mrp\": \"10\", \"date\": \"2024-07-17T21:05\", \"stock\": \"10\", \"units\": \"10\", \"flavor\": [\"100\"], \"premiumPrice\": \"10\", \"sellingPrice\": \"10\"}]', '2024-07-11 10:35:59', '2024-07-11 10:35:59'),
(3, 6, 6, 'Product Name', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1720934887386.png\"]', '[{\"value\": \"10\", \"nutrients\": \"Nutrients\"}]', '[{\"body\": \"Body Text\", \"heading\": \"Heading\"}]', '[{\"table\": [{\"for\": \"For\", \"value\": \"10\"}], \"title\": \"General Traits\"}]', '[{\"value\": \"20\", \"nutrients\": \"Nutrients\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1720934967359.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1720934972268.png\"]', '{\"body\": \"Body Text\", \"heading\": \"Heading\"}', 0, '[{\"id\": 1, \"mrp\": \"10\", \"date\": \"2024-07-31T10:57\", \"stock\": \"101\", \"units\": \"10\", \"flavor\": [\"Test\", \"Test 2\"], \"premiumPrice\": \"10\", \"sellingPrice\": \"10\"}]', '2024-07-14 05:29:43', '2024-07-14 05:29:43'),
(4, 6, 6, 'Product 2', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1720935018269.jpg\"]', '[{\"value\": \"30\", \"nutrients\": \"Nutro\"}]', '[{\"body\": \"Body\", \"heading\": \"Head\"}]', '[{\"table\": [{\"for\": \"test\", \"value\": \"30\"}], \"title\": \"Traits\"}]', '[{\"value\": \"30\", \"nutrients\": \"Information\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1720935053564.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1720935058389.png\"]', '{\"body\": \"Body\", \"heading\": \"Brand Heading\"}', 0, '[{\"id\": 1, \"mrp\": \"20\", \"date\": \"2024-07-25T11:00\", \"stock\": \"20\", \"units\": \"20\", \"flavor\": [\"Test\"], \"premiumPrice\": \"20\", \"sellingPrice\": \"20\"}]', '2024-07-14 05:31:06', '2024-07-14 05:31:06'),
(5, 7, 7, 'Product name changed', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1721043809363.jpeg\"]', '[{\"value\": \"10\", \"nutrients\": \"test\"}]', '[{\"body\": \"text\", \"heading\": \"heading\"}]', '[{\"table\": [{\"for\": \"for\", \"value\": \"10\"}], \"title\": \"traits\"}]', '[{\"value\": \"10\", \"nutrients\": \"information\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1721043842674.jpeg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1721043845930.jpeg\"]', '{\"body\": \"body\", \"heading\": \"Heading\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2024-07-15 11:44:11', '2024-07-15 11:44:35'),
(12, 9, 11, 'Unmatched Isolate Protein ', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1721643882749.jpeg\", \"https://bignlean-api.synoventum.site//uploads/1721643888887.jpeg\", \"https://bignlean-api.synoventum.site//uploads/1721643893693.jpeg\", \"https://bignlean-api.synoventum.site//uploads/1721643899053.jpeg\", \"https://bignlean-api.synoventum.site//uploads/1721643903677.jpeg\", \"https://bignlean-api.synoventum.site//uploads/1721643908387.jpeg\"]', '[{\"value\": \" 120\", \"nutrients\": \"Calories \"}, {\"value\": \"1g\", \"nutrients\": \"Total Fat\"}, {\"value\": \"2g\", \"nutrients\": \"Total Carbohydrates \"}, {\"value\": \"1g\", \"nutrients\": \"Total Sugar \"}, {\"value\": \"24g\", \"nutrients\": \"Protein\"}, {\"value\": \"29\", \"nutrients\": \"Serving\"}, {\"value\": \"Milk, Tree & Nuts\", \"nutrients\": \"Contains \"}]', '[{\"body\": \"Our grass-fed whey isolate is the gold standard for unparalleled purity. It is naturally sweetened and flavored without any added fillers, antibiotics, or artificial ingredients. With a commitment to quality and transparency, Isolate delivers optimal nutrition, bridging the gap between health and performance. This protein is derived from grass-fed cows in the United Kingdom to ensure only the best quality and highest bioavailability. Every scoop supports your goals with Unmatched excellence.\\n\\nALL NATURAL\\nThe Unmatched lineup are all naturally sweetened, flavored, and colored to ensure your experience is one you can enjoy without any artificial additives. Our commitment to using only natural sweeteners, flavors, and colors means you can trust that each product is not only delicious but also aligns with a healthy lifestyle.*\\n\\n3RD PARTY TESTED\\nAll products are manufactured in a NSF Certified cGMP facility and 3rd-party tested. This thorough testing process is crucial in ensuring that you are receiving a product that meets the highest standards of excellence and reliability, providing you with confidence and the best possible benefits for your health and well-being.*\\n\\nOPTIMIZED FORMULAS\\nAll products have been formulated with full clinical servings of ingredients in every serving to provide maximal results for your goals. We pride ourselves on only using the best ingredients that have been proven effective in scientific research and clinical studies.*\\n\\n\\nPREMIUM INGREDIENTS\\nFORMULATED FOR SUCCESS\\nWe carefully source the best natural components, each selected for their proven physical performance and health-span benefits as well as their superior purity. Staying up to date on the latest clinical research, we create cutting edge formulations that exceed industry standards. Free from artificial additives, our products provide a clean, natural, and delicious taste experience, supporting each of your health goals. Our commitment to excellence and our dedication to using only premium ingredients can help ensure you achieve your wellness objectives with confidence is what makes us Unmatched.\\n\\n\\n\", \"heading\": \"Description \"}]', '[{\"table\": [{\"for\": \"A b version \", \"value\": \"Because voting \"}], \"title\": \"Abc values \"}]', '[{\"value\": \"24g\", \"nutrients\": \"Premium Protein\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1721644515990.jpeg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1721644433913.jpeg\"]', '{\"body\": \"Delhi\", \"heading\": \"Proteinx \"}', 0, '[{\"id\": 1, \"mrp\": \"10999\", \"date\": \"2026-12-22T15:55\", \"stock\": \"2\", \"units\": \"900G\", \"flavor\": [\"Rich Chocolate \"], \"premiumPrice\": \"6500\", \"sellingPrice\": \"7000\"}]', '2024-07-22 10:35:18', '2024-07-22 10:35:18'),
(13, 11, 17, 'Muscletech NitroTech 100% Whey Gold Performance Series', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1721995447435.png\", \"https://bignlean-api.synoventum.site//uploads/1721995449240.png\", \"https://bignlean-api.synoventum.site//uploads/1721995450920.png\", \"https://bignlean-api.synoventum.site//uploads/1721995452865.png\", \"https://bignlean-api.synoventum.site//uploads/1721995454941.png\"]', '[{\"value\": \"24g\", \"nutrients\": \"Protein\"}, {\"value\": \"5.5g\", \"nutrients\": \"BCAA\"}, {\"value\": \"4g\", \"nutrients\": \"EAA\"}, {\"value\": \"4g\", \"nutrients\": \"Glutamic acid\"}, {\"value\": \"117\", \"nutrients\": \"Kcal\"}, {\"value\": \"79.0\", \"nutrients\": \"Protein % per serving\"}, {\"value\": \"Added Gluten\", \"nutrients\": \"Gluten free\"}, {\"value\": \"Yes\", \"nutrients\": \"Carbs\"}]', '[{\"body\": \"Gold Standard 100% Whey Blend - 24g blended protein consisting of whey protein isolate, whey protein concentrate, and whey peptides/hydrolysates to support muscle recovery. Primary protein source is Isolate, they don\'t call it the Gold Standard of quality for nothing.\\n\\nWhat Does It Have -11 grams of naturally occurring EAAs, including 5.5 grams of naturally occurring BCAAs, and over 4 grams of naturally occurring Glutamine and Glutamic Acid in each serving to support endurance and muscle recovery. Gluten-Free & suitable for Vegetarians\\n\\nSMS ON <space> 6 digit unique code on the pack to 57575 or visit our website Authenticateon.in to instantly check the authenticity of the product\\n\\nCountry of Origin: India, it is manufactured in India, in a facility that is ISO 14001 & 22000 certified and inspected & Approved by Food Safety Standard Authority of India. Whey Imported from Europe. Manufactured for OPTIMUM NUTRITION, INC. By Tirupati Wellness Pvt Ltd, Surajpur, Nahan Road, Paonta Sahib Dist. Sirmour- 173025 (HP)\", \"heading\": \"About the product\"}, {\"body\": \"Optimum Nutrition is a trusted brand which has a legacy\\nof over 30 years. They have made their mark in the\\nfitness and nutrition industry in more than 90 countries.\\nDouble Rich Chocolate 5lbs ON Whey Protein is among\\nthe top-selling protein supplements in their range\\nbecause it caters to multiple needs including muscle\\nmaintenance and growth.\\n\\nWhey proteins are derived from milk and have grown in\\npopularity because they are easy for the body to absorb.\\nYou have three primary varieties including whey protein\\nconcentrates, whey isolates and whey hydrolysates.\\nThey differ in the protein concentration and rate of\\nabsorption. ON Double Rich Chocolate 5Ibs uses all\\nthree to give you the option of proteins that are\\nabsorbed instantly and those that provide a sustained\\nsupply of amino acids.\", \"heading\": \"Other Information\"}]', '[{\"table\": [{\"for\": \"Weight\", \"value\": \"4g\"}], \"title\": \"General Traits\"}]', '[{\"value\": \"4g\", \"nutrients\": \"Weight\"}, {\"value\": \"2.0\", \"nutrients\": \"Protein % per Serving\"}, {\"value\": \"67.0\", \"nutrients\": \"Price per kg\"}, {\"value\": \"44\", \"nutrients\": \"Number of Servings\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1721995660839.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1721995662947.png\"]', '{\"body\": \"Sold & Marketed By: Gold Standard 100% Whey Blend - 24g blended\\nprotein consisting of whey protein isolate, whey\\nprotein concentrate, and whey peptides/\\nhydrolysates to support muscle recovery.\\n\\nManufactured By: Gold Standard 100% Whey Blend - 24g blended\", \"heading\": \"Muscletech\"}', 0, '[{\"id\": 1, \"mrp\": \"10\", \"date\": \"2024-08-15T10:08\", \"stock\": \"10\", \"units\": \"10\", \"flavor\": [\"Flavor\"], \"weight\": 100, \"premiumPrice\": \"10\", \"sellingPrice\": \"10\"}]', '2024-07-26 12:08:24', '2024-08-04 18:03:21'),
(16, 13, 22, 'test', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1722067419844.jpg\"]', '[{\"value\": \"test\", \"nutrients\": \"test\"}]', '[{\"body\": \"test\", \"heading\": \"test\"}]', '[{\"table\": [{\"for\": \"test\", \"value\": \"test\"}], \"title\": \"test\"}]', '[{\"value\": \"test\", \"nutrients\": \"test\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1722067445933.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1722067449718.jpg\"]', '{\"body\": \"Test Brand\", \"heading\": \"Test Brand\"}', 0, '[{\"id\": 1, \"mrp\": \"35\", \"date\": \"2024-07-31T13:33\", \"stock\": \"651\", \"units\": \"351\", \"flavor\": [\"test\"], \"premiumPrice\": \"351\", \"sellingPrice\": \"13513\"}]', '2024-07-27 08:04:11', '2024-07-27 09:04:57'),
(17, 14, 23, 'GNC Creatine Monohydrate 250g', 1, 1, '[\"https://bignlean-api.synoventum.site//uploads/1720694178387.pngv\", \"https://bignlean-api.synoventum.site//uploads/1720694178387.pngv\", \"https://bignlean-api.synoventum.site//uploads/1720694178387.pngv\"]', '[{\"value\": \"250g\", \"nutrients\": \"Creatine\"}]', '[{\"body\": \"Creatine has become one of the most popular sports supplements among professional and amateur athletes. Each serving supplies 3 grams of Creatine Monohydrate. Manufactured with unsurpassed quality control to ensure purity, potency and freshness. This flavourless powder blends easily with any beverage or sports drink.\", \"heading\": \"About the product\"}, {\"body\": \"•\\tIn the body, creatine is converted to creatine phosphate, which helps to fuel skeletal muscles and provides support for immediate energy production during high-intensity workouts.\\n•\\tCreatine supplementation may help to promote cellular hydration.\\n•\\tCreatine has also been shown in numerous studies to help improve athletic performance.\\n\", \"heading\": \"Benefits\"}, {\"body\": \"Creatine Monohydrate\", \"heading\": \"Ingredients\"}, {\"body\": \"Mix 3g with 200ml of water or your favorite sports drink immediately following your workout. Consume an ample amount of water while taking this product.\", \"heading\": \"Usage\"}]', '[{\"table\": [{\"for\": \"Weight\", \"value\": \"0.55 lb\"}], \"title\": \"General Traits\"}, {\"table\": [{\"for\": \"Number of Servings\", \"value\": \"83\"}], \"title\": \"General Traits\"}, {\"table\": [{\"for\": \"Serving Size\", \"value\": \"3g\"}], \"title\": \"General Traits\"}]', '[{\"value\": \"24g\", \"nutrients\": \"Protein\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1722068820128.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1722068824527.png\"]', '{\"body\": \"Sold by: Guardian Healthcare Services Pvt Ltd.\\nMarketed By: Guardian Healthcare Services Pvt Ltd, 12-14, 3th Floor, Brady House, Veer Nariman Road, Fort Mumbai - 400001, Maharashtra.\\nManufactured By : Zeon Lifesciences Limited, Healthcare Division-11, Village Kunja, Rampur Road, Paonta Sahib, Sirmour H.P- 173025, Contact: 1800 266 8666, Email: hello@guardian.in\", \"heading\": \"Brand Authorized Imported\"}', 0, '[{\"id\": 1, \"mrp\": 600, \"weight\": 500, \"premiumPrice\": 450, \"sellingPrice\": 500}]', '2024-07-27 08:28:01', '2024-07-27 08:28:01'),
(18, 15, 24, 'PhD 100% Whey', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1723805304095.jpg\", \"https://bignlean-api.synoventum.site//uploads/1723805306902.jpg\", \"https://bignlean-api.synoventum.site//uploads/1723805308546.jpg\", \"https://bignlean-api.synoventum.site//uploads/1723805310155.jpg\"]', '[{\"value\": \"24g\", \"nutrients\": \"Protein\"}]', '[{\"body\": \"Gold Standard 100% Whey Blend - 24g blended protein consisting of whey protein isolate, whey protein concentrate, and whey peptides/hydrolysates to support muscle recovery. Primary protein source is Isolate, they don\'t call it the Gold Standard of quality for nothing.\\n\\nWhat Does It Have -11 grams of naturally occurring EAAs, including 5.5 grams of naturally occurring BCAAs, and over 4 grams of naturally occurring Glutamine and Glutamic Acid in each serving to support endurance and muscle recovery. Gluten-Free & suitable for Vegetarians\\n\\nSMS ON <space> 6 digit unique code on the pack to 57575 or visit our website Authenticateon.in to instantly check the authenticity of the product\\n\\nCountry of Origin: India, it is manufactured in India, in a facility that is ISO 14001 & 22000 certified and inspected & Approved by Food Safety Standard Authority of India. Whey Imported from Europe. Manufactured for OPTIMUM NUTRITION, INC. By Tirupati Wellness Pvt Ltd, Surajpur, Nahan Road, Paonta Sahib Dist. Sirmour- 173025 (HP)\", \"heading\": \"About the product\"}]', '[{\"table\": [{\"for\": \"Weight\", \"value\": \"4g\"}], \"title\": \"General Traits\"}]', '[{\"value\": \"2.0\", \"nutrients\": \"Protein % per Serving\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1723805476153.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1723805482598.png\"]', '{\"body\": \"Gold Standard 100% Whey Blend - 24g blended\\nprotein consisting of whey protein isolate, whey\\nprotein concentrate, and whey peptides/\\nhydrolysates to support muscle recovery.\", \"heading\": \"PHD\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2024-08-16 10:51:25', '2024-08-16 10:56:56'),
(19, 16, 27, 'Dymatize ISO 100 ', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1725870278627.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870287631.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870295864.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870299306.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870302368.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870305736.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870308828.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870312121.jpg\", \"https://bignlean-api.synoventum.site//uploads/1725870357130.jpg\"]', '[{\"value\": \"24gm\", \"nutrients\": \"Protein\"}]', '[{\"body\": \"Dymartize ISO 100 Go harder and support muscle recovery after a strenuous workout with the ultra-fast absorbing and digesting power of ISO100. One of the highest-quality protein powders in the game, it’s filtered to remove excess lactose, carbs, fat, and sugar for maximum purity, mixability and gains. Don’t just beat your best. Smash right through it with the legendary ISO100.\\n\\nExperts say about 90% of men can build extraordinary muscles with Dymatize ISO 100 protein powder. They can sustain their energy levels even after working out straight for more than 6 hours in the morning and evening. Dymatize ISO 100 protein powder, the world’s renowned brand for food supplements for muscle and body growth. Now you can support your muscle recovery after a strenuous workout.\\nYou can push yourself more towards winning your goal each day. The only support that you get from the most excellent and know best whey protein powder is to get faster absorption and digestion while you are working out. The brand itself helps you push yourself hard to build lean muscle and get the most detailed body shape if you strive hard to get the most amazing testimony for yourself. \\nHealth Benefits\\n\\nBIGNLEAN.COM Online Shop benefits you with this world-class rich fast absorption. It is the most incredible brand Dymatize, the top-rated brand for your daily nutritional needs and requirements. Finding this excellent support for muscle recovery, it’s listed as a unique blend that is prepared with special ingredients and benefits for muscle formation and body weight management.\\n\\nWhey Isolate Benefits for You\\nWhey Protein is beneficial in numerous ways, including building muscles, and making your body stronger, particularly as it contains amino acids for building muscles. \\n\\nWhey Hydrolysed Benefits for You \\nIt is a simple yet effective broken-down version of whey protein types where it helps your digestion system be stronger for quick absorption to conduct a speedy recovery of the wound. It supports muscle, bones, and body development with the friendly intake of whey protein powder for a lifetime. Easily you can rely on this international standard whey protein powder available in India. \\n\\nSome of These Excellent Benefits Include- \\n1. Excellent Source of Protein: Dymatize ISO 100 available online in cities like all across Mumbai, Maharashtra and around the Indian Borders. It sufficiently gives you 25 g of rich and healthy protein in each serving scoop. 90% is the exact ratio counted and applied with proven protein concentration that helps your daily protein requirements. Each scoop you take is ultra-filtered, used in this Whey isolate product. So it has very fine particles to make it easy for your body to absorb quickly without any heaviness to drink every day. As suggested by most experts, it acts faster after its intake. The product Also does not restrict the quantity for consumption as it supports the activity for weight gain and lean body for healthy exercises and workouts.\\n\\n2. High Amount of Amino Acid Profile: Amino acid has the most important molecules that make proteins, experts have proven these blends in Whey Protein Powder, and they help your body function properly. They are just like the build blocks in your body. The more there is an intake of amino acids it supports your system to fuel your body’s physical activity and helps your muscle growth and body weight.\\n\\nAmino Acids in Whey Proteins help you for the following – \\n1. It builds your immune system support, Glutamine is the main fuel source for your body’s  lymphocytes, they build a strong immune system as well as it gives white blood cells more capacity to fight against infections and diseases.\\n\\n2. Loaded with Glutamine in Whey Protein, it has the super qualities of maintaining Intestinal Health Regulation.\\n\\n3. It 100% assists for Muscle Recovery and Growth.\\nWith Dymatize ISO 100 Whey Protein, you are benefited from 5.5 g of BCAAs and 4 g of Glutamine in each scoop that you take from the serving pack. These help you build strong muscle and recover your body quickly as you make it challenging and aggressive to train your body daily without any problematic lifestyle. You do not have to be worried about soreness, wounds, or damages. In addition, whey protein contains the best Amino Acids to give you the best amino acid profile in your body. \\nImproves Your Lean Muscle Growth: The ultra-speed absorption whey proteins available at India’s one o\", \"heading\": \"Description\"}]', '[{\"table\": [{\"for\": \"Cookies & Cream\", \"value\": \"74\"}], \"title\": \"Serving \"}]', '[{\"value\": \"24gm\", \"nutrients\": \"Protein \"}]', '[\"https://bignlean-api.synoventum.site//uploads/1725870638932.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1725870653411.jpg\"]', '{\"body\": \"Delhi\", \"heading\": \"Musclehouse Importer \"}', 0, '[{\"id\": 1, \"mrp\": \"16999\", \"date\": \"\", \"stock\": \"8\", \"units\": \"2.27\", \"flavor\": [\"Gourmet Chocolate\", \"Gourmet Vanilla\", \"Cookies & Cream\", \"Fudge Brownie\", \"Cocoa Pebbles\", \"\"], \"premiumPrice\": \"10400\", \"sellingPrice\": \"10800\"}]', '2024-09-09 08:30:55', '2024-09-09 08:30:55'),
(20, 18, 30, 'Kaged BCAA New', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1726043084582.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726043088917.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726043093328.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726043097048.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726043100520.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726043105253.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726043108760.jpg\"]', '[{\"value\": \"2.5gm\", \"nutrients\": \"L-Leucine\"}, {\"value\": \"1.5gm\", \"nutrients\": \"L-Isolucine\"}, {\"value\": \"1.25gm\", \"nutrients\": \"L-Valine\"}]', '[{\"body\": \"ABC Testing \", \"heading\": \"ABC\"}, {\"body\": \"Testing New\", \"heading\": \"ABCD \"}, {\"body\": \"Testing new new \", \"heading\": \"ABCDE\"}]', '[{\"table\": [{\"for\": \"12\", \"value\": \"12\"}], \"title\": \"General Traits\"}, {\"table\": [{\"for\": \"122\", \"value\": \"1222\"}], \"title\": \"General Traits 2\"}, {\"table\": [{\"for\": \"111111\", \"value\": \"1111111\"}], \"title\": \"General Traits 3\"}]', '[{\"value\": \"A\", \"nutrients\": \"Helps Muscle Building\"}, {\"value\": \"B\", \"nutrients\": \"Gives Energy During Workout\"}, {\"value\": \"C\", \"nutrients\": \"Easy to use & Taste awesome with water\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1726043583528.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1726043588769.jpg\"]', '{\"body\": \"Brand Authorised Importer body information\", \"heading\": \"Brand Authorised Importer\"}', 0, '[{\"id\": 1, \"mrp\": \"5000\", \"date\": \"\", \"stock\": \"3\", \"units\": \"Watermelon\", \"flavor\": [\"Watermelon\", \"\"], \"premiumPrice\": \"2500\", \"sellingPrice\": \"3000\"}]', '2024-09-11 08:33:29', '2024-09-11 08:46:46'),
(21, 19, 31, 'Test Product', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1726583118330.jpg\"]', '[{\"value\": \"Def\", \"nutrients\": \"Abc\"}, {\"value\": \"Def2\", \"nutrients\": \"Abc2\"}]', '[{\"body\": \"body 001\", \"heading\": \"Introduction\"}, {\"body\": \"body 002\", \"heading\": \"Introduction2\"}]', '[{\"table\": [{\"for\": \"A\", \"value\": \"Z\"}], \"title\": \"abc\"}, {\"table\": [{\"for\": \"Z\", \"value\": \"A\"}], \"title\": \"abc2\"}]', '[{\"value\": \"Def Info\", \"nutrients\": \"Abc Info\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1726583241092.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1726583246636.jpg\"]', '{\"body\": \"AAAA\", \"heading\": \"Introduction AAAA\"}', 0, '[{\"id\": 1, \"mrp\": \"3999\", \"date\": \"2024-09-18T19:55\", \"stock\": \"100\", \"units\": \"100\", \"flavor\": [\"Chocolate\"], \"premiumPrice\": \"3199\", \"sellingPrice\": \"3499\"}]', '2024-09-17 14:27:40', '2024-09-17 14:27:40'),
(22, 19, 32, 'Isopure whey isolate ', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1726637484963.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726637489873.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726637494007.jpg\", \"https://bignlean-api.synoventum.site//uploads/1726637498371.jpg\"]', '[{\"value\": \"25g\", \"nutrients\": \"Protein\"}, {\"value\": \"5gm\", \"nutrients\": \"Bcaa\"}, {\"value\": \"0.9mg\", \"nutrients\": \"Cholesterol \"}, {\"value\": \"56\", \"nutrients\": \"Serving\"}, {\"value\": \"1gm\", \"nutrients\": \"Carbs\"}]', '[{\"body\": \"PRODUCT OVERVIEW\\n \\nIsopure, Zero-In On Pure!\\nPack in high-quality and delicious protein, without packing on the carbs. Our 100% whey protein isolate powders support your daily nutrition needs. Low-carb (which also has zero added sugars) has a whopping 25 grams of protein per serving. It\'s 100% whey protein isolate —and always without gluten and aspartame.\\n \\nInstantized for ease of use, mix up as a shake or make some seriously delicious dynamic recipes.\\n \\n \\n \\n• Premium, quality & Trusted Ingredients:\\n• 25 grams of protein from 100% Whey Protein Isolate with naturally occurring BCAAs and glutamine Low-Carb, Zero Added Sugar, Instantised,\\n• Gluten-Free, Aspartame-Free,\\n• Vegetarian, Informed Choice\\n• Certified Supports Muscle Recovery and Muscle Building:\\n• A quality complete protein with naturally occurring BCAAs to support Muscle Recovery and building, when taken over time with regular resistance training.\\n• Helps Meet Daily Protein Needs: A delicious way of supplementing your balanced diet with protein to support your active lifestyle.\\n• INTRODUCTORY OFFER: FREE- Personalized 7-day fitness consultation & and nutrition plan program by Hustle & Health.\\n• Plus a live workout session with a celebrity trainer.\\n• T&C applied\\n \\n \\nBENEFITS\\n \\nQuality Protein, Pure Results: 25 grams of protein from 100% whey protein isolate with naturally occurring 5gms BCAAs & 4gms Glutamine per serving 100% WHEY PROTEIN ISOLATE means exceptional quality:\\n \\nexcess fat, cholesterol, sugars, carbohydrates and other fillers are removed to give you everything you need and nothing you don’t Premium, quality & Trusted Ingredients: 25 grams of protein from 100% Whey Protein Isolate with naturally occurring BCAAs & Glutamine Low-Carb, Zero Added Sugar, Instantised, Gluten-Free, Aspartame-Free, Vegetarian, Banned Substance Tested.\\n \\nSupports Muscle Recovery and Muscle building: A quality complete protein with naturally occurring BCAAs to support Muscle Recovery and building, when taken over time with regular resistance training. Helps Meet Daily Protein Needs:\\n \\nA delicious way of supplementing your balanced diet with protein to support your active lifestyle. Test of Authenticity: Every Isopure pack comes with a verification sticker each with unique code, simply scratch it-scan it & make sure to verify your product before you consume it\\n \\n \\nSUGGESTED USE\\n \\nWhen To Use – First thing in the morning, before or after exercise, between meals, with a meal, or any time of the day, when you a protein boost to your balanced diet\\n \\nHow To Use - Mix 1 scoop with 180-240 ml water or beverage of your choice. Instantized for easy mixing - Can use a blender, or shaker or simply stir with a spoon. Have as a shake by itself, make smoothies or add to recipes.\\n \\nNot For medicinal Use. Use this product as a nutraceutical/supplement only. Healthy adults, consume enough protein to meet their daily protein requirements with a combination of high-protein foods and protein supplements throughout the day as a part of a balanced diet and exercise program.\", \"heading\": \"Description \"}]', '[{\"table\": [{\"for\": \"Abcd\", \"value\": \"1234\"}], \"title\": \"Abcd\"}, {\"table\": [{\"for\": \"Tyy\", \"value\": \"12345\"}], \"title\": \"Abcd\"}, {\"table\": [{\"for\": \"Trtt\", \"value\": \"Hggh\"}], \"title\": \"Abcd\"}]', '[{\"value\": \"Jiji\", \"nutrients\": \"Ppp\"}, {\"value\": \"Jhuhj\", \"nutrients\": \"Gubhb\"}, {\"value\": \"Jnjnjnj\", \"nutrients\": \"Hbubub\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1726637755306.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1726637751365.jpg\"]', '{\"body\": \"Importe \", \"heading\": \"Importer details \"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"2025-10-18T11:02\", \"stock\": \"9\", \"units\": \"2kg\", \"flavor\": [\"Rich chocolate\", \"Cookies & Cream\"], \"premiumPrice\": \"8000\", \"sellingPrice\": \"9999\"}]', '2024-09-18 05:36:08', '2024-09-18 05:36:08'),
(23, 20, 33, 'Saree 1001', 0, 0, '[\"https://ray.shellcode.cloud/uploads/1727783008690.jpg\"]', '[{\"value\": \"Test1\", \"nutrients\": \"Test\"}]', '[{\"body\": \"Body twest TestingTestingTestingTestingTesting\", \"heading\": \"Heading\"}]', '[{\"table\": [{\"for\": \"Female\", \"value\": \"10000\"}], \"title\": \"Yes\"}]', '[{\"value\": \"10000\", \"nutrients\": \"Test\"}]', '[\"https://ray.shellcode.cloud/uploads/1727783086322.jpg\"]', '[\"https://ray.shellcode.cloud/uploads/1727783090119.jpg\"]', '{\"body\": \"Test\", \"heading\": \"Test\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2024-10-01 11:44:57', '2024-10-01 11:44:57'),
(24, 21, 34, 'Condemned Labz Confined BCAA+EAA 30 Serving ', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1742215390020.png\", \"https://bignlean-api.synoventum.site//uploads/1742215398790.png\", \"https://bignlean-api.synoventum.site//uploads/1742215440871.png\"]', '[{\"value\": \"abc\", \"nutrients\": \"Abc\"}]', '[{\"body\": \"CONFINED provides a full-spectrum of essential amino acids (including 5 grams of 3:1:1 BCAA) to support protein synthesis, reduce breakdown, and maintain an anabolic environment. To help facilitate nutrient absorption and replenish minerals lost during intense training, CONFINED also delivers a diverse array of essential electrolytes, including sodium, potassium, and magnesium. These minerals enhance hydration and support optimal muscle function.\\n\\n\\nCONFINED EAA/BCAA BENEFITS\\nFull essential amino acid profile\\nStimulates muscle protein synthesis\\nCombats muscle protein breakdown\\nSupports energy production\\nReduces mental fatigue\\nPreserves lean muscle mass\\nAids hydration\\nAccelerates recovery\\nDecreases muscle soreness\", \"heading\": \"Description \"}, {\"body\": \"Test being calculated\", \"heading\": \"ABBBBBBB\"}]', '[{\"table\": [{\"for\": \"Leucine\", \"value\": \"mmm\"}], \"title\": \"BCAA 30 Serving\"}, {\"table\": [{\"for\": \"Valline For\", \"value\": \"12\"}], \"title\": \"Valline\"}, {\"table\": [{\"for\": \"Valline For\", \"value\": \"12\"}], \"title\": \"Isoleucine \"}]', '[{\"value\": \"A\", \"nutrients\": \"Full essential amino acid profile\"}, {\"value\": \"B\", \"nutrients\": \"Stimulates muscle protein synthesis\"}, {\"value\": \"C\", \"nutrients\": \"Combats muscle protein breakdown\"}, {\"value\": \"D\", \"nutrients\": \"Supports energy production\"}, {\"value\": \"E\", \"nutrients\": \"Reduces mental fatigue\"}, {\"value\": \"F\", \"nutrients\": \"Preserves lean muscle mass\"}, {\"value\": \"G\", \"nutrients\": \"Aids hydration\"}, {\"value\": \"H\", \"nutrients\": \"Accelerates recovery\"}, {\"value\": \"I\", \"nutrients\": \"Decreases muscle soreness\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1738354267468.jpeg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1738354276055.jpg\"]', '{\"body\": \"Delhi - India\\nph091083930021\", \"heading\": \"Protein Xpress India \"}', 0, '[{\"id\": 1, \"mrp\": \"5999\", \"date\": \"2027-05-31T13:48\", \"stock\": \"2\", \"units\": \"250gms\", \"flavor\": [\"PinknStrar\", \"\"], \"premiumPrice\": \"3800\", \"sellingPrice\": \"4000\"}]', '2025-01-31 20:11:18', '2025-02-21 06:40:11'),
(25, 23, 36, 'C4 PreWorkout', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1742315940826.webp\", \"https://bignlean-api.synoventum.site//uploads/1742315944743.webp\", \"https://bignlean-api.synoventum.site//uploads/1742315949018.webp\"]', '[{\"value\": \"Ab cbbbajn\", \"nutrients\": \"Abc inromation\"}]', '[{\"body\": \"All abiut product \", \"heading\": \"Product information \"}]', '[{\"table\": [{\"for\": \"30\", \"value\": \"24\"}], \"title\": \"Abc\"}]', '[{\"value\": \"Apor\", \"nutrients\": \"Agggd\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1742316019259.webp\"]', '[\"https://bignlean-api.synoventum.site//uploads/1742316087528.webp\"]', '{\"body\": \"Brand Authorised \", \"heading\": \"MK Importer\"}', 0, '[{\"id\": 1, \"mrp\": \"7999\", \"date\": \"2025-03-18T22:10\", \"stock\": \"1\", \"units\": \"300gm\", \"flavor\": [\"Mango\", \"Pineapples \"], \"premiumPrice\": \"4800\", \"sellingPrice\": \"5000\"}]', '2025-03-18 16:41:29', '2025-03-18 16:41:29'),
(26, 24, 37, 'Isopure Zero Carb 3Lb ', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1742417664058.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742417668930.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742417673395.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742417680769.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742417684411.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742417689880.jpg\"]', '[{\"value\": \"Zmmnnn\", \"nutrients\": \"Abc\"}]', '[{\"body\": \"Here all description\", \"heading\": \"Description\"}]', '[{\"table\": [{\"for\": \"Efgh\", \"value\": \"Jklm\"}], \"title\": \"Abc\"}]', '[{\"value\": \"Klklklllllmmmmm\", \"nutrients\": \"Popopopo\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1742417828403.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1742417839040.jpg\"]', '{\"body\": \"USA\", \"heading\": \"Glanbia performance nutrition\"}', 0, '[{\"id\": 1, \"mrp\": \"7999\", \"date\": \"2025-03-20T02:25\", \"stock\": \"2\", \"units\": \"1kg\", \"flavor\": [\"Rich Chocolate\"], \"premiumPrice\": \"6500\", \"sellingPrice\": \"6799\"}]', '2025-03-19 20:57:34', '2025-03-19 20:57:34'),
(27, 33, 38, 'Scivation Xtend EAA 30 Serving', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1742464786774.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742464791800.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742464797711.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742464802960.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742464807067.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742464812252.jpg\", \"https://bignlean-api.synoventum.site//uploads/1742464815836.jpg\"]', '[{\"value\": \"Bb\", \"nutrients\": \"Bb\"}]', '[{\"body\": \"Bb\", \"heading\": \"B\"}]', '[{\"table\": [{\"for\": \"B\", \"value\": \"B\"}], \"title\": \"Ab\"}]', '[{\"value\": \"B\", \"nutrients\": \"B\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1742464988657.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1742464982708.jpg\"]', '{\"body\": \"Gujrat\", \"heading\": \"MK Official\"}', 0, '[{\"id\": 1, \"mrp\": \"8999\", \"date\": \"2025-03-20T15:31\", \"stock\": \"1\", \"units\": \"300gm\", \"flavor\": [\"Strawberry kiwi\"], \"premiumPrice\": \"3200\", \"sellingPrice\": \"3500\"}]', '2025-03-20 10:03:23', '2025-03-20 10:03:23'),
(28, 34, 39, 'testing product', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1746868113732.png\"]', '[{\"value\": \"50\", \"nutrients\": \"dsadsads\"}]', '[{\"body\": \"testing\", \"heading\": \"testing\"}]', '[{\"table\": [{\"for\": \"testing\", \"value\": \"testing\"}], \"title\": \"testing\"}]', '[{\"value\": \"testing\", \"nutrients\": \"testing\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1746868160781.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1746868188289.png\"]', '{\"body\": \"testing\", \"heading\": \"testing\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2025-05-10 09:09:51', '2025-05-10 09:09:51'),
(29, 35, 40, 'Isopure 100% Whey Protein Isolate, 2 kg (4.4 lb), Low Carb - Dutch Chocolate', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1747124984156.html\"]', '[{\"value\": \"119 kcal per serving\", \"nutrients\": \"Energy\"}, {\"value\": \"25 gms per serving\", \"nutrients\": \"Protein\"}, {\"value\": \"2 gm per serving\", \"nutrients\": \"Carbrohydrate\"}]', '[{\"body\": \"Body text od details\", \"heading\": \"Details heading\"}]', '[{\"table\": [{\"for\": \"For \", \"value\": \"Value of general traits\"}], \"title\": \"General traits\"}]', '[{\"value\": \"Nutrition value\", \"nutrients\": \"Info Nutrients\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1747125767713.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1747125861512.jpeg\"]', '{\"body\": \"Glanbia Performance Nutrition India Pvt Ltd, Allied House, Nelson Mandela Marg Pocket 10, Sector B, Vasant Kunj,New Delhi-110 070, India Email: indiacustomercare@glanbia.com.\", \"heading\": \"Touchstone Teleservices Private Limited.\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2025-05-13 08:45:30', '2025-05-13 08:45:30'),
(30, 35, 40, 'Isopure 100% Whey Protein Isolate, 2 kg (4.4 lb), Low Carb - Dutch Chocolate', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1747126950998.html\"]', '[{\"value\": \"26 g\", \"nutrients\": \"Protein \"}]', '[{\"body\": \"Detail Body text\", \"heading\": \"Detail Heading\"}]', '[{\"table\": [{\"for\": \"For \", \"value\": \"Value\"}], \"title\": \"General traits\"}]', '[{\"value\": \"119 kcal per serving\", \"nutrients\": \"Energy\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1747127032714.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1747127035343.jpeg\"]', '{\"body\": \"Glanbia Performance Nutrition India Pvt Ltd, Allied House, Nelson Mandela Marg Pocket 10, Sector B, Vasant Kunj,New Delhi-110 070, India Email: indiacustomercare@glanbia.com.\", \"heading\": \"Sold by: Touchstone Teleservices Private Limited.\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2025-05-13 09:04:33', '2025-05-13 09:04:33'),
(31, 35, 41, 'Product name ', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1747127258917.jpeg\"]', '[{\"value\": \"26 g\", \"nutrients\": \"Protein \"}]', '[{\"body\": \"Body text Details\", \"heading\": \"Details heading\"}]', '[{\"table\": [{\"for\": \"For \", \"value\": \"Value\"}], \"title\": \"General traits\"}]', '[{\"value\": \"119 kcal per serving\", \"nutrients\": \"Energy\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1747127334636.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1747127344176.html\"]', '{\"body\": \"Body text\", \"heading\": \"Power Up Your Performance: The Essential Guide to Protein\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2025-05-13 09:09:17', '2025-05-13 09:09:17'),
(32, 35, 41, 'Isopure 100% Whey Protein Isolate, 2 kg (4.4 lb), Low Carb - Dutch Chocolate', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1747127459431.html\"]', '[{\"value\": \"26 g\", \"nutrients\": \"Protein \"}]', '[{\"body\": \"Heding, Body Text\", \"heading\": \"Details heading\"}]', '[{\"table\": [{\"for\": \"For\", \"value\": \"Value\"}], \"title\": \"General Traits\"}]', '[{\"value\": \"119 kcal per serving\", \"nutrients\": \"Energy\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1747127583907.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1747127587341.jpeg\"]', '{\"body\": \"Body text\", \"heading\": \"Details heading\"}', 0, '[{\"id\": 1, \"mrp\": \"7999\", \"date\": \"2025-05-16T17:41\", \"stock\": \"6\", \"units\": \"1 kg\", \"flavor\": [\"Low carb Dutch Chocolate\", \"Mocha Coffee\", \"\"], \"premiumPrice\": \"5299\", \"sellingPrice\": \"5499\"}]', '2025-05-13 09:13:20', '2025-05-13 09:13:20'),
(33, 33, 38, 'testing parth', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1747136928336.png\"]', '[{\"value\": \"Quas a nesciunt vol\", \"nutrients\": \"Facere nemo ducimus\"}]', '[{\"body\": \"Dolor quidem nostrud\", \"heading\": \"Commodo nesciunt ve\"}]', '[{\"table\": [{\"for\": \"Pariatur Voluptatem\", \"value\": \"Ad ut pariatur Magn\"}], \"title\": \"Quasi porro accusamu\"}]', '[{\"value\": \"Laboris optio volup\", \"nutrients\": \"Minim maiores repell\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1747136955507.png\"]', '[\"https://bignlean-api.synoventum.site//uploads/1747136967227.png\"]', '{\"body\": \"Amet in dolores nul\", \"heading\": \"Ipsum voluptas magn\"}', 0, '[{\"id\": 1, \"mrp\": \"\", \"date\": \"\", \"stock\": \"\", \"units\": \"\", \"flavor\": [\"\"], \"premiumPrice\": \"\", \"sellingPrice\": \"\"}]', '2025-05-13 11:49:29', '2025-05-13 11:49:29'),
(34, 37, 43, 'GNC Creatine Monohydrate ', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1747220128644.jpg\", \"https://bignlean-api.synoventum.site//uploads/1747220132729.jpg\", \"https://bignlean-api.synoventum.site//uploads/1747220136376.jpg\", \"https://bignlean-api.synoventum.site//uploads/1747220140166.jpg\", \"https://bignlean-api.synoventum.site//uploads/1747220143277.jpg\", \"https://bignlean-api.synoventum.site//uploads/1747220146557.jpg\", \"https://bignlean-api.synoventum.site//uploads/1747220150072.jpg\"]', '[{\"value\": \"3gm Per Serving \", \"nutrients\": \"Creatine\"}, {\"value\": \"30 Cal Per Serving \", \"nutrients\": \"Calories \"}, {\"value\": \"83\", \"nutrients\": \"Serving Per Container \"}, {\"value\": \"250gm \", \"nutrients\": \"Size \"}]', '[{\"body\": \"Creatine has become one of the most popular sports supplements among professional and amateur athletes. Each serving supplies 3 grams of Creatine Monohydrate. Manufactured with unsurpassed quality control to ensure purity, potency and freshness. This flavourless powder blends easily with any beverage or sports drink.\\n\\nBenefits\\nIn the body, creatine is converted to creatine phosphate, which helps to fuel skeletal muscles and provides support for immediate energy production during high-intensity workouts.\\nCreatine supplementation may help to promote cellular hydration.\\nCreatine has also been shown in numerous studies to help improve athletic performance.\\n\\nIngredients\\nCreatine Monohydrate\\n\\nUsage\\nMix 3g with 200ml of water or your favourite sports drink immediately following your workout. Consume an ample amount of water while taking this product.\", \"heading\": \"Description\"}]', '[{\"table\": [{\"for\": \"For \", \"value\": \"Value \"}], \"title\": \"General Traits \"}, {\"table\": [{\"for\": \"For2\", \"value\": \"Value2\"}], \"title\": \"General Traits 2 \"}, {\"table\": [{\"for\": \"For3\", \"value\": \"Value3\"}], \"title\": \"General Traits 3\"}]', '[{\"value\": \"18.71\", \"nutrients\": \"Energy\"}, {\"value\": \"0.00\", \"nutrients\": \"Total Fat\"}, {\"value\": \"0.00\", \"nutrients\": \"Trans Fat \"}, {\"value\": \"3.23gm /Ser\", \"nutrients\": \"Carbohydrate \"}, {\"value\": \"0.00\", \"nutrients\": \"Total Sugar\"}, {\"value\": \"3gm\", \"nutrients\": \"Creatine\"}, {\"value\": \"0.00\", \"nutrients\": \"Protein \"}, {\"value\": \"0.00mg\", \"nutrients\": \"Sodium\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1747220690888.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1747220711205.jpg\"]', '{\"body\": \"ABC\", \"heading\": \"GNC Creatine Monohydrate \"}', 0, '[{\"id\": 1, \"mrp\": \"1699\", \"date\": \"2025-05-31T16:27\", \"stock\": \"6\", \"units\": \"250gm\", \"flavor\": [\"Unflavored \", \"\"], \"premiumPrice\": \"1200\", \"sellingPrice\": \"1250\"}, {\"id\": 2, \"mrp\": \"899\", \"date\": \"2025-05-31T16:28\", \"stock\": \"6\", \"units\": \"100gm\", \"flavor\": [\"Unflavored \", \"\"], \"premiumPrice\": \"499\", \"sellingPrice\": \"599\"}]', '2025-05-14 11:06:12', '2025-05-14 11:15:01'),
(35, 39, 45, 'Rule1 Collagen Protein 20 Serving', 0, 0, '[\"https://bignlean-api.synoventum.site//uploads/1751004729032.jpg\", \"https://bignlean-api.synoventum.site//uploads/1751004741835.jpg\", \"https://bignlean-api.synoventum.site//uploads/1751004758499.jpg\", \"https://bignlean-api.synoventum.site//uploads/1751004768115.jpg\", \"https://bignlean-api.synoventum.site//uploads/1751004774539.jpg\"]', '[{\"value\": \"1\", \"nutrients\": \"Abc\"}]', '[{\"body\": \"Anytime Use\\nCollagen Peptides can be used any time. Simply add a scoop or two to any of your favorite hot or cold beverages, liquids like soups or sauces, or semi-solid foods including oatmeal, puddings, or stews. \\nMixing Directions \\nMix one (1) or two (2) scoops into 8-12 oz. of your favorite hot or cold beverage and stir until completely dissolved.\\n\\n\\n\\nClean Formation \\n\\nOur Collagen Peptides are free of dairy, gluten, and added sugars, which makes them suitable for a wide variety of eating plans. \\n \\n10g collagen†\\n80mg Hyaluronic Acid†\\n100% Daily Value for Vitamin C†\\nSweetened with stevia (flavored varieties only)\\nInstantized for easy mixing \\n \\nAvailable in easy-to-drink flavored and add-to-anything unflavored varieties, Collagen Peptides mix easily into your favorite hot or cold liquids.†\\n \", \"heading\": \"Nutrition Overview\"}]', '[{\"table\": [{\"for\": \"Z\", \"value\": \"V\"}], \"title\": \"Abc\"}]', '[{\"value\": \"V\", \"nutrients\": \"C\"}]', '[\"https://bignlean-api.synoventum.site//uploads/1751005027618.jpg\"]', '[\"https://bignlean-api.synoventum.site//uploads/1751005032300.pages\"]', '{\"body\": \"Rushab export\\nGujrat\", \"heading\": \"Musclekart \"}', 0, '[{\"id\": 1, \"mrp\": \"7999\", \"date\": \"2027-06-27T11:43\", \"stock\": \"6\", \"units\": \"300gm\", \"flavor\": [\"Peach Mango\"], \"premiumPrice\": \"5499\", \"sellingPrice\": \"5999\"}]', '2025-06-27 06:17:14', '2025-06-27 06:17:14');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `product` int NOT NULL,
  `images` json DEFAULT NULL,
  `rate` float NOT NULL,
  `tasteRate` float NOT NULL,
  `mixabilityRate` float NOT NULL,
  `efficacyRate` float NOT NULL,
  `valueForMoneyRate` float NOT NULL,
  `review` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `user`, `product`, `images`, `rate`, `tasteRate`, `mixabilityRate`, `efficacyRate`, `valueForMoneyRate`, `review`, `createdAt`, `updatedAt`) VALUES
(1, 1, 13, NULL, 5, 3, 4, 4, 4, '', '2024-07-27 08:24:20', '2024-07-27 08:24:20'),
(2, 7, 13, NULL, 2, 2, 2, 2, 2, 'nice', '2024-08-05 18:35:36', '2024-08-05 18:35:36');

-- --------------------------------------------------------

--
-- Table structure for table `recentSerches`
--

CREATE TABLE `recentSerches` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `query` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refers`
--

CREATE TABLE `refers` (
  `id` int NOT NULL,
  `referTo` int NOT NULL,
  `referBy` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refers`
--

INSERT INTO `refers` (`id`, `referTo`, `referBy`, `createdAt`, `updatedAt`) VALUES
(11, 69, 40, '2025-05-03 06:21:04', '2025-05-03 06:21:04'),
(12, 67, 68, '2025-07-04 07:43:49', '2025-07-04 07:43:49'),
(15, 11, 7, '2025-07-04 07:43:49', '2025-07-04 07:43:49');

-- --------------------------------------------------------

--
-- Table structure for table `subCategories`
--

CREATE TABLE `subCategories` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `catId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subCategories`
--

INSERT INTO `subCategories` (`id`, `name`, `catId`, `createdAt`, `updatedAt`) VALUES
(1, 'test', 1, '2024-07-11 10:34:58', '2024-07-11 10:34:58'),
(4, 'test', 4, '2024-07-13 06:46:26', '2024-07-13 06:46:26'),
(5, 'Test SubCategory', 6, '2024-07-14 05:27:32', '2024-07-14 05:27:32'),
(6, 'Test SubCategory 2', 6, '2024-07-14 05:27:41', '2024-07-14 05:27:41'),
(7, 'Test Sub Cat', 7, '2024-07-15 11:42:42', '2024-07-15 11:42:42'),
(8, 'Whey Protein', 8, '2024-07-16 06:53:53', '2024-07-16 06:53:53'),
(9, 'Whey Concentrate', 8, '2024-07-16 06:54:12', '2024-07-16 06:54:12'),
(10, 'Whey Isolate', 8, '2024-07-16 06:54:29', '2024-07-16 06:54:29'),
(11, 'Isolate Protein', 9, '2024-07-16 07:33:24', '2024-07-16 07:33:24'),
(12, 'Whey Protein', 10, '2024-07-16 14:34:21', '2024-07-16 14:34:21'),
(13, 'Whey Concentrate', 10, '2024-07-16 14:34:42', '2024-07-16 14:34:42'),
(14, 'Whey Isolate', 10, '2024-07-16 14:34:45', '2024-07-16 14:34:45'),
(15, 'Whey Protein', 11, '2024-07-26 12:03:30', '2024-07-26 12:03:30'),
(16, 'Whey Concentrate', 11, '2024-07-26 12:03:35', '2024-07-26 12:03:35'),
(17, 'Whey Isolate', 11, '2024-07-26 12:03:46', '2024-07-26 12:03:46'),
(19, 'Whey Isolate', 12, '2024-07-27 07:15:43', '2024-07-27 07:15:43'),
(20, 'Whey Protein', 12, '2024-07-27 07:16:42', '2024-07-27 07:16:42'),
(21, 'Creatine', 12, '2024-07-27 07:16:54', '2024-07-27 07:16:54'),
(22, 'test sub cat', 13, '2024-07-27 08:03:33', '2024-07-27 08:03:33'),
(23, 'Creatine Monohydrate', 14, '2024-07-27 08:10:38', '2024-07-27 08:10:38'),
(24, 'Whey Protein', 15, '2024-08-16 10:48:02', '2024-08-16 10:48:02'),
(25, 'Whey Concentrate', 15, '2024-08-16 10:48:05', '2024-08-16 10:48:05'),
(26, 'Whey Isolate', 15, '2024-08-16 10:48:08', '2024-08-16 10:48:08'),
(27, 'Isolate Protein', 16, '2024-09-09 08:23:26', '2024-09-09 08:23:26'),
(28, '100% Whey ', 17, '2024-09-10 10:11:38', '2024-09-10 10:11:38'),
(30, 'Intra-Workout', 18, '2024-09-11 08:24:02', '2024-09-11 08:24:02'),
(31, 'Isolate Proteins ', 19, '2024-09-15 13:52:55', '2024-09-15 13:52:55'),
(32, 'Whey Protein', 19, '2024-09-18 05:30:54', '2024-09-18 05:30:54'),
(33, 'Test sub', 20, '2024-10-01 11:43:22', '2024-10-01 11:43:22'),
(34, 'Whey Protein blend', 21, '2025-01-31 20:07:03', '2025-01-31 20:07:03'),
(35, 'Whey ', 22, '2025-03-09 14:44:17', '2025-03-09 14:44:17'),
(36, 'Whey Protein', 23, '2025-03-18 16:38:46', '2025-03-18 16:38:46'),
(37, 'ISOPURE BRAND ISOLATE PROTEIN', 24, '2025-03-19 20:53:38', '2025-03-19 20:53:38'),
(38, 'BCAA', 33, '2025-03-20 09:59:11', '2025-03-20 09:59:11'),
(39, 'Test cat sub', 34, '2025-04-29 07:27:53', '2025-04-29 07:27:53'),
(40, 'Isolate Whey', 35, '2025-05-13 08:29:36', '2025-05-13 08:29:36'),
(41, 'Collagen', 35, '2025-05-13 09:02:09', '2025-05-13 09:02:09'),
(42, 'GNC Creatine SUb Category', 36, '2025-05-14 10:52:59', '2025-05-14 10:52:59'),
(43, '14 May Sub Category ', 37, '2025-05-14 10:54:29', '2025-05-14 10:54:29'),
(44, 'Whey isolate', 38, '2025-05-17 13:47:42', '2025-05-17 13:47:42'),
(45, 'Collagen Powder', 39, '2025-06-27 06:10:34', '2025-06-27 06:10:34'),
(46, 'testing subcat by parth', 40, '2025-06-27 10:52:07', '2025-06-27 10:52:07');

-- --------------------------------------------------------

--
-- Table structure for table `subcriptionBanners`
--

CREATE TABLE `subcriptionBanners` (
  `id` int NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscribes`
--

CREATE TABLE `subscribes` (
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `plan` int NOT NULL,
  `purchaseAt` datetime NOT NULL,
  `expireAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Transactions`
--

CREATE TABLE `Transactions` (
  `id` int NOT NULL,
  `user` int NOT NULL,
  `orderId` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('in','out') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bglCash` int NOT NULL DEFAULT '0',
  `dob` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `height` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `referCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `otp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otpExpiry` datetime DEFAULT NULL,
  `firebaseUid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `googleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facebookId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isBlocked` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `image`, `name`, `phone`, `email`, `gender`, `bglCash`, `dob`, `height`, `weight`, `referCode`, `createdAt`, `updatedAt`, `otp`, `otpExpiry`, `firebaseUid`, `googleId`, `facebookId`, `isBlocked`) VALUES
(1, NULL, NULL, '7738540986', NULL, NULL, 0, NULL, NULL, NULL, 'BGL795308', '2024-07-16 06:36:00', '2024-07-16 06:36:00', NULL, NULL, NULL, NULL, NULL, 0),
(2, NULL, NULL, '9399369854', NULL, NULL, 0, NULL, NULL, NULL, 'BGL752549', '2024-07-16 06:38:28', '2024-07-16 06:38:28', NULL, NULL, NULL, NULL, NULL, 0),
(3, NULL, NULL, '8452010341', NULL, NULL, 0, NULL, NULL, NULL, 'BGL300854', '2024-07-16 13:18:31', '2024-07-16 13:18:31', NULL, NULL, NULL, NULL, NULL, 0),
(4, NULL, 'Mervin Agera', '8655997455', 'mervinrayon@gmail.com', 'TFDHSHSXXX', 0, '', NULL, NULL, 'BGL358576', '2024-07-16 15:47:14', '2025-06-19 08:41:16', '6729', '2025-06-19 08:46:16', NULL, NULL, NULL, 0),
(5, NULL, NULL, '8287413509', NULL, NULL, 0, NULL, NULL, NULL, 'BGL631610', '2024-07-23 15:39:13', '2024-07-23 15:39:13', NULL, NULL, NULL, NULL, NULL, 0),
(6, NULL, 'Nupur kadam', '9321725649', 'nupurkadam2001@gmail.com', 'female ', 0, '2001-09-22', NULL, NULL, 'BGL613229', '2024-07-29 07:25:51', '2024-07-29 07:38:19', NULL, NULL, NULL, NULL, NULL, 0),
(7, 'https://bignlean-api.synoventum.site//uploads/1723548165517.png', 'Ankit', '8295451564', 'dev98ankit@gmail.com', 'Male', 0, '2024-08-01', NULL, NULL, 'BGL217703', '2024-07-29 13:50:22', '2024-08-13 11:22:45', NULL, NULL, NULL, NULL, NULL, 0),
(8, NULL, NULL, '9757484672', NULL, NULL, 0, NULL, NULL, NULL, 'BGL416896', '2024-08-06 10:29:39', '2024-08-06 10:29:39', NULL, NULL, NULL, NULL, NULL, 0),
(9, NULL, NULL, '9399369890', NULL, NULL, 0, NULL, NULL, NULL, 'BGL757976', '2024-08-14 06:54:06', '2024-08-14 06:54:06', NULL, NULL, NULL, NULL, NULL, 0),
(10, NULL, NULL, '8424894992', NULL, NULL, 0, NULL, NULL, NULL, 'BGL894559', '2024-08-14 12:13:54', '2024-08-14 12:13:54', NULL, NULL, NULL, NULL, NULL, 0),
(11, 'https://bignlean-api.synoventum.site//uploads/1746712584372.jpeg', 'Sid', '9321257310', '', '', 0, '', NULL, NULL, 'BGL610832', '2024-08-29 07:37:13', '2025-06-27 06:19:00', '4613', '2025-06-27 06:24:00', NULL, NULL, NULL, 0),
(33, NULL, NULL, '9551276853', NULL, NULL, 0, NULL, NULL, NULL, 'BGL342981', '2025-05-14 06:15:10', '2025-05-14 06:18:21', '6961', '2025-05-14 06:23:21', NULL, NULL, NULL, 0),
(34, NULL, 'Abhiram Katar', '9893009058', 'abhiram.kathar@gmail.com', 'Male', 0, '', NULL, NULL, 'BGL606047', '2025-05-14 07:23:52', '2025-05-14 07:26:19', '1010', '2025-05-14 07:30:01', NULL, NULL, NULL, 0),
(35, NULL, NULL, '7211121353', NULL, NULL, 0, NULL, NULL, NULL, 'BGL778700', '2025-05-15 11:35:07', '2025-05-19 00:26:22', '4886', '2025-05-19 00:31:22', NULL, NULL, NULL, 0),
(36, NULL, NULL, '7621840327', NULL, NULL, 0, NULL, NULL, NULL, 'BGL357882', '2025-05-15 11:36:41', '2025-05-15 12:08:15', '5114', '2025-05-15 12:13:15', NULL, NULL, NULL, 0),
(37, NULL, NULL, '6359575016', NULL, NULL, 0, NULL, NULL, NULL, 'BGL272407', '2025-05-15 13:09:46', '2025-07-04 09:26:39', '9421', '2025-07-04 09:31:39', NULL, NULL, NULL, 0),
(38, NULL, NULL, '6359575015', NULL, NULL, 0, NULL, NULL, NULL, 'BGL885512', '2025-05-19 00:06:54', '2025-05-19 00:06:54', '7254', '2025-05-19 00:11:54', NULL, NULL, NULL, 0),
(39, NULL, NULL, '8466952410', NULL, NULL, 0, NULL, NULL, NULL, 'BGL656232', '2025-05-29 11:22:41', '2025-05-29 11:22:41', '4507', '2025-05-29 11:27:41', NULL, NULL, NULL, 0),
(40, 'https://bignlean-api.synoventum.site//uploads/1749206342082.png', 'Tester Parths', '7698602829', 'parth@gmail.com', 'Male ', 0, '2000-03-31', 5.9, 60, 'BGL431407', '2025-06-03 12:28:49', '2025-07-04 09:48:57', '6550', '2025-07-04 09:53:57', NULL, NULL, NULL, 0),
(41, NULL, NULL, '9104736622', NULL, NULL, 0, NULL, NULL, NULL, 'BGL605985', '2025-06-03 12:46:44', '2025-06-03 12:46:44', '7274', '2025-06-03 12:51:44', NULL, NULL, NULL, 0),
(53, NULL, NULL, '8849285987', NULL, NULL, 0, NULL, NULL, NULL, 'BGL319808', '2025-06-15 07:25:27', '2025-06-19 07:44:57', '8059', '2025-06-19 07:49:57', NULL, NULL, NULL, 0),
(66, NULL, NULL, '8424003999', NULL, NULL, 0, NULL, NULL, NULL, 'BGL620769', '2025-06-26 13:55:13', '2025-06-26 13:55:13', '4519', '2025-06-26 14:00:13', NULL, NULL, NULL, 0),
(67, 'https://lh3.googleusercontent.com/a/ACg8ocJJs6ZiPKgMOghTM98CWH_B1Pw2VJOwqGq0UG384Ugzsd9SUg=s96-c', 'Parth Shah', 'SOCIAL-G-1751020882195', 'parthshahmukesh@gmail.com', NULL, 0, NULL, NULL, NULL, 'BGL647201', '2025-06-27 10:41:22', '2025-06-27 10:41:22', NULL, NULL, 'NrHBqWz133PYWX1Rx8oHuntq7w33', NULL, NULL, 0),
(68, 'https://lh3.googleusercontent.com/a/ACg8ocKQc7Bnoa4ARLBJXSXJVRrp9F7v3M2gnPobJ-0M3n5qAjDeLcY=s96-c', 'Shez Sh', 'SOCIAL-G-1751021230481', 'siddheshehnaz@gmail.com', NULL, 0, NULL, NULL, NULL, 'BGL399720', '2025-06-27 10:47:10', '2025-06-27 10:47:10', NULL, NULL, '37LAgaUJ8TSaV0pS3AIk9ce6ebS2', NULL, NULL, 0),
(69, 'https://graph.facebook.com/122105857256906507/picture', 'Siddhesh Valanju', 'SOCIAL-F-1751022132794', 'siddhesh.valanju@live.com', NULL, 0, NULL, NULL, NULL, 'BGL536163', '2025-06-27 11:02:12', '2025-06-27 11:02:12', NULL, NULL, 'cHuYaarcA8b5SK5Qh7kkxoDLZ9L2', NULL, NULL, 0),
(70, NULL, NULL, '63595750-6', NULL, NULL, 0, NULL, NULL, NULL, 'BGL701674', '2025-06-28 11:42:50', '2025-07-04 05:00:58', NULL, NULL, NULL, NULL, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aboutFitnesses`
--
ALTER TABLE `aboutFitnesses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comboCategories`
--
ALTER TABLE `comboCategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `combos`
--
ALTER TABLE `combos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comboSubCategories`
--
ALTER TABLE `comboSubCategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contactLeads`
--
ALTER TABLE `contactLeads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupon` (`coupon`);

--
-- Indexes for table `deals`
--
ALTER TABLE `deals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gymGuides`
--
ALTER TABLE `gymGuides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notificationSchedules`
--
ALTER TABLE `notificationSchedules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recentSerches`
--
ALTER TABLE `recentSerches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `refers`
--
ALTER TABLE `refers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subCategories`
--
ALTER TABLE `subCategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subcriptionBanners`
--
ALTER TABLE `subcriptionBanners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscribes`
--
ALTER TABLE `subscribes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `firebaseUid` (`firebaseUid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aboutFitnesses`
--
ALTER TABLE `aboutFitnesses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comboCategories`
--
ALTER TABLE `comboCategories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `combos`
--
ALTER TABLE `combos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `comboSubCategories`
--
ALTER TABLE `comboSubCategories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contactLeads`
--
ALTER TABLE `contactLeads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `deals`
--
ALTER TABLE `deals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `gymGuides`
--
ALTER TABLE `gymGuides`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notificationSchedules`
--
ALTER TABLE `notificationSchedules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `recentSerches`
--
ALTER TABLE `recentSerches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refers`
--
ALTER TABLE `refers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `subCategories`
--
ALTER TABLE `subCategories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `subcriptionBanners`
--
ALTER TABLE `subcriptionBanners`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `subscribes`
--
ALTER TABLE `subscribes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

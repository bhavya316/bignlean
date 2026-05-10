-- SQL to create comboProducts table with correct schema
-- Run this in your MySQL database (bignlean database)

DROP TABLE IF EXISTS `comboProducts`;

CREATE TABLE `comboProducts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `catId` int NOT NULL,
  `comboCatId` int NOT NULL,
  `subCatId` int NOT NULL,
  `subCatId2` int DEFAULT NULL,
  `brandId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `isBestSeller` tinyint(1) NOT NULL DEFAULT '0',
  `isOnFlashSale` tinyint(1) NOT NULL DEFAULT '0',
  `images` json DEFAULT ('[]'),
  `overView` json DEFAULT ('[]'),
  `details` json DEFAULT ('[]'),
  `tables` json DEFAULT ('[]'),
  `information` json DEFAULT ('[]'),
  `certificates` json DEFAULT ('[]'),
  `supplements` json DEFAULT ('[]'),
  `brand` json DEFAULT ('{}'),
  `hit` int NOT NULL DEFAULT '0',
  `varients` json NOT NULL,
  `expiry_date` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
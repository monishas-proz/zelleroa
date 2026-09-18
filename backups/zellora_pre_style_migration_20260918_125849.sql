-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: zellora
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('099fa805-6c46-43ef-8589-00fb7d20a011','ea3429c799c885155db7186580fd96a5e114f55ce0a148a7768d8fc01bdeda92','2026-09-16 11:10:45.738','20260916111045_add_color_size_price_adjustments',NULL,NULL,'2026-09-16 11:10:45.488',1),('2766979c-e94e-4e62-9eb4-5f99ab2a2aff','3ed8490e7a0393dbe479ff334a160ba3c307ce9ee495c056cf23a9a2b1c6edf1','2026-09-15 08:31:58.963','20260818100000_baseline',NULL,NULL,'2026-09-15 08:31:38.340',1),('57545f41-f01f-4982-88e7-4a888c631c14','1c9ede9b9630952c2c56b4c451964f52d800f58fcf231c330a51d061168d5ac9','2026-09-15 08:31:59.398','20260908140000_add_faq_icon',NULL,NULL,'2026-09-15 08:31:59.386',1),('5a6735ea-f610-4bf5-92d3-9dd228986f7c','6aa43f18f2b37b0943aa91427e54137c5264b47a1affc98625428bfefa600650','2026-09-17 16:32:13.975','20260917100000_add_agent_referral_attribution',NULL,NULL,'2026-09-17 16:32:06.283',1),('6194f55d-c648-4686-ac23-b2481f416071','d709db773390c49f319ee02d5c86878eb7dc5c1826796194ea5b841af1df1f73','2026-09-15 08:31:59.157','20260907000000_add_product_uuid_category_indexes',NULL,NULL,'2026-09-15 08:31:58.988',1),('69ddcb32-d9b0-4896-840a-eb8f5a31dec1','e93e9fcc735d121cb26b60833245839a0f0269b67ac96f083d7af6179972f262','2026-09-15 08:31:58.986','20260818120000_hash_registration_otp',NULL,NULL,'2026-09-15 08:31:58.967',1),('9778ac66-0589-4dae-be4e-b57c1b6173fa','7c8d1af54a429b6d2f732542162ae1f51479ce4ef3c90d8ec5f39b956fb30e76','2026-09-15 12:03:30.023','20260915120321_add_product_gender_and_size_charts','',NULL,'2026-09-15 12:03:30.023',0),('c82109ad-2cfa-4cd6-bc34-89ac1efe1ce4','a70f3dc00b586e6665c36f2b7725f71d1af05d6135679b716a0e2c47d2522170','2026-09-15 08:35:28.968','20260915083520_add_variant_attributes_offer_coupon_restrictions_inventory_reservations','',NULL,'2026-09-15 08:35:28.968',0),('d7a505da-d0e6-4ffb-876c-5aa1fd80f3a0','12e5472478707f7f93b303ae30c7892879391c1ddcf08309a505ee4d5b134663','2026-09-15 08:31:59.358','20260908000000_offer_management',NULL,NULL,'2026-09-15 08:31:59.160',1),('e2dd7c13-19b3-479d-be1e-f3ac2d4ba6f3','6b9c68e021879d25f20fa01db6efeee7fd9f117f00f59993c426f6ab7036dfb5','2026-09-15 08:31:59.383','20260908120000_add_faq_indexes',NULL,NULL,'2026-09-15 08:31:59.359',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attribute_value_dependencies`
--

DROP TABLE IF EXISTS `attribute_value_dependencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute_value_dependencies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attribute_value_id` bigint unsigned NOT NULL,
  `depends_on_value_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_attr_value_dependency` (`attribute_value_id`,`depends_on_value_id`),
  KEY `fk_avd_child` (`attribute_value_id`),
  KEY `fk_avd_parent` (`depends_on_value_id`),
  CONSTRAINT `fk_avd_child` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_avd_parent` FOREIGN KEY (`depends_on_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_value_dependencies`
--

LOCK TABLES `attribute_value_dependencies` WRITE;
/*!40000 ALTER TABLE `attribute_value_dependencies` DISABLE KEYS */;
INSERT INTO `attribute_value_dependencies` VALUES (1,16,26,'2026-09-17 03:28:00'),(2,13,24,'2026-09-17 03:28:00');
/*!40000 ALTER TABLE `attribute_value_dependencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attribute_values`
--

DROP TABLE IF EXISTS `attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attribute_id` bigint unsigned NOT NULL,
  `value` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `price_adjustment` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk_attribute_values_created_by` (`created_by`),
  KEY `fk_attribute_values_updated_by` (`updated_by`),
  KEY `fk_attrval_attr` (`attribute_id`),
  CONSTRAINT `fk_attribute_values_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_attribute_values_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_attrval_attr` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_values`
--

LOCK TABLES `attribute_values` WRITE;
/*!40000 ALTER TABLE `attribute_values` DISABLE KEYS */;
INSERT INTO `attribute_values` VALUES (1,1,'S','2026-09-15 03:27:07','2026-09-15 03:27:07',1,1,1,'cdac8939-d76e-4bc0-97d1-365f9417b401',0.00),(2,1,'M','2026-09-15 03:27:07','2026-09-15 03:27:07',1,1,1,'4c1ec8fc-2ca7-485a-a485-dcf62b8f6da6',0.00),(3,1,'L','2026-09-15 03:27:07','2026-09-15 03:27:07',1,1,1,'1ba1463a-151d-45da-aebf-eb5818b7a4f0',0.00),(4,2,'M','2026-09-15 06:48:29','2026-09-15 06:48:29',1,1,1,'dbcfcc33-c3cc-4d82-946e-84688a2ebc79',0.00),(5,2,'L','2026-09-15 06:48:29','2026-09-15 06:48:29',1,1,1,'a88afc9f-5040-48d7-93c3-1d2079ac2631',0.00),(6,3,'L','2026-09-15 08:26:42','2026-09-15 08:26:42',1,1,1,'42066ecc-3128-41de-b327-f7cdc97cbb25',0.00),(7,3,'S','2026-09-15 08:26:42','2026-09-15 08:26:42',1,1,1,'23402e30-7a40-486a-9b2a-eac9be51dc55',0.00),(8,3,'M','2026-09-15 08:26:42','2026-09-15 08:26:42',1,1,1,'c269c7c2-7091-462e-8c41-91ef89983a6c',0.00),(9,3,'XL','2026-09-15 08:26:42','2026-09-15 08:26:42',1,1,1,'aa2cb150-68a3-471b-aa95-03c7ac1ed6d0',0.00),(10,4,'M','2026-09-15 08:41:46','2026-09-15 08:41:46',1,1,1,'3620a115-1dad-4206-b475-03237cebb915',0.00),(11,4,'L','2026-09-15 08:41:46','2026-09-15 08:41:46',1,1,1,'ec7c1360-5423-4e9d-9b45-da8abd4f304e',0.00),(12,16,'M','2026-09-16 03:57:53','2026-09-16 03:57:53',1,1,1,'ed47ee4f-499f-4219-8099-5d65d07f653b',0.00),(13,16,'S','2026-09-16 03:57:53','2026-09-16 03:57:53',1,1,1,'3e0481ea-9546-4535-b185-63727a28fe16',0.00),(14,16,'L','2026-09-16 03:57:53','2026-09-16 03:57:53',1,1,1,'67bd5cf1-2d51-4fe9-b41f-4d2b97026c80',50.00),(15,16,'XS','2026-09-16 03:57:53','2026-09-16 03:57:53',1,1,1,'9be1e3ca-cd99-45eb-815e-b9d018e32931',0.00),(16,16,'XL','2026-09-16 03:57:53','2026-09-16 03:57:53',1,1,1,'8993199c-bcbf-472c-a5db-4a319eaff234',0.00),(17,16,'XXL','2026-09-16 03:57:53','2026-09-16 03:57:53',1,1,1,'9dd4ca15-eaa7-422a-b92e-dcd972af4b8a',0.00),(18,17,'S','2026-09-16 03:59:57','2026-09-16 03:59:57',1,1,1,'4305ea70-445d-4fab-a1c2-4aafa232b7b2',0.00),(19,17,'M','2026-09-16 03:59:57','2026-09-16 03:59:57',1,1,1,'aa0f38ec-ac5f-4627-892f-6d8e654f7bf1',0.00),(20,17,'L','2026-09-16 03:59:57','2026-09-16 03:59:57',1,1,1,'fbb82ec6-514a-430d-8b09-3e542b49a51d',0.00),(21,17,'XS','2026-09-16 03:59:57','2026-09-16 03:59:57',1,1,1,'42a5028b-1692-4d1d-8a0a-2a46702805cb',0.00),(22,17,'XL','2026-09-16 03:59:57','2026-09-16 03:59:57',1,1,1,'5db5c8a0-4291-44f5-9f19-9c6cc32147c1',0.00),(23,17,'XXL','2026-09-16 03:59:57','2026-09-16 03:59:57',1,1,1,'8a52073a-2c9b-488c-975f-02e33558fecb',0.00),(24,5,'Black','2026-09-17 02:52:26','2026-09-17 02:52:26',1,NULL,NULL,'e280f7f3-1413-4ad9-9353-4e5707b8923f',0.00),(25,5,'White','2026-09-17 02:52:26','2026-09-17 02:52:26',1,NULL,NULL,'bd0eb358-21b0-405e-935a-18d00529e08e',0.00),(26,5,'Blue','2026-09-17 02:52:26','2026-09-17 02:52:26',1,NULL,1,'95df8a53-554b-4033-b975-f8dd996adbf6',0.00);
/*!40000 ALTER TABLE `attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `table_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `record_id` bigint unsigned NOT NULL,
  `action` enum('create','update','delete') COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_audit_logs_created_by` (`created_by`),
  KEY `fk_audit_logs_updated_by` (`updated_by`),
  KEY `fk_auditlog_user` (`user_id`),
  KEY `idx_audit_table_record` (`table_name`,`record_id`),
  CONSTRAINT `fk_audit_logs_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_audit_logs_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_auditlog_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banner_positions`
--

DROP TABLE IF EXISTS `banner_positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner_positions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_banner_positions_slug` (`slug`),
  KEY `fk_banner_positions_created_by` (`created_by`),
  KEY `fk_banner_positions_updated_by` (`updated_by`),
  CONSTRAINT `fk_banner_positions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_banner_positions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banner_positions`
--

LOCK TABLES `banner_positions` WRITE;
/*!40000 ALTER TABLE `banner_positions` DISABLE KEYS */;
INSERT INTO `banner_positions` VALUES (1,'dc741205-5c0f-4150-a7f0-ea3dafcde28f','Home Hero Banner','home-hero','home','2026-09-15 03:25:14','2026-09-15 03:25:14',1,1,1),(2,'69b13d06-9caa-4ae5-9323-78860b497357','Home Offer Banner','home-offer','home','2026-09-15 03:25:14','2026-09-15 03:25:14',1,1,1),(3,'9c7e05bb-8d21-4f38-816a-329d4db6a6d9','Home Popup Offer','home-popup-offer','home','2026-09-15 03:25:14','2026-09-15 03:25:14',1,1,1),(4,'5c4556b7-8fb5-4669-a378-a097439b2fa9','Home Reels','home-reels','home','2026-09-15 03:25:14','2026-09-15 03:25:14',1,1,1);
/*!40000 ALTER TABLE `banner_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `banner_position_id` bigint unsigned NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `media_type` enum('image','video') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'image',
  `video_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_banner_position` (`banner_position_id`),
  KEY `fk_banners_created_by` (`created_by`),
  KEY `fk_banners_updated_by` (`updated_by`),
  CONSTRAINT `fk_banner_position` FOREIGN KEY (`banner_position_id`) REFERENCES `banner_positions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_banners_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_banners_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_categories`
--

DROP TABLE IF EXISTS `blog_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(170) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_blog_categories_slug` (`slug`),
  KEY `fk_blog_categories_created_by` (`created_by`),
  KEY `fk_blog_categories_updated_by` (`updated_by`),
  CONSTRAINT `fk_blog_categories_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blog_categories_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_categories`
--

LOCK TABLES `blog_categories` WRITE;
/*!40000 ALTER TABLE `blog_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_comments`
--

DROP TABLE IF EXISTS `blog_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `blog_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_blog_comments_created_by` (`created_by`),
  KEY `fk_blog_comments_updated_by` (`updated_by`),
  KEY `fk_blogcomment_blog` (`blog_id`),
  KEY `fk_blogcomment_user` (`user_id`),
  CONSTRAINT `fk_blog_comments_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blog_comments_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blogcomment_blog` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blogcomment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_comments`
--

LOCK TABLES `blog_comments` WRITE;
/*!40000 ALTER TABLE `blog_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `blog_category_id` bigint unsigned DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `featured_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author_id` bigint unsigned DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_blogs_slug` (`slug`),
  KEY `fk_blog_author` (`author_id`),
  KEY `fk_blog_category` (`blog_category_id`),
  KEY `fk_blogs_created_by` (`created_by`),
  KEY `fk_blogs_updated_by` (`updated_by`),
  CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blog_category` FOREIGN KEY (`blog_category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blogs_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blogs_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bulk_order_enquiries`
--

DROP TABLE IF EXISTS `bulk_order_enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bulk_order_enquiries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID()',
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_interest` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('new','contacted','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `admin_comment` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_bulk_order_enquiries_uuid` (`uuid`),
  UNIQUE KEY `uq_bulk_order_enquiries_uuid` (`uuid`),
  KEY `fk_bulk_order_enquiries_created_by` (`created_by`),
  KEY `fk_bulk_order_enquiries_updated_by` (`updated_by`),
  CONSTRAINT `fk_bulk_order_enquiries_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bulk_order_enquiries_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulk_order_enquiries`
--

LOCK TABLES `bulk_order_enquiries` WRITE;
/*!40000 ALTER TABLE `bulk_order_enquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `bulk_order_enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `cart_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price_at_add` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned DEFAULT NULL,
  `item_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cartitem_cart_variant_unitprice` (`cart_id`,`variant_id`,`variant_unit_price_id`),
  UNIQUE KEY `uq_cartitem_cart_item_variant_unitprice` (`cart_id`,`item_id`,`variant_id`,`variant_unit_price_id`),
  KEY `fk_cart_items_created_by` (`created_by`),
  KEY `fk_cart_items_updated_by` (`updated_by`),
  KEY `fk_cartitem_cart` (`cart_id`),
  KEY `fk_cartitem_product` (`product_id`),
  KEY `fk_cartitem_variant` (`variant_id`),
  KEY `fk_cartitem_variant_unit_price` (`variant_unit_price_id`),
  KEY `fk_cartitem_item` (`item_id`),
  CONSTRAINT `fk_cart_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cart_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitem_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitem_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitem_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (2,'91bb14d6-21da-4fd8-a81d-ef695d783851',4,12,9,2,499.00,'2026-09-15 10:10:21','2026-09-17 05:59:30',0,2,2,8,12),(3,'2c4d28a9-3ba3-4444-a79c-29286a7b43db',5,13,10,1,599.00,'2026-09-15 23:18:46','2026-09-17 05:59:30',0,2,2,9,13);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `user_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coupon_id` bigint unsigned DEFAULT NULL,
  `status` enum('active','converted','abandoned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `last_activity_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_coupon` (`coupon_id`),
  KEY `fk_cart_user` (`user_id`),
  KEY `fk_carts_created_by` (`created_by`),
  KEY `fk_carts_updated_by` (`updated_by`),
  KEY `idx_cart_session` (`session_id`),
  KEY `idx_cart_status` (`status`),
  CONSTRAINT `fk_cart_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_carts_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_carts_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'91a014a7-025b-48b7-bb38-739eb5fcae01',2,NULL,NULL,'converted','2026-09-15 06:19:10','2026-09-15 06:16:44','2026-09-15 06:19:10',1,2,2),(4,'13b393f3-a4ec-467d-b9bb-05aadfe937e8',2,NULL,NULL,'converted','2026-09-15 10:10:54','2026-09-15 10:10:21','2026-09-15 10:10:54',1,2,2),(5,'b9282548-1bb8-4f63-bcb8-326bbdd79cde',2,NULL,NULL,'converted','2026-09-15 23:19:08','2026-09-15 23:18:46','2026-09-15 23:19:08',1,2,2);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_attributes`
--

DROP TABLE IF EXISTS `category_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `attribute_id` bigint unsigned NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_category_attribute` (`category_id`,`attribute_id`),
  KEY `fk_catattr_category` (`category_id`),
  KEY `fk_catattr_attribute` (`attribute_id`),
  CONSTRAINT `fk_catattr_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_catattr_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_attributes`
--

LOCK TABLES `category_attributes` WRITE;
/*!40000 ALTER TABLE `category_attributes` DISABLE KEYS */;
INSERT INTO `category_attributes` VALUES (1,1,1,0,0,'2026-09-15 03:28:28','2026-09-15 03:28:28'),(3,9,2,0,0,'2026-09-15 07:03:36','2026-09-15 07:03:36'),(4,10,3,0,0,'2026-09-15 08:26:54','2026-09-15 08:26:54'),(5,11,4,0,0,'2026-09-15 08:41:58','2026-09-15 08:41:58'),(8,16,5,0,0,'2026-09-17 00:00:38','2026-09-17 00:00:38'),(13,16,16,0,0,'2026-09-17 01:36:27','2026-09-17 01:36:27');
/*!40000 ALTER TABLE `category_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo_product_items`
--

DROP TABLE IF EXISTS `combo_product_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo_product_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `combo_product_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_combo_product_items_created_by` (`created_by`),
  KEY `fk_combo_product_items_updated_by` (`updated_by`),
  KEY `fk_comboitem_combo` (`combo_product_id`),
  KEY `fk_comboitem_product` (`product_id`),
  KEY `fk_comboitem_variant_unit_price` (`variant_unit_price_id`),
  CONSTRAINT `fk_combo_product_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_combo_product_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_comboitem_combo` FOREIGN KEY (`combo_product_id`) REFERENCES `combo_products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comboitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comboitem_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_product_items`
--

LOCK TABLES `combo_product_items` WRITE;
/*!40000 ALTER TABLE `combo_product_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `combo_product_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo_products`
--

DROP TABLE IF EXISTS `combo_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_combo_products_slug` (`slug`),
  KEY `fk_combo_products_created_by` (`created_by`),
  KEY `fk_combo_products_updated_by` (`updated_by`),
  CONSTRAINT `fk_combo_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_combo_products_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_products`
--

LOCK TABLES `combo_products` WRITE;
/*!40000 ALTER TABLE `combo_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `combo_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID()',
  `company_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'India',
  `pincode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_companies_uuid` (`uuid`),
  UNIQUE KEY `uq_companies_uuid` (`uuid`),
  KEY `fk_companies_created_by` (`created_by`),
  KEY `fk_companies_updated_by` (`updated_by`),
  CONSTRAINT `fk_companies_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_companies_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('new','read','replied') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID()',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_contact_messages_uuid` (`uuid`),
  UNIQUE KEY `uq_contact_messages_uuid` (`uuid`),
  KEY `fk_contact_messages_created_by` (`created_by`),
  KEY `fk_contact_messages_updated_by` (`updated_by`),
  CONSTRAINT `fk_contact_messages_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_contact_messages_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_categories`
--

DROP TABLE IF EXISTS `coupon_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_coupon_category` (`coupon_id`,`category_id`),
  KEY `fk_couponcat_category` (`category_id`),
  CONSTRAINT `fk_couponcat_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_couponcat_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_categories`
--

LOCK TABLES `coupon_categories` WRITE;
/*!40000 ALTER TABLE `coupon_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_products`
--

DROP TABLE IF EXISTS `coupon_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_coupon_product` (`coupon_id`,`product_id`),
  KEY `fk_couponprod_product` (`product_id`),
  CONSTRAINT `fk_couponprod_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_couponprod_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_products`
--

LOCK TABLES `coupon_products` WRITE;
/*!40000 ALTER TABLE `coupon_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_usage`
--

DROP TABLE IF EXISTS `coupon_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_usage` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `coupon_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `order_id` bigint unsigned NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `used_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_coupon_usage_created_by` (`created_by`),
  KEY `fk_coupon_usage_updated_by` (`updated_by`),
  KEY `fk_couponusage_coupon` (`coupon_id`),
  KEY `fk_couponusage_order` (`order_id`),
  KEY `fk_couponusage_user` (`user_id`),
  CONSTRAINT `fk_coupon_usage_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_coupon_usage_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_couponusage_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_couponusage_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_couponusage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_usage`
--

LOCK TABLES `coupon_usage` WRITE;
/*!40000 ALTER TABLE `coupon_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('flat','percentage') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT '0.00',
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `usage_limit_per_user` int DEFAULT '1',
  `valid_from` timestamp NULL DEFAULT NULL,
  `valid_to` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `uq_coupons_code` (`code`),
  KEY `fk_coupons_created_by` (`created_by`),
  KEY `fk_coupons_updated_by` (`updated_by`),
  CONSTRAINT `fk_coupons_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_coupons_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_addresses`
--

DROP TABLE IF EXISTS `customer_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `user_id` bigint unsigned NOT NULL,
  `cust_id` bigint DEFAULT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `landmark` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'India',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `address_type` enum('shipping','billing') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'shipping',
  PRIMARY KEY (`id`),
  KEY `fk_addr_user` (`user_id`),
  KEY `fk_customer_addresses_created_by` (`created_by`),
  KEY `fk_customer_addresses_updated_by` (`updated_by`),
  KEY `idx_addr_pincode` (`pincode`),
  CONSTRAINT `fk_addr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_customer_addresses_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_customer_addresses_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_addresses`
--

LOCK TABLES `customer_addresses` WRITE;
/*!40000 ALTER TABLE `customer_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_profiles`
--

DROP TABLE IF EXISTS `customer_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_whatsapp` tinyint(1) DEFAULT '0',
  `whatsapp_no` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image` longtext COLLATE utf8mb4_unicode_ci,
  `referral_code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referred_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `status` tinyint(1) DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_customer_profiles_user_id` (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `referral_code` (`referral_code`),
  UNIQUE KEY `uq_customer_profiles_referral_code` (`referral_code`),
  KEY `fk_cp_referrer` (`referred_by`),
  KEY `fk_customer_profiles_created_by` (`created_by`),
  KEY `fk_customer_profiles_updated_by` (`updated_by`),
  CONSTRAINT `fk_cp_referrer` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_customer_profiles_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_customer_profiles_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_profiles`
--

LOCK TABLES `customer_profiles` WRITE;
/*!40000 ALTER TABLE `customer_profiles` DISABLE KEYS */;
INSERT INTO `customer_profiles` VALUES (1,'96116c07-d1ef-439a-9a70-dc29ef88edee',1,'Admin','admin@rithusnacks.com',NULL,0,NULL,NULL,NULL,NULL,'REF52F871E949',NULL,'2026-09-15 03:25:51','2026-09-15 03:25:51',1,1,NULL,NULL),(2,'d0da1c99-15a5-44cd-bf24-bb0cae7cb8d6',2,'John Customer','customer@example.com',NULL,0,NULL,NULL,NULL,NULL,'REFA35ACCD8DE',NULL,'2026-09-15 04:05:46','2026-09-15 04:05:46',1,1,NULL,NULL);
/*!40000 ALTER TABLE `customer_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_reports`
--

DROP TABLE IF EXISTS `customer_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `report_date` date NOT NULL,
  `new_customers` int NOT NULL DEFAULT '0',
  `returning_customers` int NOT NULL DEFAULT '0',
  `generated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_date` (`report_date`),
  UNIQUE KEY `uq_customer_reports_report_date` (`report_date`),
  KEY `fk_customer_reports_created_by` (`created_by`),
  KEY `fk_customer_reports_updated_by` (`updated_by`),
  CONSTRAINT `fk_customer_reports_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_customer_reports_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_reports`
--

LOCK TABLES `customer_reports` WRITE;
/*!40000 ALTER TABLE `customer_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_partners`
--

DROP TABLE IF EXISTS `delivery_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_partners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `uq_delivery_partners_code` (`code`),
  KEY `fk_delivery_partners_created_by` (`created_by`),
  KEY `fk_delivery_partners_updated_by` (`updated_by`),
  CONSTRAINT `fk_delivery_partners_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_delivery_partners_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_partners`
--

LOCK TABLES `delivery_partners` WRITE;
/*!40000 ALTER TABLE `delivery_partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery_partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_slots`
--

DROP TABLE IF EXISTS `delivery_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_slots` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `slot_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `max_orders` int NOT NULL DEFAULT '0',
  `booked_orders` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_delivery_slots_created_by` (`created_by`),
  KEY `fk_delivery_slots_updated_by` (`updated_by`),
  KEY `idx_slot_date` (`slot_date`),
  CONSTRAINT `fk_delivery_slots_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_delivery_slots_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_slots`
--

LOCK TABLES `delivery_slots` WRITE;
/*!40000 ALTER TABLE `delivery_slots` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_faq_created_by` (`created_by`),
  KEY `fk_faq_updated_by` (`updated_by`),
  KEY `idx_faq_active_sort` (`is_active`,`sort_order`),
  KEY `idx_faq_category` (`category`),
  CONSTRAINT `fk_faq_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_faq_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventories`
--

DROP TABLE IF EXISTS `inventories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quantity_available` int NOT NULL DEFAULT '0',
  `quantity_reserved` int NOT NULL DEFAULT '0',
  `reorder_level` int NOT NULL DEFAULT '0',
  `warehouse_location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `variant_unit_price_id` (`variant_unit_price_id`),
  UNIQUE KEY `uq_inventories_variant_unit_price_id` (`variant_unit_price_id`),
  KEY `fk_inventories_created_by` (`created_by`),
  KEY `fk_inventories_updated_by` (`updated_by`),
  CONSTRAINT `fk_inv_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inventories_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_inventories_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventories`
--

LOCK TABLES `inventories` WRITE;
/*!40000 ALTER TABLE `inventories` DISABLE KEYS */;
INSERT INTO `inventories` VALUES (2,3,3,1,NULL,'2026-09-15 10:10:54','2026-09-15 15:38:14',1,NULL,NULL,8),(3,9,0,1,NULL,'2026-09-15 23:19:08','2026-09-16 04:48:23',1,NULL,NULL,9),(5,200,0,0,NULL,'2026-09-16 03:24:37','2026-09-16 03:24:37',1,NULL,NULL,11),(6,10,0,0,NULL,'2026-09-17 02:07:29','2026-09-17 02:07:29',1,1,1,12),(7,15,0,0,NULL,'2026-09-17 02:39:26','2026-09-17 02:39:26',1,1,1,13),(8,15,0,0,NULL,'2026-09-17 02:39:26','2026-09-17 02:39:26',1,1,1,14),(9,10,0,0,NULL,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,1,15),(10,10,0,0,NULL,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,1,16),(11,10,0,0,NULL,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,1,17),(12,10,0,0,NULL,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,1,18),(13,10,0,0,NULL,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,1,19),(14,10,0,0,NULL,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,1,20),(15,20,0,0,NULL,'2026-09-17 04:08:46','2026-09-17 03:28:18',1,1,1,21),(16,5,0,0,NULL,'2026-09-17 03:46:11','2026-09-17 03:46:11',1,1,1,22),(17,5,0,0,NULL,'2026-09-17 03:49:52','2026-09-17 03:49:52',1,1,1,23),(19,0,0,0,NULL,'2026-09-17 09:13:06','2026-09-17 09:13:06',1,1,1,25),(20,0,0,0,NULL,'2026-09-17 09:13:06','2026-09-17 09:13:06',1,1,1,26),(21,0,0,0,NULL,'2026-09-17 09:13:06','2026-09-17 09:13:06',1,1,1,27),(22,0,0,0,NULL,'2026-09-17 09:13:06','2026-09-17 09:13:06',1,1,1,28),(23,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,29),(24,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,30),(25,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,31),(26,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,32),(27,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,33),(28,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,34),(29,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,35),(30,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,36),(31,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,37),(32,0,0,0,NULL,'2026-09-17 09:13:07','2026-09-17 09:13:07',1,1,1,38);
/*!40000 ALTER TABLE `inventories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_reservations`
--

DROP TABLE IF EXISTS `inventory_reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_reservations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  `cart_id` bigint unsigned DEFAULT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `quantity` int NOT NULL,
  `status` enum('active','confirmed','expired','released') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_invres_vup` (`variant_unit_price_id`),
  KEY `fk_invres_cart` (`cart_id`),
  KEY `fk_invres_order` (`order_id`),
  KEY `idx_invres_status_expiry` (`status`,`expires_at`),
  CONSTRAINT `fk_invres_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_invres_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_invres_vup` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_reservations`
--

LOCK TABLES `inventory_reservations` WRITE;
/*!40000 ALTER TABLE `inventory_reservations` DISABLE KEYS */;
INSERT INTO `inventory_reservations` VALUES (3,9,5,NULL,1,'confirmed','2026-09-15 23:48:46','2026-09-15 23:18:46','2026-09-15 23:18:46');
/*!40000 ALTER TABLE `inventory_reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('in','out','reserved','released') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_inventory_transactions_updated_by` (`updated_by`),
  KEY `fk_invtx_user` (`created_by`),
  KEY `idx_invtx_variant_unit_price` (`variant_unit_price_id`),
  CONSTRAINT `fk_inventory_transactions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_invtx_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_invtx_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,'out',1,'order',1,'Order ORD-20260915-3E8F17',2,'2026-09-15 06:19:10','2026-09-15 06:19:10',1,2,4),(5,'in',200,NULL,NULL,'Initial stock on create',NULL,'2026-09-16 03:24:37','2026-09-16 03:24:37',1,NULL,11),(6,'in',10,NULL,NULL,'Initial stock on create',1,'2026-09-17 02:07:29','2026-09-17 02:07:29',1,1,12),(7,'in',15,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:39:26','2026-09-17 02:39:26',1,1,13),(8,'in',15,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:39:26','2026-09-17 02:39:26',1,1,14),(9,'in',10,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,15),(10,'in',10,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,16),(11,'in',10,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,17),(12,'in',10,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,18),(13,'in',10,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,19),(14,'in',10,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 02:54:08','2026-09-17 02:54:08',1,1,20),(15,'in',5,NULL,NULL,'Initial stock from bulk variant generation',1,'2026-09-17 03:28:18','2026-09-17 03:28:18',1,1,21),(16,'in',5,NULL,NULL,'Initial stock on create',1,'2026-09-17 03:46:11','2026-09-17 03:46:11',1,1,22),(17,'in',5,NULL,NULL,'Initial stock on create',1,'2026-09-17 03:49:52','2026-09-17 03:49:52',1,1,23),(18,'in',15,NULL,NULL,'Set via product/variant form',1,'2026-09-17 04:08:46','2026-09-17 04:08:46',1,1,21);
/*!40000 ALTER TABLE `inventory_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_images`
--

DROP TABLE IF EXISTS `item_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_itemimg_item` (`item_id`),
  KEY `fk_item_images_created_by` (`created_by`),
  KEY `fk_item_images_updated_by` (`updated_by`),
  CONSTRAINT `fk_item_images_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_item_images_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_itemimg_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_images`
--

LOCK TABLES `item_images` WRITE;
/*!40000 ALTER TABLE `item_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID(',
  `product_id` bigint unsigned NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `short_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `is_ready_to_mix` tinyint(1) NOT NULL DEFAULT '0',
  `cooking_recipe` text COLLATE utf8mb4_unicode_ci,
  `shelf_life` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `veg_type` enum('veg','nonveg','vegan','na') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'na',
  `base_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `out_of_stock` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_items_slug` (`slug`),
  UNIQUE KEY `uq_items_sku` (`sku`),
  KEY `idx_item_product` (`product_id`),
  KEY `fk_items_created_by` (`created_by`),
  KEY `fk_items_updated_by` (`updated_by`),
  CONSTRAINT `fk_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'50f9b560-b285-11f1-9f03-3448ed29c7dd',1,'Test T-Shirt','test-t-shirt-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 03:30:14','2026-09-15 03:34:42',NULL,1,1),(2,'50f9c3c6-b285-11f1-9f03-3448ed29c7dd',2,'SEO Test Tee','seo-test-tee-item',NULL,NULL,'Soft premium cotton crew-neck tee in blue.',NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 03:39:53','2026-09-17 10:48:28',NULL,1,1),(3,'50f9c67c-b285-11f1-9f03-3448ed29c7dd',3,'Recently Viewed Test Tee','rv-test-tee-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 04:08:26','2026-09-15 04:39:44',NULL,1,1),(4,'50f9c754-b285-11f1-9f03-3448ed29c7dd',4,'Second RV Test Tee','rv-test-tee-2-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 04:34:07','2026-09-15 04:39:48',NULL,1,1),(5,'50f9c80b-b285-11f1-9f03-3448ed29c7dd',5,'RP Main Tee','rp-main-tee-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 05:18:39','2026-09-15 05:19:40',NULL,1,1),(6,'50f9c8ff-b285-11f1-9f03-3448ed29c7dd',6,'RP Sibling Tee','rp-sibling-tee-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 05:18:39','2026-09-15 05:19:44',NULL,1,1),(7,'50f9ca01-b285-11f1-9f03-3448ed29c7dd',7,'Searchable Velvet Jacket','searchable-velvet-jacket-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 05:25:35','2026-09-15 05:27:51',NULL,1,1),(8,'50f9cba7-b285-11f1-9f03-3448ed29c7dd',8,'Coupon Test Product','coupon-test-product-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 06:11:55','2026-09-15 06:20:19',NULL,1,1),(9,'50f9cc8c-b285-11f1-9f03-3448ed29c7dd',9,'Gender Test Product','gender-test-product-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 08:15:44','2026-09-15 08:17:58',NULL,1,1),(10,'50f9cfe7-b285-11f1-9f03-3448ed29c7dd',10,'UI Test Tee','ui-test-tee-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 08:27:52','2026-09-15 08:30:06',NULL,1,1),(11,'50f9d1cc-b285-11f1-9f03-3448ed29c7dd',11,'Storefront Test Tee','storefront-test-tee-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 08:42:20','2026-09-15 08:51:35',NULL,1,1),(12,'50f9d2d1-b285-11f1-9f03-3448ed29c7dd',12,'Reservation Test Tee','reservation-test-tee-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 10:07:11','2026-09-15 10:11:52',NULL,1,1),(13,'50f9d3d0-b285-11f1-9f03-3448ed29c7dd',13,'Refund Test Tee','refund-test-tee-item',NULL,NULL,NULL,NULL,0,NULL,NULL,'na',0.00,0,1,0,0,'2026-09-15 23:17:07','2026-09-15 23:21:31',NULL,1,1),(14,'50f9d4be-b285-11f1-9f03-3448ed29c7dd',15,'T-Shirt','MENS_CLOTHING_T_SHIRT-item',NULL,'Classic round-neck T-shirt for everyday wear.','<p>A timeless men’s T-shirt featuring a simple round neckline. It is versatile, comfortable, and suitable for casual outings, daily wear, travel, and layering.</p>',NULL,0,NULL,NULL,'na',0.00,0,1,1,0,'2026-09-16 03:09:29','2026-09-17 10:48:28',NULL,NULL,NULL);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_logs`
--

DROP TABLE IF EXISTS `login_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('success','failed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_login_logs_created_by` (`created_by`),
  KEY `fk_login_logs_updated_by` (`updated_by`),
  KEY `fk_loginlog_user` (`user_id`),
  CONSTRAINT `fk_login_logs_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_login_logs_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_loginlog_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_logs`
--

LOCK TABLES `login_logs` WRITE;
/*!40000 ALTER TABLE `login_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_subscribers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uq_newsletter_subscribers_email` (`email`),
  KEY `fk_newsletter_subscribers_created_by` (`created_by`),
  KEY `fk_newsletter_subscribers_updated_by` (`updated_by`),
  CONSTRAINT `fk_newsletter_subscribers_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_newsletter_subscribers_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_subscribers`
--

LOCK TABLES `newsletter_subscribers` WRITE;
/*!40000 ALTER TABLE `newsletter_subscribers` DISABLE KEYS */;
INSERT INTO `newsletter_subscribers` VALUES (1,'test-newsletter-check@example.com',1,'2026-09-16 08:15:36','2026-09-16 08:15:24','2026-09-16 08:15:24',NULL,NULL),(2,'newsletter-ui-test@example.com',1,'2026-09-16 08:16:47','2026-09-16 08:16:47','2026-09-16 08:16:47',NULL,NULL);
/*!40000 ALTER TABLE `newsletter_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_logs`
--

DROP TABLE IF EXISTS `notification_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `notification_template_id` bigint unsigned DEFAULT NULL,
  `recipient` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` enum('email','sms','push','whatsapp') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('sent','failed','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `response` text COLLATE utf8mb4_unicode_ci,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notification_logs_created_by` (`created_by`),
  KEY `fk_notification_logs_updated_by` (`updated_by`),
  KEY `fk_notiflog_template` (`notification_template_id`),
  CONSTRAINT `fk_notification_logs_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notification_logs_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notiflog_template` FOREIGN KEY (`notification_template_id`) REFERENCES `notification_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_logs`
--

LOCK TABLES `notification_logs` WRITE;
/*!40000 ALTER TABLE `notification_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_templates`
--

DROP TABLE IF EXISTS `notification_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` enum('email','sms','push','whatsapp') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `uq_notification_templates_code` (`code`),
  KEY `fk_notification_templates_created_by` (`created_by`),
  KEY `fk_notification_templates_updated_by` (`updated_by`),
  CONSTRAINT `fk_notification_templates_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notification_templates_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_templates`
--

LOCK TABLES `notification_templates` WRITE;
/*!40000 ALTER TABLE `notification_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notif_user` (`user_id`),
  KEY `fk_notifications_created_by` (`created_by`),
  KEY `fk_notifications_updated_by` (`updated_by`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notifications_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_brands`
--

DROP TABLE IF EXISTS `offer_brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_brands` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `offer_id` bigint unsigned NOT NULL,
  `brand_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_offer_brand` (`offer_id`,`brand_id`),
  KEY `fk_offerbrand_brand` (`brand_id`),
  CONSTRAINT `fk_offerbrand_brand` FOREIGN KEY (`brand_id`) REFERENCES `product_brands` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offerbrand_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_brands`
--

LOCK TABLES `offer_brands` WRITE;
/*!40000 ALTER TABLE `offer_brands` DISABLE KEYS */;
/*!40000 ALTER TABLE `offer_brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_categories`
--

DROP TABLE IF EXISTS `offer_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `offer_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_offer_category` (`offer_id`,`category_id`),
  KEY `fk_offercat_category` (`category_id`),
  CONSTRAINT `fk_offercat_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offercat_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_categories`
--

LOCK TABLES `offer_categories` WRITE;
/*!40000 ALTER TABLE `offer_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `offer_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_items`
--

DROP TABLE IF EXISTS `offer_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `offer_id` bigint unsigned NOT NULL,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_offer_item` (`offer_id`,`variant_unit_price_id`),
  KEY `fk_offeritem_vup` (`variant_unit_price_id`),
  KEY `fk_offer_items_created_by` (`created_by`),
  KEY `fk_offer_items_updated_by` (`updated_by`),
  CONSTRAINT `fk_offer_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_offer_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_offeritem_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offeritem_vup` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_items`
--

LOCK TABLES `offer_items` WRITE;
/*!40000 ALTER TABLE `offer_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `offer_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_products`
--

DROP TABLE IF EXISTS `offer_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `offer_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_offer_product` (`offer_id`,`product_id`),
  KEY `fk_offer_products_created_by` (`created_by`),
  KEY `fk_offer_products_updated_by` (`updated_by`),
  KEY `fk_offerprod_product` (`product_id`),
  CONSTRAINT `fk_offer_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_offer_products_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_offerprod_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offerprod_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_products`
--

LOCK TABLES `offer_products` WRITE;
/*!40000 ALTER TABLE `offer_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `offer_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` enum('product','item') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'product',
  `type` enum('percentage','flat','special_price','bxgy') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `buy_quantity` int DEFAULT NULL,
  `get_quantity` int DEFAULT NULL,
  `min_quantity` int NOT NULL DEFAULT '1',
  `max_quantity` int DEFAULT NULL,
  `min_order_amount` decimal(10,2) DEFAULT '0.00',
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `terms` text COLLATE utf8mb4_unicode_ci,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_offers_code` (`code`),
  KEY `fk_offers_created_by` (`created_by`),
  KEY `fk_offers_updated_by` (`updated_by`),
  KEY `idx_offers_active_window` (`is_active`,`starts_at`,`ends_at`),
  KEY `idx_offers_level` (`level`),
  KEY `idx_offers_priority` (`priority`),
  CONSTRAINT `fk_offers_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_offers_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_addresses`
--

DROP TABLE IF EXISTS `order_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `order_id` bigint unsigned NOT NULL,
  `type` enum('billing','shipping') COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `landmark` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'India',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_addresses_created_by` (`created_by`),
  KEY `fk_order_addresses_updated_by` (`updated_by`),
  KEY `fk_orderaddr_order` (`order_id`),
  CONSTRAINT `fk_order_addresses_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_addresses_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orderaddr_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_addresses`
--

LOCK TABLES `order_addresses` WRITE;
/*!40000 ALTER TABLE `order_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `product_name_snapshot` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant_snapshot` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_snapshot` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned DEFAULT NULL,
  `item_id` bigint unsigned NOT NULL,
  `item_name_snapshot` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_created_by` (`created_by`),
  KEY `fk_order_items_updated_by` (`updated_by`),
  KEY `fk_orderitem_order` (`order_id`),
  KEY `fk_orderitem_product` (`product_id`),
  KEY `fk_orderitem_variant` (`variant_id`),
  KEY `fk_orderitem_variant_unit_price` (`variant_unit_price_id`),
  KEY `fk_orderitem_item` (`item_id`),
  CONSTRAINT `fk_order_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orderitem_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_orderitem_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `fk_orderitem_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changed_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_status_history_created_by` (`created_by`),
  KEY `fk_order_status_history_updated_by` (`updated_by`),
  KEY `fk_orderhist_order` (`order_id`),
  KEY `fk_orderhist_user` (`changed_by`),
  CONSTRAINT `fk_order_status_history_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_status_history_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orderhist_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderhist_user` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `cart_id` bigint unsigned DEFAULT NULL,
  `coupon_id` bigint unsigned DEFAULT NULL,
  `delivery_slot_id` bigint unsigned DEFAULT NULL,
  `order_status` enum('pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled','returned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded','partial_refund') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_charge` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `agent_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  UNIQUE KEY `uq_orders_order_number` (`order_number`),
  KEY `fk_order_cart` (`cart_id`),
  KEY `fk_order_coupon` (`coupon_id`),
  KEY `fk_order_slot` (`delivery_slot_id`),
  KEY `fk_orders_created_by` (`created_by`),
  KEY `fk_orders_updated_by` (`updated_by`),
  KEY `idx_order_created` (`created_at`),
  KEY `idx_order_status` (`order_status`),
  KEY `idx_order_user` (`user_id`),
  KEY `fk_orders_agent` (`agent_id`),
  CONSTRAINT `fk_order_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_slot` FOREIGN KEY (`delivery_slot_id`) REFERENCES `delivery_slots` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_orders_agent` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_orders_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `identifier` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` enum('login','register','reset_password','checkout') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_token_used` tinyint(1) NOT NULL DEFAULT '0',
  `token_expires_at` timestamp NULL DEFAULT NULL,
  `verification_token_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_otp_user` (`user_id`),
  KEY `fk_otp_verifications_created_by` (`created_by`),
  KEY `fk_otp_verifications_updated_by` (`updated_by`),
  KEY `idx_otp_identifier` (`identifier`),
  CONSTRAINT `fk_otp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_otp_verifications_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_otp_verifications_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page_contents`
--

DROP TABLE IF EXISTS `page_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page_contents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `page_id` bigint unsigned NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_page_contents_created_by` (`created_by`),
  KEY `fk_page_contents_updated_by` (`updated_by`),
  KEY `fk_pagecontent_page` (`page_id`),
  CONSTRAINT `fk_page_contents_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_page_contents_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pagecontent_page` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page_contents`
--

LOCK TABLES `page_contents` WRITE;
/*!40000 ALTER TABLE `page_contents` DISABLE KEYS */;
/*!40000 ALTER TABLE `page_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_pages_slug` (`slug`),
  KEY `fk_pages_created_by` (`created_by`),
  KEY `fk_pages_updated_by` (`updated_by`),
  CONSTRAINT `fk_pages_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pages_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_gateway_webhooks`
--

DROP TABLE IF EXISTS `payment_gateway_webhooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_gateway_webhooks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `gateway` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` json NOT NULL,
  `status` enum('received','processed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'received',
  `received_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_gateway_webhooks_created_by` (`created_by`),
  KEY `fk_payment_gateway_webhooks_updated_by` (`updated_by`),
  CONSTRAINT `fk_payment_gateway_webhooks_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_gateway_webhooks_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_gateway_webhooks`
--

LOCK TABLES `payment_gateway_webhooks` WRITE;
/*!40000 ALTER TABLE `payment_gateway_webhooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_gateway_webhooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `uq_payment_methods_code` (`code`),
  KEY `fk_payment_methods_created_by` (`created_by`),
  KEY `fk_payment_methods_updated_by` (`updated_by`),
  CONSTRAINT `fk_payment_methods_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_methods_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'Cash on Delivery','COD',1,'2026-09-15 23:20:42','2026-09-15 23:20:42',NULL,NULL);
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned NOT NULL,
  `transaction_type` enum('charge','refund') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gateway_response` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_transactions_created_by` (`created_by`),
  KEY `fk_payment_transactions_updated_by` (`updated_by`),
  KEY `fk_paytx_payment` (`payment_id`),
  CONSTRAINT `fk_payment_transactions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_transactions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_paytx_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `payment_method_id` bigint unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `status` enum('pending','success','failed','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `gateway` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_order_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_payment_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_method` (`payment_method_id`),
  KEY `fk_payments_created_by` (`created_by`),
  KEY `fk_payments_updated_by` (`updated_by`),
  KEY `idx_payment_order` (`order_id`),
  CONSTRAINT `fk_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payments_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payments_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_permissions_slug` (`slug`),
  KEY `fk_permissions_created_by` (`created_by`),
  KEY `fk_permissions_updated_by` (`updated_by`),
  CONSTRAINT `fk_permissions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_permissions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'PRODUCT_VIEW','product-view','PRODUCT','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(2,'PRODUCT_CREATE','product-create','PRODUCT','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(3,'PRODUCT_UPDATE','product-update','PRODUCT','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(4,'PRODUCT_DELETE','product-delete','PRODUCT','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(5,'CATEGORY_VIEW','category-view','CATEGORY','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(6,'CATEGORY_CREATE','category-create','CATEGORY','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(7,'CATEGORY_UPDATE','category-update','CATEGORY','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(8,'CATEGORY_DELETE','category-delete','CATEGORY','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(9,'ORDER_VIEW','order-view','ORDER','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(10,'ORDER_UPDATE','order-update','ORDER','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(11,'USER_VIEW','user-view','USER','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(12,'USER_UPDATE','user-update','USER','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pincode_serviceability`
--

DROP TABLE IF EXISTS `pincode_serviceability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pincode_serviceability` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `zone_id` bigint unsigned NOT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_zone_pincode` (`zone_id`,`pincode`),
  KEY `fk_pincode_serviceability_created_by` (`created_by`),
  KEY `fk_pincode_serviceability_updated_by` (`updated_by`),
  KEY `idx_pincode` (`pincode`),
  CONSTRAINT `fk_pincode_serviceability_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pincode_serviceability_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pincode_zone` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pincode_serviceability`
--

LOCK TABLES `pincode_serviceability` WRITE;
/*!40000 ALTER TABLE `pincode_serviceability` DISABLE KEYS */;
/*!40000 ALTER TABLE `pincode_serviceability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attribute_values`
--

DROP TABLE IF EXISTS `product_attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attribute_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `attribute_id` bigint unsigned NOT NULL,
  `attribute_value_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pav_attr` (`attribute_id`),
  KEY `fk_pav_product` (`product_id`),
  KEY `fk_pav_value` (`attribute_value_id`),
  KEY `fk_product_attribute_values_created_by` (`created_by`),
  KEY `fk_product_attribute_values_updated_by` (`updated_by`),
  CONSTRAINT `fk_pav_attr` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pav_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pav_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_attribute_values_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_attribute_values_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attribute_values`
--

LOCK TABLES `product_attribute_values` WRITE;
/*!40000 ALTER TABLE `product_attribute_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attributes`
--

DROP TABLE IF EXISTS `product_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_product_attributes_slug` (`slug`),
  KEY `fk_product_attributes_created_by` (`created_by`),
  KEY `fk_product_attributes_updated_by` (`updated_by`),
  CONSTRAINT `fk_product_attributes_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_attributes_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attributes`
--

LOCK TABLES `product_attributes` WRITE;
/*!40000 ALTER TABLE `product_attributes` DISABLE KEYS */;
INSERT INTO `product_attributes` VALUES (1,'Size','SIZE-deleted-1','2026-09-15 03:27:07','2026-09-15 03:27:07',0,1,1,'10c44aa3-24d3-40dc-84a0-152c6782b665'),(2,'Size','SIZESC','2026-09-15 06:48:29','2026-09-15 06:48:29',0,1,1,'a9d847d7-f7a6-4ca1-8f96-d0349636ea38'),(3,'Size','SIZEUI','2026-09-15 08:26:42','2026-09-15 08:26:42',0,1,1,'cc5c2f74-faa8-4bd0-bf15-f52da1ad4008'),(4,'Size','SIZESF','2026-09-15 08:41:46','2026-09-15 08:41:46',0,1,1,'2ce557d5-1cd6-44e2-8d1d-c09d655841bf'),(5,'Color','COLOUR','2026-09-16 03:29:03','2026-09-16 03:29:03',1,NULL,NULL,'c75e6d80-e1f5-4f3e-9951-d557097350a6'),(10,'Test Size','TESTSIZE-deleted-10','2026-09-16 03:49:19','2026-09-16 03:49:19',0,1,1,'0f59ea46-4917-41d3-9688-8058de59625b'),(11,'Test Size','TESTSIZE-deleted-11','2026-09-16 03:50:08','2026-09-16 03:50:08',0,1,1,'8d6038f0-f339-49aa-bb95-de8eb0b23628'),(16,'Size','SIZE','2026-09-16 03:57:53','2026-09-16 03:57:53',1,1,1,'0349ea18-9f0d-4d9d-a931-be4dcb3b549f'),(17,'Sizes','SIZES','2026-09-16 03:59:57','2026-09-16 03:59:57',1,1,1,'ddf79a0d-70fa-4171-be98-826595973a89');
/*!40000 ALTER TABLE `product_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_brands`
--

DROP TABLE IF EXISTS `product_brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_brands` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(170) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_product_brands_slug` (`slug`),
  KEY `fk_brands_created_by` (`created_by`),
  KEY `fk_brands_updated_by` (`updated_by`),
  CONSTRAINT `fk_brands_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_brands_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_brands`
--

LOCK TABLES `product_brands` WRITE;
/*!40000 ALTER TABLE `product_brands` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `parent_id` bigint unsigned DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(170) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_product_categories_slug` (`slug`),
  KEY `fk_cat_parent` (`parent_id`),
  KEY `fk_categories_created_by` (`created_by`),
  KEY `fk_categories_updated_by` (`updated_by`),
  KEY `idx_cat_slug` (`slug`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_categories_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_categories_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (1,'34580bf4-b41a-43e1-bd70-78a773c25fe2',NULL,'Fashion','FASHION',NULL,NULL,1,0,0,'2026-09-15 03:28:11','2026-09-15 03:34:51','2026-09-15 03:34:51',1,1),(3,'e3f11af0-da9a-41a6-bac1-c35c391cf10f',NULL,'Fashion V2','FASHIONV2',NULL,NULL,1,0,0,'2026-09-15 03:39:30','2026-09-15 03:43:10','2026-09-15 03:43:10',1,1),(4,'e95e800c-9d34-4e48-9efc-a9f83bd354db',NULL,'Fashion RV','FASHIONRV',NULL,NULL,1,0,0,'2026-09-15 04:08:14','2026-09-15 04:39:58','2026-09-15 04:39:58',1,1),(5,'e4024c08-3134-4fd1-88ca-c24dcc500b40',NULL,'Fashion RP','FASHIONRP',NULL,NULL,1,0,0,'2026-09-15 05:18:24','2026-09-15 05:19:51','2026-09-15 05:19:51',1,1),(6,'4487b547-935e-4913-bb76-19641f628486',NULL,'Fashion SR','FASHIONSR',NULL,NULL,1,0,0,'2026-09-15 05:25:28','2026-09-15 05:28:00','2026-09-15 05:28:00',1,1),(7,'72aea926-548d-401c-96e6-599d73927656',NULL,'SEO Category Test','SEOCATTEST',NULL,NULL,1,0,0,'2026-09-15 05:50:47','2026-09-15 05:51:34','2026-09-15 05:51:34',1,1),(8,'738e8037-3829-45a0-89b5-5609f965448f',NULL,'Coupon Test Cat','COUPONTESTCAT',NULL,NULL,1,0,0,'2026-09-15 06:11:47','2026-09-15 06:20:28','2026-09-15 06:20:28',1,1),(9,'497c3129-32fd-4a11-8936-c9a118301c39',NULL,'Size Test Cat','SIZETESTCAT',NULL,NULL,1,0,0,'2026-09-15 06:48:23','2026-09-15 08:18:33','2026-09-15 08:18:33',1,1),(10,'0e2d7934-6196-4ee2-9253-53d06a0930b2',NULL,'UI Test Cat','UITESTCAT',NULL,NULL,1,0,0,'2026-09-15 08:26:37','2026-09-15 08:30:38','2026-09-15 08:30:38',1,1),(11,'febf77de-4e3a-496d-869b-c9c706b742fa',NULL,'Storefront Test Cat','SFTESTCAT',NULL,NULL,1,0,0,'2026-09-15 08:41:41','2026-09-15 08:51:59','2026-09-15 08:51:59',1,1),(12,'ef2c44e9-0134-4cb7-af61-8f7c8f321bc6',NULL,'Reservation Test Cat','RESTESTCAT',NULL,NULL,1,0,0,'2026-09-15 10:07:02','2026-09-15 10:11:59','2026-09-15 10:11:59',1,1),(13,'cafce92d-438b-4528-b5b0-018ea93c8a2f',NULL,'Refund Test Cat','REFUNDTESTCAT',NULL,NULL,1,0,0,'2026-09-15 23:16:57','2026-09-15 23:21:55','2026-09-15 23:21:55',1,1),(16,'533b8ca3-4088-4da5-9ed7-d1f2437bdc1c',NULL,'Men\'s Clothing','MENS_CLOTHING','','/document/categories/7b20e2e2-f752-4b56-a9e6-a015b6131aed.jpg',1,1,0,'2026-09-16 03:00:38','2026-09-16 03:00:38',NULL,NULL,NULL);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category_images`
--

DROP TABLE IF EXISTS `product_category_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `category_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category_images_created_by` (`created_by`),
  KEY `fk_category_images_updated_by` (`updated_by`),
  KEY `fk_catimg_cat` (`category_id`),
  CONSTRAINT `fk_category_images_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_category_images_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_catimg_cat` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category_images`
--

LOCK TABLES `product_category_images` WRITE;
/*!40000 ALTER TABLE `product_category_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_category_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_gst_rates`
--

DROP TABLE IF EXISTS `product_gst_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_gst_rates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cgst_percent` decimal(5,2) NOT NULL DEFAULT '0.00',
  `sgst_percent` decimal(5,2) NOT NULL DEFAULT '0.00',
  `igst_percent` decimal(5,2) NOT NULL DEFAULT '0.00',
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gst_rates_created_by` (`created_by`),
  KEY `fk_gst_rates_updated_by` (`updated_by`),
  CONSTRAINT `fk_gst_rates_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_gst_rates_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_gst_rates`
--

LOCK TABLES `product_gst_rates` WRITE;
/*!40000 ALTER TABLE `product_gst_rates` DISABLE KEYS */;
INSERT INTO `product_gst_rates` VALUES (1,'923271ba-19a9-4a50-a1d6-859c1108a7f0','GST 5%',2.50,2.50,5.00,1,0,'2026-09-15 03:30:01','2026-09-15 03:30:01',1,1),(2,'a74e87bb-96aa-4866-8101-b766bba0dab3','GST 5%',2.50,2.50,5.00,1,1,'2026-09-15 03:38:59','2026-09-15 03:38:59',1,1),(3,'26e3a7d3-41c4-45f5-9593-1907f2d355de','GST 5% v2',2.50,2.50,5.00,1,0,'2026-09-15 03:39:16','2026-09-15 03:39:16',1,1),(4,'c00b8cad-09be-46f6-a309-750b32a0197a','GST 5% RV',2.50,2.50,5.00,1,0,'2026-09-15 04:07:57','2026-09-15 04:07:57',1,1),(5,'6decef91-26c9-4e5b-bf32-ba8addb990c1','GST 5% RP',2.50,2.50,5.00,1,0,'2026-09-15 05:18:00','2026-09-15 05:18:00',1,1),(6,'3f3f80d3-ba20-4417-b6f3-cd9f683fe584','GST 5% SR',2.50,2.50,5.00,1,0,'2026-09-15 05:25:11','2026-09-15 05:25:11',1,1),(7,'e0c5c637-ff44-4796-a61a-af6ae80a0038','GST 5% CP',2.50,2.50,5.00,1,0,'2026-09-15 06:11:32','2026-09-15 06:11:32',1,1),(8,'90aef47a-8a25-4641-b306-dceef7af08e8','GST 5% SC',2.50,2.50,5.00,1,0,'2026-09-15 06:47:48','2026-09-15 06:47:48',1,1),(9,'5ea71e8e-1757-47e0-9319-d3daa9b8f061','GST 5% UI',2.50,2.50,5.00,1,0,'2026-09-15 08:26:30','2026-09-15 08:26:30',1,1),(10,'60d4b69c-d78d-4c0f-97eb-1d3de4da0416','GST 5% SF',2.50,2.50,5.00,1,0,'2026-09-15 08:41:13','2026-09-15 08:41:13',1,1),(11,'e10a1648-29a9-4a54-bf5f-eeb23680a70b','GST 5% RS',2.50,2.50,5.00,1,0,'2026-09-15 10:06:47','2026-09-15 10:06:47',1,1),(12,'633defc9-2029-4b37-8187-1ad0daa1e3bf','GST 5% RF',2.50,2.50,5.00,1,0,'2026-09-15 23:16:37','2026-09-15 23:16:37',1,1);
/*!40000 ALTER TABLE `product_gst_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_hsn_codes`
--

DROP TABLE IF EXISTS `product_hsn_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_hsn_codes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_rate_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `uq_product_hsn_codes_code` (`code`),
  KEY `fk_hsn_codes_created_by` (`created_by`),
  KEY `fk_hsn_codes_updated_by` (`updated_by`),
  KEY `fk_hsn_gst` (`gst_rate_id`),
  CONSTRAINT `fk_hsn_codes_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_hsn_codes_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_hsn_gst` FOREIGN KEY (`gst_rate_id`) REFERENCES `product_gst_rates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_hsn_codes`
--

LOCK TABLES `product_hsn_codes` WRITE;
/*!40000 ALTER TABLE `product_hsn_codes` DISABLE KEYS */;
INSERT INTO `product_hsn_codes` VALUES (1,'3116a2cc-d785-4dfa-9a83-2e7f0ee4b5b4','6109','T-shirts, singlets',1,'2026-09-15 03:30:06','2026-09-15 03:30:06',1,0,1,1),(3,'751d1444-4c79-4258-acd3-a71c9f5e774b','6109v2','T-shirts',3,'2026-09-15 03:39:24','2026-09-15 03:39:24',1,0,1,1),(4,'9313680b-a663-4e0d-b369-d544bb3a5f7d','6109RV','T-shirts',4,'2026-09-15 04:08:07','2026-09-15 04:08:07',1,0,1,1),(5,'764c22d3-1836-4a58-9f44-0913709577a3','6109RP','T-shirts',5,'2026-09-15 05:18:14','2026-09-15 05:18:14',1,0,1,1),(6,'ccf3fd6e-86fd-4443-b347-0a39a72397ce','6109SR','T-shirts',6,'2026-09-15 05:25:20','2026-09-15 05:25:20',1,0,1,1),(7,'2f887daf-131f-4807-bc75-0be1ea7bbd42','6109CP','T-shirts',7,'2026-09-15 06:11:42','2026-09-15 06:11:42',1,0,1,1),(8,'19708ddf-ec71-4e07-b7dd-64247b595bac','6109SC','T-shirts',8,'2026-09-15 06:48:07','2026-09-15 06:48:07',1,0,1,1),(9,'58cee5c4-c656-475e-a6aa-e1b22bed9a8e','6109UI','T-shirts',9,'2026-09-15 08:26:36','2026-09-15 08:26:36',1,0,1,1),(10,'f787a15d-8a8f-45a1-a779-ea046f398a88','6109SF','T-shirts',10,'2026-09-15 08:41:35','2026-09-15 08:41:35',1,0,1,1),(11,'c9e07b71-63d7-49ca-8671-1b0683306f9e','6109RS','T-shirts',11,'2026-09-15 10:06:56','2026-09-15 10:06:56',1,0,1,1),(12,'fdb118ec-1eb3-47e0-b825-3fe740df53b3','6109RF','T-shirts',12,'2026-09-15 23:16:48','2026-09-15 23:16:48',1,0,1,1),(13,'0e6612d9-183c-4320-b5ea-b81ffb072773','6104',NULL,2,'2026-09-16 03:07:23','2026-09-16 03:07:23',1,1,NULL,NULL);
/*!40000 ALTER TABLE `product_hsn_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pimg_product` (`product_id`),
  KEY `fk_product_images_created_by` (`created_by`),
  KEY `fk_product_images_updated_by` (`updated_by`),
  CONSTRAINT `fk_pimg_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_images_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_images_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,15,'/document/products/f3d81244-5a7a-497b-bbdc-2b9253dec5cc.webp',NULL,1,0,'2026-09-16 03:09:43','2026-09-16 03:09:43',1,NULL,NULL);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_questions`
--

DROP TABLE IF EXISTS `product_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `question` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answered_by` bigint unsigned DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `answered_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pq_answered_by` (`answered_by`),
  KEY `fk_pq_product` (`product_id`),
  KEY `fk_pq_user` (`user_id`),
  KEY `fk_product_questions_created_by` (`created_by`),
  KEY `fk_product_questions_updated_by` (`updated_by`),
  CONSTRAINT `fk_pq_answered_by` FOREIGN KEY (`answered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pq_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pq_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_questions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_questions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_questions`
--

LOCK TABLES `product_questions` WRITE;
/*!40000 ALTER TABLE `product_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tag_maps`
--

DROP TABLE IF EXISTS `product_tag_maps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tag_maps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `tag_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_tag` (`product_id`,`tag_id`),
  KEY `fk_product_tag_maps_created_by` (`created_by`),
  KEY `fk_product_tag_maps_updated_by` (`updated_by`),
  KEY `fk_ptm_tag` (`tag_id`),
  CONSTRAINT `fk_product_tag_maps_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_tag_maps_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ptm_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ptm_tag` FOREIGN KEY (`tag_id`) REFERENCES `product_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tag_maps`
--

LOCK TABLES `product_tag_maps` WRITE;
/*!40000 ALTER TABLE `product_tag_maps` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tag_maps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tags`
--

DROP TABLE IF EXISTS `product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_product_tags_slug` (`slug`),
  KEY `fk_product_tags_created_by` (`created_by`),
  KEY `fk_product_tags_updated_by` (`updated_by`),
  CONSTRAINT `fk_product_tags_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_tags_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tags`
--

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_units`
--

DROP TABLE IF EXISTS `product_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_units` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('weight','volume','count','size') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'count',
  `base_unit_id` bigint unsigned DEFAULT NULL,
  `conversion_factor` decimal(12,4) NOT NULL DEFAULT '1.0000',
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `uq_product_units_code` (`code`),
  KEY `fk_unit_base` (`base_unit_id`),
  KEY `fk_units_created_by` (`created_by`),
  KEY `fk_units_updated_by` (`updated_by`),
  CONSTRAINT `fk_unit_base` FOREIGN KEY (`base_unit_id`) REFERENCES `product_units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_units_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_units_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_units`
--

LOCK TABLES `product_units` WRITE;
/*!40000 ALTER TABLE `product_units` DISABLE KEYS */;
INSERT INTO `product_units` VALUES (1,'03d7800d-9073-4dd9-b40c-38fb166f8ee1','Piece','PC','count',NULL,1.0000,1,0,0,'2026-09-15 03:40:12','2026-09-15 03:40:12',1,1),(3,'7e0de851-94d5-4122-aa4d-1a21b802bc9c','Piece RV','PCRV','count',NULL,1.0000,1,0,0,'2026-09-15 04:12:40','2026-09-15 04:12:40',1,1),(4,'9159a91c-4b5c-4542-b878-8ef073ec9b3d','Piece SR','PCSR','count',NULL,1.0000,1,0,0,'2026-09-15 05:26:22','2026-09-15 05:26:22',1,1),(5,'0c3d9eee-2563-49c6-9766-9b1434e52d6d','Piece CP','PCCP','count',NULL,1.0000,1,0,0,'2026-09-15 06:12:05','2026-09-15 06:12:05',1,1),(6,'24b3ab11-62d3-465e-966b-6ee581594422','Piece GT','PCGT','count',NULL,1.0000,1,0,0,'2026-09-15 08:17:19','2026-09-15 08:17:19',1,1),(7,'00c00dee-addb-45ec-b19f-8c538c34c6e4','Piece SF','PCSF','count',NULL,1.0000,1,0,0,'2026-09-15 08:42:56','2026-09-15 08:42:56',1,1),(8,'ba3e0fc3-a11a-4c1b-9aae-d767bdf2ca5f','Piece RS','PCRS','count',NULL,1.0000,1,0,0,'2026-09-15 10:07:39','2026-09-15 10:07:39',1,1),(9,'ae6e6463-b3d6-4d3e-846a-966b96105f4d','Piece RF','PCRF','count',NULL,1.0000,1,0,0,'2026-09-15 23:17:32','2026-09-15 23:17:32',1,1),(10,'dd5bce03-b3bf-4ef0-b16d-37ebcb8afcd4','Count','Nos','count',NULL,1.0000,1,1,0,'2026-09-16 03:23:47','2026-09-16 03:23:47',NULL,NULL);
/*!40000 ALTER TABLE `product_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variant_images`
--

DROP TABLE IF EXISTS `product_variant_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variant_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_product_variant_images_created_by` (`created_by`),
  KEY `fk_product_variant_images_updated_by` (`updated_by`),
  KEY `fk_vimg_variant` (`variant_id`),
  CONSTRAINT `fk_product_variant_images_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_variant_images_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vimg_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variant_images`
--

LOCK TABLES `product_variant_images` WRITE;
/*!40000 ALTER TABLE `product_variant_images` DISABLE KEYS */;
INSERT INTO `product_variant_images` VALUES (1,'270799f5-3057-47ef-9a29-cf11b96e965e',12,'/document/variants/6fe8f64a-935d-44b6-8d5d-daa5c804e184.webp',1,'2026-09-16 03:26:22','2026-09-16 03:26:22',1,1,NULL,NULL,1);
/*!40000 ALTER TABLE `product_variant_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID()',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `out_of_stock` tinyint(1) NOT NULL DEFAULT '0',
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_adjustment` decimal(10,2) NOT NULL DEFAULT '0.00',
  `item_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_variant_slug` (`slug`),
  UNIQUE KEY `uq_product_variants_slug` (`slug`),
  KEY `fk_product_variants_created_by` (`created_by`),
  KEY `fk_product_variants_updated_by` (`updated_by`),
  KEY `idx_variant_active_listing` (`is_active`,`deleted_at`,`created_at`),
  KEY `idx_variant_out_of_stock` (`out_of_stock`),
  KEY `idx_variant_item` (`item_id`),
  CONSTRAINT `fk_product_variants_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_variants_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_variant_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,'fbe72187-5b51-435c-8d76-0810a341ea3c',0,0,'2026-09-15 03:31:27','2026-09-17 05:59:13','2026-09-15 03:34:41',1,1,'Red Medium Tee','test-t-shirt_red_medium_tee',0,0,NULL,NULL,0.00,1),(2,'eacdc434-995b-44c2-b28e-28a42e907d2e',0,0,'2026-09-15 03:40:01','2026-09-17 05:59:13','2026-09-15 03:42:39',1,1,'Blue Tee','seo-test-tee_blue',0,0,NULL,NULL,0.00,2),(3,'6042abd1-7023-497a-bad4-a7f640a42b6d',0,1,'2026-09-15 04:12:56','2026-09-17 05:59:13',NULL,1,1,'Default','rv-test-tee_default',0,0,NULL,NULL,0.00,3),(4,'3c9829f7-fbdf-4591-ada7-edb3569a9e67',0,1,'2026-09-15 05:26:31','2026-09-17 05:59:13',NULL,1,1,'Default','searchable-velvet-jacket_default',0,0,NULL,NULL,0.00,7),(5,'5b31a35e-866a-4b8d-801b-63f1b5d6fc18',0,1,'2026-09-15 06:12:14','2026-09-17 05:59:13',NULL,1,1,'Default','coupon-test-product_default',0,0,NULL,NULL,0.00,8),(6,'a536be87-9cfa-4b2f-8b8d-a017f92b01f7',0,0,'2026-09-15 08:17:07','2026-09-17 05:59:13',NULL,1,1,'Medium','gender-test-product_medium',0,0,NULL,NULL,0.00,9),(7,'7f1bb21a-1705-4f1a-85fd-0bc4f44f8092',0,1,'2026-09-15 08:42:34','2026-09-17 05:59:13',NULL,1,1,'Size M','sf-tee_m',0,0,NULL,NULL,0.00,11),(8,'5bc4c25d-cc39-4fce-b964-9025b17620a8',0,1,'2026-09-15 08:42:40','2026-09-17 05:59:13',NULL,1,1,'Size L','sf-tee_l',0,0,NULL,NULL,0.00,11),(9,'40a512ab-eb70-448e-b021-2077fd72356f',0,1,'2026-09-15 10:07:29','2026-09-17 05:59:13',NULL,1,1,'Default','res-tee_default',0,0,NULL,NULL,0.00,12),(10,'94589eb0-0b71-4b6d-aa3b-371e96fc4b2c',0,1,'2026-09-15 23:17:22','2026-09-17 05:59:13',NULL,1,1,'Default','refund-tee_default',0,0,NULL,NULL,0.00,13),(12,'45e829a0-0250-4e07-a697-db93fe4d79e6',0,1,'2026-09-16 03:18:09','2026-09-17 05:59:13',NULL,NULL,1,'Crew Neck','mens_clothing_t_shirt_mens_clothing_t_shirt_crew_neck',1,0,NULL,'Black',0.00,14),(13,'98189fcc-76e7-4e19-a9d7-638a7232d255',0,0,'2026-09-16 04:19:45','2026-09-17 05:59:13',NULL,1,1,'V-Neck','mens_clothing_t_shirt_v_neck',1,0,'#c70000','Maroon Red',0.00,14),(14,'81465e7f-0cd3-4667-8bc2-427d83ac021b',0,0,'2026-09-17 01:45:34','2026-09-17 05:59:13',NULL,1,1,'Red - Small','mens_clothing_t_shirt_red_small',0,0,NULL,'Red',0.00,14),(15,'5ed5031c-95c5-42fa-a94f-b48e780abcbd',0,1,'2026-09-17 02:39:26','2026-09-17 05:59:13',NULL,1,1,'M','MENS_CLOTHING_T_SHIRT-m',0,0,NULL,NULL,0.00,14),(16,'0493f411-5798-4e53-acd7-5e2f8247e75a',0,1,'2026-09-17 02:39:26','2026-09-17 05:59:13',NULL,1,1,'L','MENS_CLOTHING_T_SHIRT-l',0,0,NULL,NULL,0.00,14),(17,'a9dfa21e-f5ea-4c64-8302-fad08016daa5',0,1,'2026-09-17 02:54:08','2026-09-17 05:59:13',NULL,1,1,'Black / M','MENS_CLOTHING_T_SHIRT-black-m',0,0,NULL,'Black',0.00,14),(18,'4e339be4-710b-4cd8-9e0d-e959de0d53ba',0,1,'2026-09-17 02:54:08','2026-09-17 05:59:13',NULL,1,1,'Black / S','MENS_CLOTHING_T_SHIRT-black-s',0,0,NULL,'Black',0.00,14),(19,'5130b096-96e8-4550-8745-07ebd8edf8d2',0,1,'2026-09-17 02:54:08','2026-09-17 05:59:13',NULL,1,1,'Black / L','MENS_CLOTHING_T_SHIRT-black-l',0,0,NULL,'Black',0.00,14),(20,'c4412fc6-4bd8-4e78-959f-55e3f7059000',0,1,'2026-09-17 02:54:08','2026-09-17 05:59:13',NULL,1,1,'White / M','MENS_CLOTHING_T_SHIRT-white-m',0,0,NULL,'White',0.00,14),(21,'83f1be9f-f02e-4089-90e9-8592add1d4d8',0,1,'2026-09-17 02:54:08','2026-09-17 05:59:13',NULL,1,1,'White / S','MENS_CLOTHING_T_SHIRT-white-s',0,0,NULL,'White',0.00,14),(22,'e011b1ba-361e-4e2e-92d5-a8b9b91f20ec',0,1,'2026-09-17 02:54:08','2026-09-17 05:59:13',NULL,1,1,'White / L','MENS_CLOTHING_T_SHIRT-white-l',0,0,NULL,'White',0.00,14),(23,'d32f1323-0f1d-4ead-afff-942677ced01b',0,1,'2026-09-17 03:28:18','2026-09-17 05:59:13',NULL,1,1,'Blue / XL','MENS_CLOTHING_T_SHIRT-blue-xl',0,0,NULL,'Blue',0.00,14),(24,'362d8e3a-f546-4b08-aa0a-4b9cd6b4ad27',0,0,'2026-09-17 03:45:58','2026-09-17 05:59:13','2026-09-17 03:46:24',1,1,'White / XL','mens_clothing_t_shirt_white_xl_demo',0,0,NULL,NULL,0.00,14),(25,'0991cf57-3c23-4e61-80b4-38aaed0f61b8',0,0,'2026-09-17 03:49:52','2026-09-17 05:59:13','2026-09-17 03:49:53',1,1,'Blue / M (demo)','mens_clothing_t_shirt_blue_m_demo3',0,0,NULL,NULL,0.00,14),(27,'d32d6fee-4ccd-476c-b230-780290698a75',0,0,'2026-09-17 08:49:10','2026-09-17 08:57:21',NULL,1,1,'Solo-T-shirt','mens_clothing_t_shirt-item_mens_clothing_t_shirt-item_mens_clothing_t_shirt_solo_t_shirt',1,0,'#8a3d3d','Black',0.00,14),(28,'517815ce-86b8-4478-b3b2-bbdf323f7090',0,1,'2026-09-17 09:13:06','2026-09-17 09:13:06',NULL,1,1,'Black','MENS_CLOTHING_T_SHIRT-item-black',0,1,NULL,'Black',0.00,14),(29,'c80e843b-e7be-4712-a615-238a03947e50',0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,'White','MENS_CLOTHING_T_SHIRT-item-white',0,1,NULL,'White',0.00,14),(30,'638d98a2-15ea-4f64-ac31-0649767287a8',0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,'Blue','MENS_CLOTHING_T_SHIRT-item-blue',0,1,NULL,'Blue',0.00,14),(31,'cf3a27b7-8972-497a-9d81-33ffd0437cc5',0,0,'2026-09-17 11:13:46','2026-09-17 11:13:46',NULL,1,1,'Collor','mens_clothing_t_shirt_collor',1,0,NULL,'Black',0.00,14);
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `category_id` bigint DEFAULT NULL,
  `brand_id` bigint unsigned DEFAULT NULL,
  `hsn_code_id` bigint unsigned DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `gender` enum('men','women','kids','unisex') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  UNIQUE KEY `idx_products_uuid` (`uuid`),
  UNIQUE KEY `uq_products_uuid` (`uuid`),
  KEY `fk_products_brand` (`brand_id`),
  KEY `fk_products_created_by` (`created_by`),
  KEY `fk_products_hsn` (`hsn_code_id`),
  KEY `fk_products_updated_by` (`updated_by`),
  KEY `idx_products_active` (`is_active`),
  KEY `idx_products_slug` (`slug`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `product_brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_hsn` FOREIGN KEY (`hsn_code_id`) REFERENCES `product_hsn_codes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'7f05aabb-c113-4094-b440-aab973c0d06e',1,NULL,1,'Test T-Shirt','test-t-shirt',1,0,'2026-09-15 03:30:14','2026-09-15 03:34:42','2026-09-15 03:34:42',1,1,'unisex'),(2,'10ff2016-9bbf-4a7a-a89a-97e282cb4c55',3,NULL,3,'SEO Test Tee','seo-test-tee',1,0,'2026-09-15 03:39:53','2026-09-15 03:43:05','2026-09-15 03:43:05',1,1,'unisex'),(3,'2cd124f8-50fb-4792-ad5c-98bb35b41b58',4,NULL,4,'Recently Viewed Test Tee','rv-test-tee',1,0,'2026-09-15 04:08:26','2026-09-15 04:39:44','2026-09-15 04:39:43',1,1,'unisex'),(4,'068a5909-8611-4e6b-80d0-058af62a5dac',4,NULL,4,'Second RV Test Tee','rv-test-tee-2',1,0,'2026-09-15 04:34:07','2026-09-15 04:39:48','2026-09-15 04:39:48',1,1,'unisex'),(5,'6edce365-b33b-4c39-b8d9-9e8332eb1ed1',5,NULL,5,'RP Main Tee','rp-main-tee',1,0,'2026-09-15 05:18:39','2026-09-15 05:19:40','2026-09-15 05:19:40',1,1,'unisex'),(6,'9be163d3-fb66-46cc-85d3-913faf2aa19e',5,NULL,5,'RP Sibling Tee','rp-sibling-tee',1,0,'2026-09-15 05:18:39','2026-09-15 05:19:44','2026-09-15 05:19:44',1,1,'unisex'),(7,'14521d1c-a41b-460b-b1bb-cca0a0da32e8',6,NULL,6,'Searchable Velvet Jacket','searchable-velvet-jacket',1,0,'2026-09-15 05:25:35','2026-09-15 05:27:51','2026-09-15 05:27:51',1,1,'unisex'),(8,'2ab150ec-e216-4f49-8a78-b0eddf678d19',8,NULL,7,'Coupon Test Product','coupon-test-product',1,0,'2026-09-15 06:11:55','2026-09-15 06:20:19','2026-09-15 06:20:19',1,1,'unisex'),(9,'bde0a16e-c528-4b30-8b9a-8c7ff701bc05',9,NULL,8,'Gender Test Product','gender-test-product',1,0,'2026-09-15 08:15:44','2026-09-15 08:17:58','2026-09-15 08:17:58',1,1,'men'),(10,'0e9220af-2813-4e5b-a8ea-cd62b4c8e926',10,NULL,9,'UI Test Tee','ui-test-tee',1,0,'2026-09-15 08:27:52','2026-09-15 08:30:06','2026-09-15 08:30:06',1,1,'men'),(11,'2c505330-2339-4003-8d24-159885f369b3',11,NULL,10,'Storefront Test Tee','storefront-test-tee',1,0,'2026-09-15 08:42:20','2026-09-15 08:51:35','2026-09-15 08:51:35',1,1,'men'),(12,'ab042c98-1308-47f1-8270-9c0f191f951f',12,NULL,11,'Reservation Test Tee','reservation-test-tee',1,0,'2026-09-15 10:07:11','2026-09-15 10:11:52','2026-09-15 10:11:52',1,1,NULL),(13,'83ee955d-c881-45ec-b1c2-85e73c5d1b35',13,NULL,12,'Refund Test Tee','refund-test-tee',1,0,'2026-09-15 23:17:07','2026-09-15 23:21:31','2026-09-15 23:21:31',1,1,NULL),(15,'f477b136-3fe9-44c3-8293-ee797a9d1023',16,NULL,13,'T-Shirt','MENS_CLOTHING_T_SHIRT',1,1,'2026-09-16 03:09:29','2026-09-16 03:09:29',NULL,NULL,NULL,'men');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produt_brand_images`
--

DROP TABLE IF EXISTS `produt_brand_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produt_brand_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `brand_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_brand_images_created_by` (`created_by`),
  KEY `fk_brand_images_updated_by` (`updated_by`),
  KEY `fk_brandimg_brand` (`brand_id`),
  CONSTRAINT `fk_brand_images_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_brand_images_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_brandimg_brand` FOREIGN KEY (`brand_id`) REFERENCES `product_brands` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produt_brand_images`
--

LOCK TABLES `produt_brand_images` WRITE;
/*!40000 ALTER TABLE `produt_brand_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `produt_brand_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recently_viewed_products`
--

DROP TABLE IF EXISTS `recently_viewed_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recently_viewed_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` bigint unsigned NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recently_viewed_products_created_by` (`created_by`),
  KEY `fk_recently_viewed_products_updated_by` (`updated_by`),
  KEY `fk_recentview_product` (`product_id`),
  KEY `idx_recentview_session` (`session_id`),
  KEY `idx_recentview_user` (`user_id`),
  CONSTRAINT `fk_recently_viewed_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_recently_viewed_products_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_recentview_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_recentview_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recently_viewed_products`
--

LOCK TABLES `recently_viewed_products` WRITE;
/*!40000 ALTER TABLE `recently_viewed_products` DISABLE KEYS */;
INSERT INTO `recently_viewed_products` VALUES (2,2,NULL,3,'2026-09-15 04:10:45','2026-09-15 04:10:45','2026-09-15 04:10:45',1,NULL,NULL),(3,2,NULL,4,'2026-09-15 04:38:41','2026-09-15 04:38:41','2026-09-15 04:38:41',1,NULL,NULL),(4,1,NULL,5,'2026-09-15 05:19:14','2026-09-15 05:19:14','2026-09-15 05:19:14',1,NULL,NULL),(6,1,NULL,11,'2026-09-15 08:47:53','2026-09-15 08:47:53','2026-09-15 08:47:53',1,NULL,NULL),(38,1,NULL,15,'2026-09-17 04:35:53','2026-09-17 04:35:53','2026-09-17 04:35:53',1,NULL,NULL),(40,2,NULL,15,'2026-09-17 06:07:23','2026-09-17 06:07:23','2026-09-17 06:07:23',1,NULL,NULL);
/*!40000 ALTER TABLE `recently_viewed_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `redirect_urls`
--

DROP TABLE IF EXISTS `redirect_urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redirect_urls` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `from_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `redirect_type` smallint NOT NULL DEFAULT '301',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_redirect_urls_created_by` (`created_by`),
  KEY `fk_redirect_urls_updated_by` (`updated_by`),
  CONSTRAINT `fk_redirect_urls_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_redirect_urls_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `redirect_urls`
--

LOCK TABLES `redirect_urls` WRITE;
/*!40000 ALTER TABLE `redirect_urls` DISABLE KEYS */;
/*!40000 ALTER TABLE `redirect_urls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refunds`
--

DROP TABLE IF EXISTS `refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refunds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned NOT NULL,
  `order_id` bigint unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('initiated','processing','completed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'initiated',
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_refund_order` (`order_id`),
  KEY `fk_refund_payment` (`payment_id`),
  KEY `fk_refunds_created_by` (`created_by`),
  KEY `fk_refunds_updated_by` (`updated_by`),
  CONSTRAINT `fk_refund_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_refund_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_refunds_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_refunds_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refunds`
--

LOCK TABLES `refunds` WRITE;
/*!40000 ALTER TABLE `refunds` DISABLE KEYS */;
/*!40000 ALTER TABLE `refunds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_items`
--

DROP TABLE IF EXISTS `return_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `return_request_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_return_items_created_by` (`created_by`),
  KEY `fk_return_items_updated_by` (`updated_by`),
  KEY `fk_returnitem_orderitem` (`order_item_id`),
  KEY `fk_returnitem_request` (`return_request_id`),
  CONSTRAINT `fk_return_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_return_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_returnitem_orderitem` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`),
  CONSTRAINT `fk_returnitem_request` FOREIGN KEY (`return_request_id`) REFERENCES `return_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_items`
--

LOCK TABLES `return_items` WRITE;
/*!40000 ALTER TABLE `return_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `return_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_requests`
--

DROP TABLE IF EXISTS `return_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('requested','approved','rejected','picked_up','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'requested',
  `requested_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_return_requests_uuid` (`uuid`),
  UNIQUE KEY `uq_return_requests_uuid` (`uuid`),
  KEY `fk_return_order` (`order_id`),
  KEY `fk_return_requests_created_by` (`created_by`),
  KEY `fk_return_requests_updated_by` (`updated_by`),
  KEY `fk_return_user` (`user_id`),
  CONSTRAINT `fk_return_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_requests_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_return_requests_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_return_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_requests`
--

LOCK TABLES `return_requests` WRITE;
/*!40000 ALTER TABLE `return_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `return_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_images`
--

DROP TABLE IF EXISTS `review_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `review_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_review_images_created_by` (`created_by`),
  KEY `fk_review_images_updated_by` (`updated_by`),
  KEY `fk_reviewimg_review` (`review_id`),
  CONSTRAINT `fk_review_images_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_images_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reviewimg_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_images`
--

LOCK TABLES `review_images` WRITE;
/*!40000 ALTER TABLE `review_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned DEFAULT NULL,
  `rating` tinyint unsigned NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_reviews_uuid` (`uuid`),
  UNIQUE KEY `uq_reviews_uuid` (`uuid`),
  KEY `fk_review_orderitem` (`order_item_id`),
  KEY `fk_review_product` (`product_id`),
  KEY `fk_review_user` (`user_id`),
  KEY `fk_review_variant_unit_price` (`variant_unit_price_id`),
  KEY `fk_reviews_created_by` (`created_by`),
  KEY `fk_reviews_updated_by` (`updated_by`),
  CONSTRAINT `fk_review_orderitem` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reviews_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_points`
--

DROP TABLE IF EXISTS `reward_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_points` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `total_points` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reward_points_user_id` (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `fk_reward_points_created_by` (`created_by`),
  KEY `fk_reward_points_updated_by` (`updated_by`),
  CONSTRAINT `fk_reward_points_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reward_points_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_rewardpoints_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_points`
--

LOCK TABLES `reward_points` WRITE;
/*!40000 ALTER TABLE `reward_points` DISABLE KEYS */;
/*!40000 ALTER TABLE `reward_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_transactions`
--

DROP TABLE IF EXISTS `reward_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `type` enum('earn','redeem','expire') COLLATE utf8mb4_unicode_ci NOT NULL,
  `points` int NOT NULL,
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reward_transactions_created_by` (`created_by`),
  KEY `fk_reward_transactions_updated_by` (`updated_by`),
  KEY `fk_rewardtx_user` (`user_id`),
  CONSTRAINT `fk_reward_transactions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reward_transactions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_rewardtx_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_transactions`
--

LOCK TABLES `reward_transactions` WRITE;
/*!40000 ALTER TABLE `reward_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `reward_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_role_permission` (`role_id`,`permission_id`),
  KEY `fk_role_permissions_created_by` (`created_by`),
  KEY `fk_role_permissions_updated_by` (`updated_by`),
  KEY `fk_rp_permission` (`permission_id`),
  CONSTRAINT `fk_role_permissions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_role_permissions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,1,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(2,1,2,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(3,1,3,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(4,1,4,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(5,1,5,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(6,1,6,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(7,1,7,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(8,1,8,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(9,1,9,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(10,1,10,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(11,1,11,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(12,1,12,'2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `uq_roles_slug` (`slug`),
  KEY `fk_roles_created_by` (`created_by`),
  KEY `fk_roles_updated_by` (`updated_by`),
  CONSTRAINT `fk_roles_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_roles_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','admin','Administrator with full access','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(2,'STAFF','staff','Staff member with limited access','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL),(3,'CUSTOMER','customer','Regular customer','2026-09-15 03:25:14','2026-09-15 03:25:14',1,NULL,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_reports`
--

DROP TABLE IF EXISTS `sales_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `report_date` date NOT NULL,
  `total_orders` int NOT NULL DEFAULT '0',
  `total_sales` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_tax` decimal(12,2) NOT NULL DEFAULT '0.00',
  `generated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_date` (`report_date`),
  UNIQUE KEY `uq_sales_reports_report_date` (`report_date`),
  KEY `fk_sales_reports_created_by` (`created_by`),
  KEY `fk_sales_reports_updated_by` (`updated_by`),
  CONSTRAINT `fk_sales_reports_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sales_reports_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_reports`
--

LOCK TABLES `sales_reports` WRITE;
/*!40000 ALTER TABLE `sales_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_history`
--

DROP TABLE IF EXISTS `search_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `search_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `results_count` int NOT NULL DEFAULT '0',
  `searched_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_search_history_created_by` (`created_by`),
  KEY `fk_search_history_updated_by` (`updated_by`),
  KEY `fk_search_user` (`user_id`),
  CONSTRAINT `fk_search_history_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_search_history_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_search_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_history`
--

LOCK TABLES `search_history` WRITE;
/*!40000 ALTER TABLE `search_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `search_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seo_meta`
--

DROP TABLE IF EXISTS `seo_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seo_meta` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `meta_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_keywords` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `og_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_seo_entity` (`entity_type`,`entity_id`),
  KEY `fk_seo_meta_created_by` (`created_by`),
  KEY `fk_seo_meta_updated_by` (`updated_by`),
  CONSTRAINT `fk_seo_meta_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_seo_meta_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seo_meta`
--

LOCK TABLES `seo_meta` WRITE;
/*!40000 ALTER TABLE `seo_meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `seo_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`),
  UNIQUE KEY `uq_settings_key_name` (`key_name`),
  KEY `fk_settings_created_by` (`created_by`),
  KEY `fk_settings_updated_by` (`updated_by`),
  CONSTRAINT `fk_settings_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_settings_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipment_tracking`
--

DROP TABLE IF EXISTS `shipment_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipment_tracking` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `shipment_id` bigint unsigned NOT NULL,
  `status` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tracked_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shipment_tracking_created_by` (`created_by`),
  KEY `fk_shipment_tracking_updated_by` (`updated_by`),
  KEY `fk_shiptrack_shipment` (`shipment_id`),
  CONSTRAINT `fk_shipment_tracking_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shipment_tracking_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shiptrack_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipment_tracking`
--

LOCK TABLES `shipment_tracking` WRITE;
/*!40000 ALTER TABLE `shipment_tracking` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipment_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipments`
--

DROP TABLE IF EXISTS `shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `delivery_partner_id` bigint unsigned DEFAULT NULL,
  `tracking_number` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','picked_up','in_transit','out_for_delivery','delivered','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_staff_id` bigint unsigned DEFAULT NULL,
  `assignment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `accepted_at` timestamp NULL DEFAULT NULL,
  `delivery_notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shipment_delivery_staff` (`delivery_staff_id`),
  KEY `fk_shipment_order` (`order_id`),
  KEY `fk_shipment_partner` (`delivery_partner_id`),
  KEY `fk_shipments_created_by` (`created_by`),
  KEY `fk_shipments_updated_by` (`updated_by`),
  CONSTRAINT `fk_shipment_delivery_staff` FOREIGN KEY (`delivery_staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shipment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_shipment_partner` FOREIGN KEY (`delivery_partner_id`) REFERENCES `delivery_partners` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shipments_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shipments_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments`
--

LOCK TABLES `shipments` WRITE;
/*!40000 ALTER TABLE `shipments` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_charges`
--

DROP TABLE IF EXISTS `shipping_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_charges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `zone_id` bigint unsigned DEFAULT NULL,
  `min_order_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `max_order_amount` decimal(10,2) DEFAULT NULL,
  `charge_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_free_above` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shipcharge_zone` (`zone_id`),
  KEY `fk_shipping_charges_created_by` (`created_by`),
  KEY `fk_shipping_charges_updated_by` (`updated_by`),
  CONSTRAINT `fk_shipcharge_zone` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_shipping_charges_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shipping_charges_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_charges`
--

LOCK TABLES `shipping_charges` WRITE;
/*!40000 ALTER TABLE `shipping_charges` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_zones`
--

DROP TABLE IF EXISTS `shipping_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_zones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shipping_zones_created_by` (`created_by`),
  KEY `fk_shipping_zones_updated_by` (`updated_by`),
  CONSTRAINT `fk_shipping_zones_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shipping_zones_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_zones`
--

LOCK TABLES `shipping_zones` WRITE;
/*!40000 ALTER TABLE `shipping_zones` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `size_charts`
--

DROP TABLE IF EXISTS `size_charts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size_charts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `gender` enum('men','women','kids','unisex') COLLATE utf8mb4_unicode_ci NOT NULL,
  `attribute_value_id` bigint unsigned NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_sizechart_cat_gender_value` (`category_id`,`gender`,`attribute_value_id`),
  KEY `idx_sizechart_cat_gender` (`category_id`,`gender`),
  KEY `idx_sizechart_attr_value` (`attribute_value_id`),
  CONSTRAINT `fk_sizechart_attribute_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sizechart_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `size_charts`
--

LOCK TABLES `size_charts` WRITE;
/*!40000 ALTER TABLE `size_charts` DISABLE KEYS */;
INSERT INTO `size_charts` VALUES (4,9,'men',4,0,1,'2026-09-15 08:16:42','2026-09-15 08:16:42'),(5,9,'men',5,1,1,'2026-09-15 08:16:42','2026-09-15 08:16:42'),(6,10,'men',8,0,1,'2026-09-15 08:26:56','2026-09-15 08:26:56'),(7,10,'men',6,1,1,'2026-09-15 08:26:56','2026-09-15 08:26:56'),(8,11,'men',10,0,1,'2026-09-15 08:42:06','2026-09-15 08:42:06'),(9,11,'men',11,1,1,'2026-09-15 08:42:06','2026-09-15 08:42:06');
/*!40000 ALTER TABLE `size_charts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_adjustments`
--

DROP TABLE IF EXISTS `stock_adjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_adjustments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `adjusted_by` bigint unsigned DEFAULT NULL,
  `adjustment_type` enum('add','remove') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stock_adjustments_created_by` (`created_by`),
  KEY `fk_stock_adjustments_updated_by` (`updated_by`),
  KEY `fk_stockadj_user` (`adjusted_by`),
  KEY `fk_stockadj_variant_unit_price` (`variant_unit_price_id`),
  CONSTRAINT `fk_stock_adjustments_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stock_adjustments_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stockadj_user` FOREIGN KEY (`adjusted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stockadj_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_adjustments`
--

LOCK TABLES `stock_adjustments` WRITE;
/*!40000 ALTER TABLE `stock_adjustments` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_adjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_reports`
--

DROP TABLE IF EXISTS `stock_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `report_date` date NOT NULL,
  `opening_stock` int NOT NULL DEFAULT '0',
  `closing_stock` int NOT NULL DEFAULT '0',
  `sold_qty` int NOT NULL DEFAULT '0',
  `generated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stock_reports_created_by` (`created_by`),
  KEY `fk_stock_reports_updated_by` (`updated_by`),
  KEY `fk_stockreport_variant_unit_price` (`variant_unit_price_id`),
  CONSTRAINT `fk_stock_reports_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stock_reports_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stockreport_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_reports`
--

LOCK TABLES `stock_reports` WRITE;
/*!40000 ALTER TABLE `stock_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `uq_user_sessions_token` (`token`),
  KEY `fk_user_sessions_created_by` (`created_by`),
  KEY `fk_user_sessions_updated_by` (`updated_by`),
  KEY `idx_sessions_user` (`user_id`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_sessions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_sessions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_id` bigint unsigned NOT NULL,
  `cust_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive','banned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `phone_verified_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `is_blocked` bigint DEFAULT NULL,
  `blocked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `referral_code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referred_by_agent_id` bigint unsigned DEFAULT NULL,
  `referred_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_phone` (`phone`),
  UNIQUE KEY `users_referral_code` (`referral_code`),
  KEY `fk_users_created_by` (`created_by`),
  KEY `fk_users_role` (`role_id`),
  KEY `fk_users_updated_by` (`updated_by`),
  KEY `idx_users_status` (`status`),
  KEY `fk_users_referred_by_agent` (`referred_by_agent_id`),
  CONSTRAINT `fk_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_users_referred_by_agent` FOREIGN KEY (`referred_by_agent_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `fk_users_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'52f828fc-6601-43f7-b50a-0c10361394e5',1,NULL,'Admin','admin@zellora.com',NULL,'$2b$12$fqqzQpGDV5LAqG.GSkE4x.80VqBXvsMT9Jrg/iMbQCeL8sjWCImbu',NULL,'active','2026-09-15 03:25:14',NULL,'2026-09-17 08:23:41','2026-09-15 03:25:14','2026-09-17 08:23:41',NULL,1,NULL,NULL,NULL,'2026-09-15 03:25:14',NULL,NULL,NULL),(2,'a35a5592-c81f-49a2-986b-805adb3feed2',3,NULL,'John Customer','customer@example.com',NULL,'$2b$12$bflDcxG3iMqgj9sFdzRv4e4pascf6mYj8dwPAKFzrgTXaDPpC3APy',NULL,'active','2026-09-15 03:25:14',NULL,'2026-09-17 06:04:22','2026-09-15 03:25:14','2026-09-17 06:04:22',NULL,1,NULL,NULL,NULL,'2026-09-15 03:25:14',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_attribute_values`
--

DROP TABLE IF EXISTS `variant_attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_attribute_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` bigint unsigned NOT NULL,
  `attribute_id` bigint unsigned NOT NULL,
  `attribute_value_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_variant_attribute` (`variant_id`,`attribute_id`),
  KEY `fk_vav_attribute` (`attribute_id`),
  KEY `fk_vav_value` (`attribute_value_id`),
  CONSTRAINT `fk_vav_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vav_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vav_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_attribute_values`
--

LOCK TABLES `variant_attribute_values` WRITE;
/*!40000 ALTER TABLE `variant_attribute_values` DISABLE KEYS */;
INSERT INTO `variant_attribute_values` VALUES (1,1,1,2,'2026-09-15 03:31:27','2026-09-15 03:31:27'),(2,6,2,4,'2026-09-15 08:17:07','2026-09-15 08:17:07'),(3,7,4,10,'2026-09-15 08:42:34','2026-09-15 08:42:34'),(4,8,4,11,'2026-09-15 08:42:40','2026-09-15 08:42:40'),(5,14,16,13,'2026-09-17 01:45:34','2026-09-17 01:45:34'),(6,15,16,12,'2026-09-17 02:39:26','2026-09-17 02:39:26'),(7,16,16,14,'2026-09-17 02:39:26','2026-09-17 02:39:26'),(8,17,5,24,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(9,17,16,12,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(10,18,5,24,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(11,18,16,13,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(12,19,5,24,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(13,19,16,14,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(14,20,5,25,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(15,20,16,12,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(16,21,5,25,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(17,21,16,13,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(18,22,5,25,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(19,22,16,14,'2026-09-17 02:54:08','2026-09-17 02:54:08'),(20,23,5,26,'2026-09-17 03:28:18','2026-09-17 03:28:18'),(21,23,16,16,'2026-09-17 03:28:18','2026-09-17 03:28:18'),(22,24,16,16,'2026-09-17 03:45:58','2026-09-17 03:45:58'),(23,24,5,25,'2026-09-17 03:45:58','2026-09-17 03:45:58'),(24,25,16,12,'2026-09-17 03:49:52','2026-09-17 03:49:52'),(25,25,5,26,'2026-09-17 03:49:52','2026-09-17 03:49:52'),(28,28,5,24,'2026-09-17 09:13:06','2026-09-17 09:13:06'),(29,29,5,25,'2026-09-17 09:13:07','2026-09-17 09:13:07'),(30,30,5,26,'2026-09-17 09:13:07','2026-09-17 09:13:07');
/*!40000 ALTER TABLE `variant_attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_price_history`
--

DROP TABLE IF EXISTS `variant_price_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_price_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID()',
  `old_base_price` decimal(10,2) DEFAULT NULL,
  `new_base_price` decimal(10,2) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_vph_created_by` (`created_by`),
  KEY `fk_vph_updated_by` (`updated_by`),
  KEY `fk_vph_variant_unit_price` (`variant_unit_price_id`),
  CONSTRAINT `fk_vph_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vph_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vph_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_price_history`
--

LOCK TABLES `variant_price_history` WRITE;
/*!40000 ALTER TABLE `variant_price_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `variant_price_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_unit_prices`
--

DROP TABLE IF EXISTS `variant_unit_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_unit_prices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID()',
  `variant_id` bigint unsigned NOT NULL,
  `unit_id` bigint unsigned NOT NULL,
  `unit_value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `attribute_value_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `uq_variant_unit_prices_sku` (`sku`),
  UNIQUE KEY `uniq_vup_variant_size` (`variant_id`,`attribute_value_id`),
  KEY `fk_vup_created_by` (`created_by`),
  KEY `fk_vup_unit` (`unit_id`),
  KEY `fk_vup_updated_by` (`updated_by`),
  KEY `fk_vup_variant` (`variant_id`),
  KEY `fk_vup_size_value` (`attribute_value_id`),
  CONSTRAINT `fk_vup_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vup_size_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vup_unit` FOREIGN KEY (`unit_id`) REFERENCES `product_units` (`id`),
  CONSTRAINT `fk_vup_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vup_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_unit_prices`
--

LOCK TABLES `variant_unit_prices` WRITE;
/*!40000 ALTER TABLE `variant_unit_prices` DISABLE KEYS */;
INSERT INTO `variant_unit_prices` VALUES (1,'f3295070-c4ee-4782-aea1-991a8781401d',2,1,1.00,'SEO-TEST-TEE-BLUE-PC',499.00,1,1,'2026-09-15 03:40:24','2026-09-15 03:40:24',NULL,1,1,NULL),(2,'2a597359-7f40-458a-88ec-1dc12a9f8165',3,3,1.00,'RV-TEST-TEE-DEFAULT-PC',599.00,1,1,'2026-09-15 04:33:25','2026-09-15 04:33:25',NULL,1,1,NULL),(3,'1f35b9cb-edfa-49d9-b78b-deb375fe0717',4,4,1.00,'SEARCHABLE-VELVET-JACKET-PC',1499.00,1,1,'2026-09-15 05:26:42','2026-09-15 05:26:42',NULL,1,1,NULL),(4,'3134e60b-2877-476c-b03a-47e3f1a237cc',5,5,1.00,'COUPON-TEST-PRODUCT-PC',1000.00,1,1,'2026-09-15 06:12:21','2026-09-15 06:12:21',NULL,1,1,NULL),(5,'fd4da510-050e-4df8-8c21-7bd670b03385',6,6,1.00,'GENDERTESTPRODUCT-M',799.00,1,1,'2026-09-15 08:17:33','2026-09-15 08:17:33',NULL,1,1,NULL),(6,'2897bfcf-5b78-4a0c-977e-ef164e0dff03',7,7,1.00,'STOREFRONTTESTTEE-M',599.00,1,1,'2026-09-15 08:43:42','2026-09-15 08:43:42',NULL,1,1,NULL),(7,'25c16c32-fe34-4134-bc55-fbe915c67d57',8,7,1.00,'STOREFRONTTESTTEE-L',649.00,1,1,'2026-09-15 08:43:54','2026-09-15 08:43:54',NULL,1,1,NULL),(8,'d2f6c695-c51e-4aed-aff1-2aa55a3d7bf9',9,8,1.00,'RES-TEE-PC',499.00,1,1,'2026-09-15 10:07:52','2026-09-15 10:07:52',NULL,1,1,NULL),(9,'4f3f3e39-ffd2-47ca-9465-b87c6edf4094',10,9,1.00,'REFUND-TEE-PC',599.00,1,1,'2026-09-15 23:17:51','2026-09-15 23:17:51',NULL,1,1,NULL),(11,'70305067-850d-4499-9ab9-f8519b3cbe13',12,10,1.00,'T-shirt',300.00,1,1,'2026-09-16 03:24:37','2026-09-16 03:24:37',NULL,NULL,NULL,NULL),(12,'e6224853-087d-464a-98bd-6520a29ded04',14,10,1.00,'RED_S',450.00,0,1,'2026-09-17 02:07:29','2026-09-17 02:07:29',NULL,1,1,NULL),(13,'fe56f684-0cec-47c2-9768-84e72a782537',15,10,1.00,'MENSCLOTHINGTSHIRT-M',799.00,1,1,'2026-09-17 02:39:26','2026-09-17 02:39:26',NULL,1,1,NULL),(14,'a5a12172-02b3-4620-a9f9-251a3cac0fe0',16,10,1.00,'MENSCLOTHINGTSHIRT-L',799.00,1,1,'2026-09-17 02:39:26','2026-09-17 02:39:26',NULL,1,1,NULL),(15,'e2299fed-7801-4c75-8305-58ae27f39192',17,10,1.00,'MENSCLOTHINGTSHIRT-BLACK-M',799.00,1,1,'2026-09-17 02:54:08','2026-09-17 02:54:08',NULL,1,1,NULL),(16,'f617c4e8-e053-4e42-9cff-6a224fe15b93',18,10,1.00,'MENSCLOTHINGTSHIRT-BLACK-S',799.00,1,1,'2026-09-17 02:54:08','2026-09-17 02:54:08',NULL,1,1,NULL),(17,'8def719a-bb23-48f2-8f8f-246c01a4e1c7',19,10,1.00,'MENSCLOTHINGTSHIRT-BLACK-L',799.00,1,1,'2026-09-17 02:54:08','2026-09-17 02:54:08',NULL,1,1,NULL),(18,'f6122f69-496a-4897-aeba-0a833e841c5c',20,10,1.00,'MENSCLOTHINGTSHIRT-WHITE-M',799.00,1,1,'2026-09-17 02:54:08','2026-09-17 02:54:08',NULL,1,1,NULL),(19,'4b0d77d3-46d2-4d9b-ad76-04f634645c27',21,10,1.00,'MENSCLOTHINGTSHIRT-WHITE-S',799.00,1,1,'2026-09-17 02:54:08','2026-09-17 02:54:08',NULL,1,1,NULL),(20,'5e3fe216-82c1-40b5-829a-432cd7b3b05d',22,10,1.00,'MENSCLOTHINGTSHIRT-WHITE-L',799.00,1,1,'2026-09-17 02:54:08','2026-09-17 02:54:08',NULL,1,1,NULL),(21,'2f5e24be-b57f-4db8-b278-7e5556532d99',23,10,1.00,'MENSCLOTHINGTSHIRT-BLUE-XL',899.00,1,1,'2026-09-17 03:28:18','2026-09-17 04:08:46',NULL,1,1,NULL),(22,'7433eb8a-87f0-48c0-9e2c-492f9a0b4d01',24,10,1.00,'MENSCLOTHINGTSHIRT-WHITE-XL-DEMO',100.00,1,1,'2026-09-17 03:46:11','2026-09-17 03:46:11',NULL,1,1,NULL),(23,'24e51654-760b-46b7-a290-1804c08ce45f',25,10,1.00,'DEMO-BLUE-M-3',200.00,1,1,'2026-09-17 03:49:52','2026-09-17 03:49:52',NULL,1,1,NULL),(25,'cd2fa76e-781f-4cd2-8981-5250bd233a0e',28,10,1.00,'MENSCLOTHINGTSHIRTIT-BLACK-M',300.00,0,1,'2026-09-17 09:13:06','2026-09-17 09:13:06',NULL,1,1,12),(26,'8c328553-6818-4a76-9be2-e08a0911f306',28,10,1.00,'MENSCLOTHINGTSHIRTIT-BLACK-S',300.00,0,1,'2026-09-17 09:13:06','2026-09-17 09:13:06',NULL,1,1,13),(27,'25a60910-ede8-4171-bff9-e834baa46d40',28,10,1.00,'MENSCLOTHINGTSHIRTIT-BLACK-L',300.00,0,1,'2026-09-17 09:13:06','2026-09-17 09:13:06',NULL,1,1,14),(28,'edbca831-5cee-49d2-85a4-ec4ab36b5132',28,10,1.00,'MENSCLOTHINGTSHIRTIT-BLACK-XS',300.00,0,1,'2026-09-17 09:13:06','2026-09-17 09:13:06',NULL,1,1,15),(29,'2158bd18-e52b-4405-9618-ad681bd54726',28,10,1.00,'MENSCLOTHINGTSHIRTIT-BLACK-XXL',300.00,0,1,'2026-09-17 09:13:06','2026-09-17 09:13:06',NULL,1,1,17),(30,'fa12dc41-ecbb-4466-b0f7-9234aeeac94c',29,10,1.00,'MENSCLOTHINGTSHIRTIT-WHITE-M',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,12),(31,'ae627549-2ffd-4888-a112-af048fc8f731',29,10,1.00,'MENSCLOTHINGTSHIRTIT-WHITE-L',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,14),(32,'248d50c9-ecd2-4a86-94ba-07d208e3f109',29,10,1.00,'MENSCLOTHINGTSHIRTIT-WHITE-XS',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,15),(33,'bf7d3cea-f016-4d1c-9f83-d09841b51d4e',29,10,1.00,'MENSCLOTHINGTSHIRTIT-WHITE-XXL',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,17),(34,'a4c29cb7-ec57-43bb-a511-4ab99f110d88',30,10,1.00,'MENSCLOTHINGTSHIRTIT-BLUE-M',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,12),(35,'d6c70b45-6c0a-468d-b301-a0dfcf611177',30,10,1.00,'MENSCLOTHINGTSHIRTIT-BLUE-L',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,14),(36,'f8c5c3a7-ccf4-4501-b8ec-c3aa2fe6370b',30,10,1.00,'MENSCLOTHINGTSHIRTIT-BLUE-XS',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,15),(37,'336c751a-f80f-40c7-87a3-092bf3923b69',30,10,1.00,'MENSCLOTHINGTSHIRTIT-BLUE-XL',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,16),(38,'7d7f8606-8e4c-4d57-a9dc-f942832017ed',30,10,1.00,'MENSCLOTHINGTSHIRTIT-BLUE-XXL',300.00,0,1,'2026-09-17 09:13:07','2026-09-17 09:13:07',NULL,1,1,17);
/*!40000 ALTER TABLE `variant_unit_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet_transactions`
--

DROP TABLE IF EXISTS `wallet_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wallet_id` bigint unsigned NOT NULL,
  `type` enum('credit','debit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_wallet_transactions_created_by` (`created_by`),
  KEY `fk_wallet_transactions_updated_by` (`updated_by`),
  KEY `fk_wallettx_wallet` (`wallet_id`),
  CONSTRAINT `fk_wallet_transactions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wallet_transactions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wallettx_wallet` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_transactions`
--

LOCK TABLES `wallet_transactions` WRITE;
/*!40000 ALTER TABLE `wallet_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallet_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wallets_user_id` (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `fk_wallets_created_by` (`created_by`),
  KEY `fk_wallets_updated_by` (`updated_by`),
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wallets_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wallets_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `whatsapp_campaign_recipients`
--

DROP TABLE IF EXISTS `whatsapp_campaign_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `whatsapp_campaign_recipients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'QUEUED',
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `message_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wacr_camp_phone` (`campaign_id`,`phone_number`),
  KEY `idx_wacr_camp_status` (`campaign_id`,`status`),
  CONSTRAINT `fk_wacr_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `whatsapp_campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whatsapp_campaign_recipients`
--

LOCK TABLES `whatsapp_campaign_recipients` WRITE;
/*!40000 ALTER TABLE `whatsapp_campaign_recipients` DISABLE KEYS */;
/*!40000 ALTER TABLE `whatsapp_campaign_recipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `whatsapp_campaigns`
--

DROP TABLE IF EXISTS `whatsapp_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `whatsapp_campaigns` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UUID()',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOM',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `total_recipients` int NOT NULL DEFAULT '0',
  `sent_count` int NOT NULL DEFAULT '0',
  `failed_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wac_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whatsapp_campaigns`
--

LOCK TABLES `whatsapp_campaigns` WRITE;
/*!40000 ALTER TABLE `whatsapp_campaigns` DISABLE KEYS */;
/*!40000 ALTER TABLE `whatsapp_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `whatsapp_templates`
--

DROP TABLE IF EXISTS `whatsapp_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `whatsapp_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FESTIVAL',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whatsapp_templates`
--

LOCK TABLES `whatsapp_templates` WRITE;
/*!40000 ALTER TABLE `whatsapp_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `whatsapp_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UUID()',
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `variant_unit_price_id` bigint unsigned DEFAULT NULL,
  `item_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wishlist_user_product_variant` (`user_id`,`product_id`,`variant_id`),
  KEY `fk_wishlist_items_created_by` (`created_by`),
  KEY `fk_wishlist_items_updated_by` (`updated_by`),
  KEY `fk_wishlist_product` (`product_id`),
  KEY `fk_wishlist_variant` (`variant_id`),
  KEY `fk_wishlist_variant_unit_price` (`variant_unit_price_id`),
  KEY `fk_wishlist_item` (`item_id`),
  CONSTRAINT `fk_wishlist_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wishlist_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_variant_unit_price` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-18 12:58:50

-- DropForeignKey
ALTER TABLE `combo_product_items` DROP FOREIGN KEY `fk_comboitem_variant`;

-- DropForeignKey
ALTER TABLE `offer_items` DROP FOREIGN KEY `fk_offer_items_created_by`;

-- DropForeignKey
ALTER TABLE `offer_items` DROP FOREIGN KEY `fk_offer_items_updated_by`;

-- DropForeignKey
ALTER TABLE `shipments` DROP FOREIGN KEY `fk_shipment_delivery_staff`;

-- DropForeignKey
ALTER TABLE `stock_adjustments` DROP FOREIGN KEY `fk_stockadj_variant`;

-- DropForeignKey
ALTER TABLE `stock_reports` DROP FOREIGN KEY `fk_stockreport_variant`;

-- DropIndex
DROP INDEX `fk_comboitem_variant` ON `combo_product_items`;

-- DropIndex
DROP INDEX `fk_stockadj_variant` ON `stock_adjustments`;

-- DropIndex
DROP INDEX `fk_stockreport_variant` ON `stock_reports`;

-- AlterTable
ALTER TABLE `attribute_values` ADD COLUMN `uuid` VARCHAR(255) NULL DEFAULT 'UUID()';

-- AlterTable
ALTER TABLE `combo_product_items` DROP COLUMN `variant_id`;

-- AlterTable
ALTER TABLE `contact_messages` MODIFY `uuid` VARCHAR(255) NOT NULL DEFAULT 'UUID()';

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `variant_id`;

-- AlterTable
ALTER TABLE `inventory_transactions` DROP COLUMN `variant_id`;

-- AlterTable
ALTER TABLE `offer_items` MODIFY `uuid` VARCHAR(255) NULL DEFAULT 'UUID()';

-- AlterTable
ALTER TABLE `product_attributes` ADD COLUMN `uuid` VARCHAR(255) NULL DEFAULT 'UUID()';

-- AlterTable
ALTER TABLE `product_units` MODIFY `type` ENUM('weight', 'volume', 'count', 'size') NOT NULL DEFAULT 'count';

-- AlterTable
ALTER TABLE `product_variants` ADD COLUMN `color_hex` VARCHAR(7) NULL,
    ADD COLUMN `color_name` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `description`,
    DROP COLUMN `is_featured`,
    DROP COLUMN `short_description`,
    DROP COLUMN `veg_type`;

-- AlterTable
ALTER TABLE `stock_adjustments` DROP COLUMN `variant_id`;

-- AlterTable
ALTER TABLE `stock_reports` DROP COLUMN `variant_id`;

-- AlterTable
ALTER TABLE `variant_price_history` DROP COLUMN `new_sale_price`,
    DROP COLUMN `old_sale_price`,
    DROP COLUMN `variant_id`;

-- CreateTable
CREATE TABLE `category_attributes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `attribute_id` BIGINT UNSIGNED NOT NULL,
    `is_required` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_catattr_category`(`category_id`),
    INDEX `fk_catattr_attribute`(`attribute_id`),
    UNIQUE INDEX `uniq_category_attribute`(`category_id`, `attribute_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variant_attribute_values` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `variant_id` BIGINT UNSIGNED NOT NULL,
    `attribute_id` BIGINT UNSIGNED NOT NULL,
    `attribute_value_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_vav_attribute`(`attribute_id`),
    INDEX `fk_vav_value`(`attribute_value_id`),
    UNIQUE INDEX `uniq_variant_attribute`(`variant_id`, `attribute_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `offer_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_offercat_category`(`category_id`),
    UNIQUE INDEX `uq_offer_category`(`offer_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_brands` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `offer_id` BIGINT UNSIGNED NOT NULL,
    `brand_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_offerbrand_brand`(`brand_id`),
    UNIQUE INDEX `uq_offer_brand`(`offer_id`, `brand_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon_categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `coupon_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_couponcat_category`(`category_id`),
    UNIQUE INDEX `uq_coupon_category`(`coupon_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon_products` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `coupon_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_couponprod_product`(`product_id`),
    UNIQUE INDEX `uq_coupon_product`(`coupon_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_reservations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `variant_unit_price_id` BIGINT UNSIGNED NOT NULL,
    `cart_id` BIGINT UNSIGNED NULL,
    `order_id` BIGINT UNSIGNED NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('active', 'confirmed', 'expired', 'released') NOT NULL DEFAULT 'active',
    `expires_at` TIMESTAMP(0) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_invres_vup`(`variant_unit_price_id`),
    INDEX `fk_invres_cart`(`cart_id`),
    INDEX `fk_invres_order`(`order_id`),
    INDEX `idx_invres_status_expiry`(`status`, `expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_campaigns` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL DEFAULT 'UUID()',
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(100) NOT NULL DEFAULT 'CUSTOM',
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    `message` TEXT NOT NULL,
    `media_url` VARCHAR(500) NULL,
    `scheduled_at` TIMESTAMP(0) NULL,
    `started_at` TIMESTAMP(0) NULL,
    `completed_at` TIMESTAMP(0) NULL,
    `total_recipients` INTEGER NOT NULL DEFAULT 0,
    `sent_count` INTEGER NOT NULL DEFAULT 0,
    `failed_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_wac_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_campaign_recipients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT UNSIGNED NOT NULL,
    `customer_id` BIGINT UNSIGNED NULL,
    `customer_name` VARCHAR(255) NULL,
    `phone_number` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
    `error_message` TEXT NULL,
    `message_id` VARCHAR(100) NULL,
    `sent_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_wacr_camp_status`(`campaign_id`, `status`),
    UNIQUE INDEX `uq_wacr_camp_phone`(`campaign_id`, `phone_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'FESTIVAL',
    `message` TEXT NOT NULL,
    `media_url` VARCHAR(500) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `uq_cartitem_cart_variant_unitprice` ON `cart_items`(`cart_id`, `variant_id`, `variant_unit_price_id`);

-- AddForeignKey
ALTER TABLE `category_attributes` ADD CONSTRAINT `fk_catattr_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `category_attributes` ADD CONSTRAINT `fk_catattr_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `variant_attribute_values` ADD CONSTRAINT `fk_vav_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `variant_attribute_values` ADD CONSTRAINT `fk_vav_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `variant_attribute_values` ADD CONSTRAINT `fk_vav_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `offer_items` ADD CONSTRAINT `fk_offer_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `offer_items` ADD CONSTRAINT `fk_offer_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `offer_categories` ADD CONSTRAINT `fk_offercat_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `offer_categories` ADD CONSTRAINT `fk_offercat_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `offer_brands` ADD CONSTRAINT `fk_offerbrand_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `offer_brands` ADD CONSTRAINT `fk_offerbrand_brand` FOREIGN KEY (`brand_id`) REFERENCES `product_brands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_categories` ADD CONSTRAINT `fk_couponcat_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_categories` ADD CONSTRAINT `fk_couponcat_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_products` ADD CONSTRAINT `fk_couponprod_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_products` ADD CONSTRAINT `fk_couponprod_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inventory_reservations` ADD CONSTRAINT `fk_invres_vup` FOREIGN KEY (`variant_unit_price_id`) REFERENCES `variant_unit_prices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inventory_reservations` ADD CONSTRAINT `fk_invres_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inventory_reservations` ADD CONSTRAINT `fk_invres_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `shipments` ADD CONSTRAINT `fk_shipment_delivery_staff` FOREIGN KEY (`delivery_staff_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `whatsapp_campaign_recipients` ADD CONSTRAINT `fk_wacr_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `whatsapp_campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `contact_messages` RENAME INDEX `uq_contact_messages_uuid` TO `idx_contact_messages_uuid`;

-- RenameIndex
ALTER TABLE `inventories` RENAME INDEX `uq_inventories_variant_unit_price_id` TO `variant_unit_price_id`;

-- RenameIndex
ALTER TABLE `product_variants` RENAME INDEX `uq_product_variants_slug` TO `idx_variant_slug`;

-- RenameIndex
ALTER TABLE `return_requests` RENAME INDEX `uq_return_requests_uuid` TO `idx_return_requests_uuid`;

-- RenameIndex
ALTER TABLE `reviews` RENAME INDEX `uq_reviews_uuid` TO `idx_reviews_uuid`;


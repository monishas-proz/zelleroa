-- AlterTable
ALTER TABLE `products` ADD COLUMN `gender` ENUM('men', 'women', 'kids', 'unisex') NULL;

-- CreateTable
CREATE TABLE `size_charts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `gender` ENUM('men', 'women', 'kids', 'unisex') NOT NULL,
    `attribute_value_id` BIGINT UNSIGNED NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_sizechart_cat_gender`(`category_id`, `gender`),
    INDEX `idx_sizechart_attr_value`(`attribute_value_id`),
    UNIQUE INDEX `uniq_sizechart_cat_gender_value`(`category_id`, `gender`, `attribute_value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `size_charts` ADD CONSTRAINT `fk_sizechart_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `size_charts` ADD CONSTRAINT `fk_sizechart_attribute_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;


-- Data migration: backfill existing products to unisex where gender is unknown
UPDATE `products` SET `gender` = 'unisex' WHERE `gender` IS NULL;

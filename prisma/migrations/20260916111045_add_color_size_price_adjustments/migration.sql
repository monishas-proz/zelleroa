-- AlterTable
ALTER TABLE `attribute_values` ADD COLUMN `price_adjustment` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `product_variants` ADD COLUMN `price_adjustment` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

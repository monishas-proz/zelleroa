import "dotenv/config";
import mariadb from "mariadb";

/**
 * One-off backfill for the new Category -> Product -> Style -> Item -> Color
 * -> Size hierarchy (a second, one-level-up repeat of migrate-item-hierarchy.ts's
 * Product -> Item insertion).
 *
 * Run AFTER `npm run db:sync` against the updated schema.prisma. db:sync is
 * additive and name-matches by table: since `items` already existed, it left
 * its rows in place and only added the new `style_id` column to it; since
 * `styles` and `style_images` were new names, it created them fresh (empty,
 * with the right columns/FKs). So at this point:
 *   - `items` physically holds the OLD Item rows (what should become Style
 *     rows) plus a new empty `style_id` column - the extra old-Item-only
 *     columns (product_id, ingredients, is_ready_to_mix, cooking_recipe,
 *     shelf_life, veg_type) are still there too.
 *   - `styles` is empty.
 *   - `product_variants.item_id`, `cart_items/order_items/wishlist_items
 *     .item_id` all still point at the OLD `items.id` values.
 *
 * This script:
 *   1. Copies every `items` row into `styles`, preserving `id` (so existing
 *      FKs that point at that id keep pointing at the same row, just via the
 *      new `styles` table).
 *   2. Backfills the new `style_id` on cart/order/wishlist items from their
 *      existing `item_id` (same numeric value as the new style's id, thanks
 *      to step 1 preserving ids).
 *   3. Turns each existing `items` row into its own Style's default Item, by
 *      self-referencing: `items.style_id = items.id`. This means
 *      `product_variants.item_id` (and cart/order/wishlist `item_id`) need
 *      NO repointing at all - they already reference the right row, which
 *      now correctly sits under `style_id = its own id`.
 *   4. Drops the old Style-only columns/FK/index that don't belong on the
 *      new Item model, and enforces NOT NULL + already-created FKs.
 *
 * BACK UP THE DATABASE BEFORE RUNNING THIS. MySQL/MariaDB DDL is not fully
 * transactional - a failure partway through can leave the schema half
 * migrated, and the only real recovery is restoring from that backup.
 *
 * Usage: node --experimental-strip-types scripts/migrate-style-hierarchy.ts
 */

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in .env");
  }
  const url = new URL(databaseUrl);
  const conn = await mariadb.createConnection({
    host: url.hostname || "localhost",
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username || "root"),
    password: decodeURIComponent(url.password || ""),
    database: url.pathname.slice(1),
    allowPublicKeyRetrieval: true,
    multipleStatements: true,
  });

  const hasColumn = async (table: string, column: string) => {
    const rows: any[] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column],
    );
    return Number(rows[0].cnt) > 0;
  };

  const hasConstraint = async (table: string, name: string) => {
    const rows: any[] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.TABLE_CONSTRAINTS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
      [table, name],
    );
    return Number(rows[0].cnt) > 0;
  };

  console.log("Step 1/6: copying items -> styles (preserving id)...");
  await conn.query(`
    INSERT INTO styles (
      id, uuid, product_id, name, slug, sku, short_description, description,
      ingredients, is_ready_to_mix, cooking_recipe, shelf_life, veg_type,
      base_price, is_featured, is_default, is_active, out_of_stock,
      created_at, updated_at, deleted_at, created_by, updated_by
    )
    SELECT
      i.id, i.uuid, i.product_id, i.name, i.slug, i.sku, i.short_description, i.description,
      i.ingredients, i.is_ready_to_mix, i.cooking_recipe, i.shelf_life, i.veg_type,
      i.base_price, i.is_featured, i.is_default, i.is_active, i.out_of_stock,
      i.created_at, i.updated_at, i.deleted_at, i.created_by, i.updated_by
    FROM items i
    WHERE NOT EXISTS (SELECT 1 FROM styles s WHERE s.id = i.id);
  `);
  const [{ next_id }] = (await conn.query(
    `SELECT IFNULL(MAX(id), 0) + 1 AS next_id FROM styles;`,
  )) as any[];
  await conn.query(`ALTER TABLE styles AUTO_INCREMENT = ${Number(next_id)};`);

  console.log("Step 2/6: backfilling style_id on cart_items/order_items/wishlist_items from item_id...");
  if (await hasColumn("cart_items", "style_id")) {
    await conn.query(`UPDATE cart_items SET style_id = item_id WHERE style_id IS NULL;`);
  }
  if (await hasColumn("order_items", "style_id")) {
    await conn.query(`UPDATE order_items SET style_id = item_id WHERE style_id IS NULL;`);
  }
  if (await hasColumn("wishlist_items", "style_id")) {
    await conn.query(`UPDATE wishlist_items SET style_id = item_id WHERE style_id IS NULL AND item_id IS NOT NULL;`);
  }

  console.log("Step 3/6: turning each existing items row into its own Style's default Item (self-reference)...");
  await conn.query(`UPDATE items SET style_id = id WHERE style_id IS NULL;`);

  console.log("Step 4/6: dropping the old Style-only columns/FK/index from items...");
  if (await hasConstraint("items", "fk_item_product")) {
    await conn.query(`ALTER TABLE items DROP FOREIGN KEY fk_item_product;`);
  }
  const dropIndexIfExists = async (table: string, index: string) => {
    const rows: any[] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
      [table, index],
    );
    if (Number(rows[0].cnt) > 0) {
      await conn.query(`ALTER TABLE ${table} DROP INDEX ${index};`);
    }
  };
  await dropIndexIfExists("items", "idx_item_product");
  for (const col of [
    "product_id",
    "ingredients",
    "is_ready_to_mix",
    "cooking_recipe",
    "shelf_life",
    "veg_type",
  ]) {
    if (await hasColumn("items", col)) {
      await conn.query(`ALTER TABLE items DROP COLUMN ${col};`);
    }
  }

  console.log("Step 5/6: enforcing NOT NULL on the new style_id/style_id columns...");
  await conn.query(`ALTER TABLE items MODIFY style_id BIGINT UNSIGNED NOT NULL;`);
  if (await hasColumn("cart_items", "style_id")) {
    await conn.query(`ALTER TABLE cart_items MODIFY style_id BIGINT UNSIGNED NOT NULL;`);
  }
  if (await hasColumn("order_items", "style_id")) {
    await conn.query(`ALTER TABLE order_items MODIFY style_id BIGINT UNSIGNED NOT NULL;`);
  }

  console.log("Step 6/6: sanity check row counts...");
  const [check] = await conn.query(`
    SELECT
      (SELECT COUNT(*) FROM styles) AS styles_cnt,
      (SELECT COUNT(*) FROM items) AS items_cnt,
      (SELECT COUNT(*) FROM items WHERE style_id IS NULL) AS items_missing_style,
      (SELECT COUNT(*) FROM product_variants pv LEFT JOIN items i ON i.id = pv.item_id WHERE i.id IS NULL) AS orphaned_variants
  `) as any[];
  console.log(check);
  if (Number(check.items_missing_style) > 0 || Number(check.orphaned_variants) > 0) {
    throw new Error("Sanity check failed - inspect before proceeding further.");
  }

  console.log("✓ Style hierarchy migration completed.");
  await conn.end();
}

run().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});

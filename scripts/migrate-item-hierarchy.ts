import "dotenv/config";
import mariadb from "mariadb";

/**
 * One-off backfill for the new Category -> Product -> Item -> Color -> Size
 * hierarchy. Run AFTER `npm run db:sync` has additively created the `items`,
 * `item_images` tables and the new nullable columns on `product_variants`,
 * `cart_items`, `order_items`, `wishlist_items`, `variant_unit_prices`
 * (schema.prisma already declares the target shape).
 *
 * This script only exists because the project's db:sync (scripts/db-sync.cjs)
 * can create tables/columns but never renames or drops them - so the
 * rename (`product_variants.product_id` -> `item_id`) and drops
 * (`products.sku/base_price/sale_price`, the grocery fields that moved off
 * `product_variants`) have to happen here by hand.
 *
 * BACK UP THE DATABASE BEFORE RUNNING THIS. MySQL/MariaDB DDL is not fully
 * transactional - a failure partway through can leave the schema half
 * migrated, and the only real recovery is restoring from that backup.
 *
 * Usage: node --experimental-strip-types scripts/migrate-item-hierarchy.ts
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

  console.log("Step 1/6: backfilling one Item per existing Product...");
  await conn.query(`
    INSERT INTO items (
      uuid, product_id, name, slug, sku, short_description, description,
      ingredients, is_ready_to_mix, cooking_recipe, shelf_life, veg_type,
      base_price, is_featured, is_default, is_active, out_of_stock,
      created_at, updated_at, created_by, updated_by
    )
    SELECT
      UUID(), p.id, p.name, CONCAT(p.slug, '-item'), p.sku, NULL, NULL,
      NULL, 0, NULL, NULL, 'na',
      p.base_price, 0, 1, p.is_active, 0,
      p.created_at, p.updated_at, p.created_by, p.updated_by
    FROM products p
    WHERE NOT EXISTS (SELECT 1 FROM items i WHERE i.product_id = p.id);
  `);

  console.log("Step 2/6: backfilling style fields onto Items from each product's default (or first) variant...");
  await conn.query(`
    UPDATE items i
    JOIN product_variants pv ON pv.product_id = i.product_id AND pv.is_default = 1
    SET i.short_description = pv.short_description,
        i.description = pv.description,
        i.ingredients = pv.ingredients,
        i.is_ready_to_mix = pv.is_ready_to_mix,
        i.cooking_recipe = pv.cooking_recipe,
        i.shelf_life = pv.shelf_life,
        i.veg_type = pv.veg_type
    WHERE i.description IS NULL AND i.short_description IS NULL;
  `);
  await conn.query(`
    UPDATE items i
    JOIN (
      SELECT product_id, MIN(id) AS first_id
      FROM product_variants
      GROUP BY product_id
    ) f ON f.product_id = i.product_id
    JOIN product_variants pv ON pv.id = f.first_id
    SET i.short_description = pv.short_description,
        i.description = pv.description,
        i.ingredients = pv.ingredients,
        i.is_ready_to_mix = pv.is_ready_to_mix,
        i.cooking_recipe = pv.cooking_recipe,
        i.shelf_life = pv.shelf_life,
        i.veg_type = pv.veg_type
    WHERE i.description IS NULL AND i.short_description IS NULL;
  `);

  console.log("Step 3/6: repointing product_variants.item_id at the new Items...");
  await conn.query(`
    UPDATE product_variants pv
    JOIN items i ON i.product_id = pv.product_id
    SET pv.item_id = i.id
    WHERE pv.item_id IS NULL OR pv.item_id = 0;
  `);

  // NOTE: db-sync.cjs adds item_id as NOT NULL with no @default (Prisma schema
  // has no "?"), and on a non-empty table MySQL/MariaDB in non-strict mode
  // silently backfills existing rows with 0 instead of leaving them NULL - so
  // every "IS NULL" check below also has to check "= 0", or these UPDATEs
  // silently match zero rows and every pre-existing row is left pointing at a
  // nonexistent item_id 0 (seen firsthand: 24 product_variants + 2 cart_items
  // were left unrepointed before this check was added).
  console.log("Step 4/6: backfilling item_id on cart_items, order_items, wishlist_items...");
  if (await hasColumn("cart_items", "item_id")) {
    await conn.query(`
      UPDATE cart_items ci
      JOIN product_variants pv ON pv.id = ci.variant_id
      SET ci.item_id = pv.item_id
      WHERE ci.item_id IS NULL OR ci.item_id = 0;
    `);
  }
  if (await hasColumn("order_items", "item_id")) {
    await conn.query(`
      UPDATE order_items oi
      JOIN product_variants pv ON pv.id = oi.variant_id
      SET oi.item_id = pv.item_id,
          oi.item_name_snapshot = COALESCE(NULLIF(oi.item_name_snapshot, ''), oi.product_name_snapshot)
      WHERE oi.item_id IS NULL OR oi.item_id = 0;
    `);
  }
  if (await hasColumn("wishlist_items", "item_id")) {
    await conn.query(`
      UPDATE wishlist_items wi
      JOIN product_variants pv ON pv.id = wi.variant_id
      SET wi.item_id = pv.item_id
      WHERE (wi.item_id IS NULL OR wi.item_id = 0) AND wi.variant_id IS NOT NULL;
    `);
  }

  console.log("Step 5/6: enforcing NOT NULL + foreign keys, dropping the old product_id path...");

  // product_variants.item_id -> NOT NULL + FK, then drop the old product_id FK/column
  await conn.query(`ALTER TABLE product_variants MODIFY item_id BIGINT UNSIGNED NOT NULL;`);
  if (!(await hasConstraint("product_variants", "fk_variant_item"))) {
    await conn.query(`
      ALTER TABLE product_variants
      ADD CONSTRAINT fk_variant_item FOREIGN KEY (item_id) REFERENCES items (id);
    `);
  }
  if (await hasConstraint("product_variants", "fk_variant_product")) {
    await conn.query(`ALTER TABLE product_variants DROP FOREIGN KEY fk_variant_product;`);
  }
  if (await hasColumn("product_variants", "product_id")) {
    await conn.query(`ALTER TABLE product_variants DROP COLUMN product_id;`);
  }
  for (const col of [
    "short_description",
    "description",
    "ingredients",
    "is_ready_to_mix",
    "cooking_recipe",
    "shelf_life",
    "veg_type",
  ]) {
    if (await hasColumn("product_variants", col)) {
      await conn.query(`ALTER TABLE product_variants DROP COLUMN ${col};`);
    }
  }

  // cart_items.item_id -> NOT NULL + FK
  if (await hasColumn("cart_items", "item_id")) {
    await conn.query(`ALTER TABLE cart_items MODIFY item_id BIGINT UNSIGNED NOT NULL;`);
    if (!(await hasConstraint("cart_items", "fk_cartitem_item"))) {
      await conn.query(`
        ALTER TABLE cart_items
        ADD CONSTRAINT fk_cartitem_item FOREIGN KEY (item_id) REFERENCES items (id);
      `);
    }
  }

  // order_items.item_id -> NOT NULL + FK (NoAction, matching product/variant FKs)
  if (await hasColumn("order_items", "item_id")) {
    await conn.query(`ALTER TABLE order_items MODIFY item_id BIGINT UNSIGNED NOT NULL;`);
    if (!(await hasConstraint("order_items", "fk_orderitem_item"))) {
      await conn.query(`
        ALTER TABLE order_items
        ADD CONSTRAINT fk_orderitem_item FOREIGN KEY (item_id) REFERENCES items (id);
      `);
    }
  }
  if (await hasColumn("order_items", "item_name_snapshot")) {
    await conn.query(`
      UPDATE order_items SET item_name_snapshot = product_name_snapshot
      WHERE item_name_snapshot IS NULL OR item_name_snapshot = '';
    `);
    await conn.query(`ALTER TABLE order_items MODIFY item_name_snapshot VARCHAR(200) NOT NULL;`);
  }

  // wishlist_items.item_id stays nullable (matches its already-nullable variant_id); just add the FK
  if (await hasColumn("wishlist_items", "item_id") && !(await hasConstraint("wishlist_items", "fk_wishlist_item"))) {
    await conn.query(`
      ALTER TABLE wishlist_items
      ADD CONSTRAINT fk_wishlist_item FOREIGN KEY (item_id) REFERENCES items (id);
    `);
  }

  console.log("Step 6/6: dropping the now-redundant Product.sku/base_price/sale_price...");
  if (await hasConstraint("products", "sku")) {
    // unique key on sku shares its name with the column in some MySQL versions; guarded drop
    try {
      await conn.query(`ALTER TABLE products DROP INDEX sku;`);
    } catch {
      // ignore if it doesn't exist under this name
    }
  }
  for (const col of ["sku", "base_price", "sale_price"]) {
    if (await hasColumn("products", col)) {
      await conn.query(`ALTER TABLE products DROP COLUMN ${col};`);
    }
  }

  console.log("✓ Item hierarchy migration completed.");
  await conn.end();
}

run().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});

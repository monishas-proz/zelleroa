import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Read-only sanity check for scripts/migrate-item-hierarchy.ts. Safe to
 * re-run any time.
 *
 * Usage: node --experimental-strip-types scripts/verify-item-migration.ts
 */

function createClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  const url = new URL(databaseUrl);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
  });
  return new PrismaClient({ adapter });
}

const prisma = createClient();

async function main() {
  let ok = true;

  const productCount = await prisma.product.count();
  const itemCount = await prisma.item.count();
  console.log(`Products: ${productCount}, Items: ${itemCount}`);
  if (productCount !== itemCount) {
    ok = false;
    console.error(`✗ Expected exactly one Item per Product (${productCount} products, ${itemCount} items)`);
  } else {
    console.log("✓ Product count matches Item count");
  }

  const orphanVariants: Array<{ cnt: bigint }> = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM product_variants WHERE item_id = 0`,
  );
  const orphanVariantCount = Number(orphanVariants[0]?.cnt ?? 0);
  if (orphanVariantCount > 0) {
    ok = false;
    console.error(`✗ ${orphanVariantCount} product_variants rows have an invalid item_id (0)`);
  } else {
    console.log("✓ No product_variants rows with an invalid item_id (0)");
  }

  const orphanCartItems: Array<{ cnt: bigint }> = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM cart_items WHERE item_id = 0`,
  );
  const orphanCartCount = Number(orphanCartItems[0]?.cnt ?? 0);
  if (orphanCartCount > 0) {
    ok = false;
    console.error(`✗ ${orphanCartCount} cart_items rows have an invalid item_id (0)`);
  } else {
    console.log("✓ No cart_items rows with an invalid item_id (0)");
  }

  const orphanOrderItems: Array<{ cnt: bigint }> = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM order_items WHERE item_id = 0`,
  );
  const orphanOrderCount = Number(orphanOrderItems[0]?.cnt ?? 0);
  if (orphanOrderCount > 0) {
    ok = false;
    console.error(`✗ ${orphanOrderCount} order_items rows have an invalid item_id (0)`);
  } else {
    console.log("✓ No order_items rows with an invalid item_id (0)");
  }

  await prisma.$disconnect();

  if (!ok) {
    console.error("\nVerification FAILED - see errors above.");
    process.exit(1);
  }
  console.log("\nVerification passed.");
}

main().catch((err) => {
  console.error("Fatal verification error:", err);
  process.exit(1);
});

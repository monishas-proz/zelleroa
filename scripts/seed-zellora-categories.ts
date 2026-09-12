import "dotenv/config";
import crypto from "crypto";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

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

interface CategoryNode {
  name: string;
  slug: string;
  children?: CategoryNode[];
}

// Zellora marketplace taxonomy — 11 independent root trees, matching the
// "Zellora Marketplace Categories" spec. Women/Men keep their own gender-specific
// Clothing/Footwear/Bags/Accessories subtrees; Bags/Watches/Jewellery/Footwear/
// Lifestyle are separate standalone root trees rather than being duplicated under
// every gender (ProductCategory is a strict single-parent tree).
const TAXONOMY: CategoryNode[] = [
  {
    name: "Women",
    slug: "women",
    children: [
      {
        name: "Clothing",
        slug: "women-clothing",
        children: [
          { name: "Dresses", slug: "women-dresses" },
          { name: "Tops", slug: "women-tops" },
          { name: "T-Shirts", slug: "women-t-shirts" },
          { name: "Shirts", slug: "women-shirts" },
          { name: "Jeans", slug: "women-jeans" },
          { name: "Trousers", slug: "women-trousers" },
          { name: "Skirts", slug: "women-skirts" },
          { name: "Kurtis", slug: "women-kurtis" },
          { name: "Ethnic Wear", slug: "women-ethnic-wear" },
          { name: "Sarees", slug: "women-sarees" },
          { name: "Co-ords", slug: "women-co-ords" },
          { name: "Jumpsuits", slug: "women-jumpsuits" },
          { name: "Loungewear", slug: "women-loungewear" },
          { name: "Activewear", slug: "women-activewear" },
        ],
      },
      {
        name: "Footwear",
        slug: "women-footwear",
        children: [
          { name: "Heels", slug: "women-heels" },
          { name: "Flats", slug: "women-flats" },
          { name: "Sneakers", slug: "women-sneakers" },
          { name: "Sandals", slug: "women-sandals" },
          { name: "Boots", slug: "women-boots" },
        ],
      },
      {
        name: "Bags",
        slug: "women-bags",
        children: [
          { name: "Handbags", slug: "women-handbags" },
          { name: "Shoulder Bags", slug: "women-shoulder-bags" },
          { name: "Sling Bags", slug: "women-sling-bags" },
          { name: "Tote Bags", slug: "women-tote-bags" },
          { name: "Backpacks", slug: "women-backpacks" },
          { name: "Wallets", slug: "women-wallets" },
        ],
      },
      {
        name: "Accessories",
        slug: "women-accessories",
        children: [
          { name: "Jewellery", slug: "women-jewellery" },
          { name: "Sunglasses", slug: "women-sunglasses" },
          { name: "Watches", slug: "women-watches" },
          { name: "Belts", slug: "women-belts" },
          { name: "Hair Accessories", slug: "women-hair-accessories" },
          { name: "Scarves", slug: "women-scarves" },
        ],
      },
    ],
  },
  {
    name: "Men",
    slug: "men",
    children: [
      {
        name: "Clothing",
        slug: "men-clothing",
        children: [
          { name: "T-Shirts", slug: "men-t-shirts" },
          { name: "Shirts", slug: "men-shirts" },
          { name: "Jeans", slug: "men-jeans" },
          { name: "Trousers", slug: "men-trousers" },
          { name: "Shorts", slug: "men-shorts" },
          { name: "Jackets", slug: "men-jackets" },
          { name: "Hoodies", slug: "men-hoodies" },
          { name: "Ethnic Wear", slug: "men-ethnic-wear" },
          { name: "Activewear", slug: "men-activewear" },
        ],
      },
      {
        name: "Footwear",
        slug: "men-footwear",
        children: [
          { name: "Sneakers", slug: "men-sneakers" },
          { name: "Formal Shoes", slug: "men-formal-shoes" },
          { name: "Casual Shoes", slug: "men-casual-shoes" },
          { name: "Sandals", slug: "men-sandals" },
          { name: "Boots", slug: "men-boots" },
        ],
      },
      {
        name: "Accessories",
        slug: "men-accessories",
        children: [
          { name: "Watches", slug: "men-watches" },
          { name: "Wallets", slug: "men-wallets" },
          { name: "Belts", slug: "men-belts" },
          { name: "Sunglasses", slug: "men-sunglasses" },
          { name: "Caps", slug: "men-caps" },
          { name: "Bags", slug: "men-bags" },
        ],
      },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    children: [
      { name: "Girls", slug: "kids-girls" },
      { name: "Boys", slug: "kids-boys" },
      { name: "Baby", slug: "kids-baby" },
      { name: "Kids Clothing", slug: "kids-clothing" },
      { name: "Kids Footwear", slug: "kids-footwear" },
      { name: "Kids Accessories", slug: "kids-accessories" },
    ],
  },
  {
    name: "Beauty",
    slug: "beauty",
    children: [
      { name: "Makeup", slug: "beauty-makeup" },
      { name: "Skincare", slug: "beauty-skincare" },
      { name: "Haircare", slug: "beauty-haircare" },
      { name: "Fragrance", slug: "beauty-fragrance" },
      { name: "Bath & Body", slug: "beauty-bath-body" },
      { name: "Beauty Tools", slug: "beauty-tools" },
    ],
  },
  {
    name: "Watches",
    slug: "watches",
    children: [
      { name: "Men", slug: "watches-men" },
      { name: "Women", slug: "watches-women" },
      { name: "Smart Watches", slug: "watches-smart" },
      { name: "Analog Watches", slug: "watches-analog" },
      { name: "Luxury Watches", slug: "watches-luxury" },
      { name: "Casual Watches", slug: "watches-casual" },
    ],
  },
  {
    name: "Bags",
    slug: "bags",
    children: [
      { name: "Handbags", slug: "bags-handbags" },
      { name: "Sling Bags", slug: "bags-sling" },
      { name: "Shoulder Bags", slug: "bags-shoulder" },
      { name: "Tote Bags", slug: "bags-tote" },
      { name: "Backpacks", slug: "bags-backpacks" },
      { name: "Laptop Bags", slug: "bags-laptop" },
      { name: "Travel Bags", slug: "bags-travel" },
      { name: "Wallets", slug: "bags-wallets" },
    ],
  },
  {
    name: "Jewellery",
    slug: "jewellery",
    children: [
      { name: "Earrings", slug: "jewellery-earrings" },
      { name: "Necklaces", slug: "jewellery-necklaces" },
      { name: "Rings", slug: "jewellery-rings" },
      { name: "Bracelets", slug: "jewellery-bracelets" },
      { name: "Bangles", slug: "jewellery-bangles" },
      { name: "Fashion Jewellery", slug: "jewellery-fashion" },
    ],
  },
  {
    name: "Footwear",
    slug: "footwear",
    children: [
      { name: "Sneakers", slug: "footwear-sneakers" },
      { name: "Heels", slug: "footwear-heels" },
      { name: "Flats", slug: "footwear-flats" },
      { name: "Sandals", slug: "footwear-sandals" },
      { name: "Boots", slug: "footwear-boots" },
      { name: "Formal Shoes", slug: "footwear-formal" },
      { name: "Casual Shoes", slug: "footwear-casual" },
    ],
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    children: [
      { name: "Travel Accessories", slug: "lifestyle-travel" },
      { name: "Home Accessories", slug: "lifestyle-home" },
      { name: "Fitness Accessories", slug: "lifestyle-fitness" },
      { name: "Gadgets", slug: "lifestyle-gadgets" },
      { name: "Fashion Accessories", slug: "lifestyle-fashion-accessories" },
    ],
  },
];

async function upsertCategory(
  node: CategoryNode,
  parentId: bigint | null,
  sortOrder: number
): Promise<void> {
  const existing = await prisma.productCategory.findFirst({
    where: { slug: node.slug },
  });

  let categoryId: bigint;
  if (existing) {
    await prisma.productCategory.update({
      where: { id: existing.id },
      data: {
        name: node.name,
        parentId: parentId ?? undefined,
        sortOrder,
        isActive: true,
        status: true,
      },
    });
    categoryId = existing.id;
    console.log(`  updated: ${node.name} (${node.slug})`);
  } else {
    const created = await prisma.productCategory.create({
      data: {
        uuid: crypto.randomUUID(),
        name: node.name,
        slug: node.slug,
        parentId: parentId ?? undefined,
        sortOrder,
        isActive: true,
        status: true,
      },
    });
    categoryId = created.id;
    console.log(`  created: ${node.name} (${node.slug})`);
  }

  if (node.children?.length) {
    for (let i = 0; i < node.children.length; i++) {
      await upsertCategory(node.children[i], categoryId, i);
    }
  }
}

async function main() {
  console.log("Seeding Zellora category taxonomy...");
  for (let i = 0; i < TAXONOMY.length; i++) {
    await upsertCategory(TAXONOMY[i], null, i);
  }
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

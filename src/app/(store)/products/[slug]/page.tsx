import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { catalogService } from "@/features/customers/services/catalog.service";
import { styleDefaultItemId, itemHref } from "@/features/customers/utils/style-default-item";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "Zellora";

/** `slug` is the Style UUID - the Style is what the storefront lists and links to. */
async function getStyleForSeo(slug: string) {
  try {
    return await catalogService.getStyleByUuid(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const style = await getStyleForSeo(slug);

  if (!style) {
    return { title: `Product Not Found | ${SITE_NAME}` };
  }

  const title = `${style.name}${style.brand ? ` by ${style.brand.name}` : ""} | ${SITE_NAME}`;
  const description =
    (style.description || style.shortDescription)?.slice(0, 160) ||
    `Shop ${style.name} at ${SITE_NAME}. ${style.category ? `Explore our ${style.category.name} collection.` : ""}`;
  const canonicalUrl = `${SITE_URL}/products/${slug}`;
  const image = style.image || undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const style = await getStyleForSeo(slug);

  // A Style is never shown as a page of Items to choose between - each Item
  // has its own page, so this link opens the Style's default Item. Called
  // outside any try/catch: `redirect` works by throwing.
  const itemId = style ? styleDefaultItemId(style) : null;
  if (itemId) redirect(itemHref(itemId));

  return <ProductDetailClient slug={slug} />;
}

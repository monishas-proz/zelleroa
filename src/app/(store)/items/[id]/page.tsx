import type { Metadata } from "next";
import { catalogService } from "@/features/customers/services/catalog.service";
import { ItemDetailClient } from "./ItemDetailClient";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "Zellora";

async function getItemForSeo(id: string) {
  try {
    return await catalogService.getItemByUuid(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ItemDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemForSeo(id);

  if (!item) {
    return { title: `Item Not Found | ${SITE_NAME}` };
  }

  const title = `${item.name}${item.brand ? ` by ${item.brand.name}` : ""} | ${SITE_NAME}`;
  const description =
    item.shortDescription?.slice(0, 160) ||
    item.description?.slice(0, 160) ||
    `Shop ${item.name} at ${SITE_NAME}.`;
  const canonicalUrl = `${SITE_URL}/items/${id}`;
  const image = item.image || undefined;

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

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  const item = await getItemForSeo(id);

  // Every Colour's every Size is separately priced and stocked, so the Item is
  // described to crawlers as an aggregate offer over those rows.
  const sizes = item?.colors.flatMap((color) => color.unitPrices) ?? [];

  const jsonLd = item
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: item.name,
        description: item.shortDescription || item.description || undefined,
        image: item.image ? [item.image] : undefined,
        brand: item.brand ? { "@type": "Brand", name: item.brand.name } : undefined,
        sku: sizes[0]?.sku,
        offers:
          sizes.length > 0
            ? {
                "@type": "AggregateOffer",
                priceCurrency: "INR",
                lowPrice: Math.min(...sizes.map((size) => size.sellingPrice)),
                highPrice: Math.max(...sizes.map((size) => size.sellingPrice)),
                offerCount: sizes.length,
                availability: sizes.some((size) => size.inStock)
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              }
            : undefined,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ItemDetailClient itemId={id} />
    </>
  );
}

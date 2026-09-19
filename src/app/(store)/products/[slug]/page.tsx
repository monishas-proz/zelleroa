import type { Metadata } from "next";
import { catalogService } from "@/features/customers/services/catalog.service";
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

  // Every sellable Colour+Size row under the Style - that is what an offer
  // actually quotes a price for.
  const sellableRows =
    style?.items.flatMap((item) =>
      item.colors.flatMap((color) => color.unitPrices)
    ) ?? [];

  const jsonLd = style
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: style.name,
        description: style.description || style.shortDescription || undefined,
        image: style.image ? [style.image] : undefined,
        brand: style.brand ? { "@type": "Brand", name: style.brand.name } : undefined,
        sku: sellableRows[0]?.sku,
        offers:
          sellableRows.length > 0
            ? {
                "@type": "AggregateOffer",
                priceCurrency: "INR",
                lowPrice: Math.min(...sellableRows.map((r) => r.sellingPrice)),
                highPrice: Math.max(...sellableRows.map((r) => r.sellingPrice)),
                offerCount: sellableRows.length,
                availability: sellableRows.some((r) => r.inStock)
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
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient slug={slug} />
    </>
  );
}

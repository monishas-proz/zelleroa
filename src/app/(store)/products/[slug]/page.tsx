import type { Metadata } from "next";
import { catalogService } from "@/features/customers/services/catalog.service";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "Zellora";

async function getProductForSeo(slug: string) {
  try {
    return await catalogService.getProductByUuid(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductForSeo(slug);

  if (!product) {
    return { title: `Product Not Found | ${SITE_NAME}` };
  }

  const title = `${product.name}${product.brand ? ` by ${product.brand.name}` : ""} | ${SITE_NAME}`;
  const description =
    product.description?.slice(0, 160) ||
    `Shop ${product.name} at ${SITE_NAME}. ${product.category ? `Explore our ${product.category.name} collection.` : ""}`;
  const canonicalUrl = `${SITE_URL}/products/${slug}`;
  const image = product.image || undefined;

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
  const product = await getProductForSeo(slug);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || undefined,
        image: product.image ? [product.image] : undefined,
        brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
        sku: product.variants[0]?.sku,
        offers:
          product.variants.length > 0
            ? {
                "@type": "AggregateOffer",
                priceCurrency: "INR",
                lowPrice: Math.min(...product.variants.map((v) => v.salePrice)),
                highPrice: Math.max(...product.variants.map((v) => v.salePrice)),
                offerCount: product.variants.length,
                availability: product.variants.some((v) => !v.outOfStock)
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

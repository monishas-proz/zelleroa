import type { Metadata } from "next";
import { catalogService } from "@/features/customers/services/catalog.service";
import { CategoryProductsClient } from "./CategoryProductsClient";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "Zellora";

async function getCategoryForSeo(slug: string) {
  if (slug === "all") return null;
  try {
    return await catalogService.getCategoryByUuid(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryForSeo(slug);

  const title = category
    ? `${category.name} | ${SITE_NAME}`
    : `Shop All Collections | ${SITE_NAME}`;
  const description = category
    ? `Shop the ${category.name} collection at ${SITE_NAME} - handcrafted fashion and premium fabrics curated with care.`
    : `Browse the full ${SITE_NAME} collection - premium fashion, watches, and lifestyle pieces.`;
  const canonicalUrl = `${SITE_URL}/categories/${slug}`;

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
      images: category?.image ? [{ url: category.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category?.image ? [category.image] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryForSeo(slug);

  const jsonLd = category
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.name,
        url: `${SITE_URL}/categories/${slug}`,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
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
      <CategoryProductsClient slug={slug} />
    </>
  );
}

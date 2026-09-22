import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { catalogListingRepository } from "@/features/customers/repositories/catalog-listing.repository";
import { CategoryListingView } from "@/features/customers/components/catalog/listing/CategoryListingView";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "Zellora";

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return slug.trim();
  }
}

/**
 * `all`, a category slug in any case (`mens_clothing`, `MENS-CLOTHING`) or a
 * category UUID (older links). Returns the canonical URL key alongside, so
 * the page can redirect non-canonical forms. Cached per request so metadata
 * and the page share one lookup.
 */
const resolveCategory = cache(async (slug: string) => {
  const key = decodeSlug(slug);
  if (key.toLowerCase() === "all") {
    return { canonicalKey: "all", name: "All Products", description: null, image: null };
  }
  const categories = await catalogListingRepository.findActiveCategories();
  const row = catalogListingRepository.resolveCategoryKey(categories, key);
  if (!row) return null;
  return {
    canonicalKey: row.slug.toLowerCase(),
    name: row.name,
    description: row.description,
    image: row.image,
  };
});

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await resolveCategory(slug);
  if (!category) return { title: `Category not found | ${SITE_NAME}` };

  const isAll = category.canonicalKey === "all";
  const title = isAll ? `Shop All Products | ${SITE_NAME}` : `${category.name} | ${SITE_NAME}`;
  const description =
    category.description ||
    (isAll
      ? `Browse the full ${SITE_NAME} collection.`
      : `Shop the ${category.name} collection at ${SITE_NAME}.`);
  // Filtered views all canonicalise to the unfiltered category page.
  const canonicalUrl = `${SITE_URL}/category/${category.canonicalKey}`;

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
      images: category.image ? [{ url: category.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.image ? [category.image] : undefined,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const category = await resolveCategory(slug);
  if (!category) notFound();

  if (decodeSlug(slug) !== category.canonicalKey) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(rawSearchParams)) {
      if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
      else if (value !== undefined) qs.set(key, value);
    }
    const suffix = qs.toString();
    redirect(`/category/${category.canonicalKey}${suffix ? `?${suffix}` : ""}`);
  }

  const jsonLd =
    category.canonicalKey === "all"
      ? null
      : {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          url: `${SITE_URL}/category/${category.canonicalKey}`,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* useSearchParams in the view needs a Suspense boundary. */}
      <Suspense fallback={<div className="min-h-screen bg-theme-bg" />}>
        <CategoryListingView categoryKey={category.canonicalKey} initialTitle={category.name} />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import { catalogService } from "@/features/customers/services/catalog.service";
import { StyleDetailClient } from "./StyleDetailClient";

interface StyleDetailPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "Zellora";

async function getStyleForSeo(slug: string) {
  try {
    return await catalogService.getStyleByUuid(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: StyleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const style = await getStyleForSeo(slug);

  if (!style) {
    return { title: `Style Not Found | ${SITE_NAME}` };
  }

  const title = `${style.name}${style.brand ? ` by ${style.brand.name}` : ""} | ${SITE_NAME}`;
  const description =
    style.shortDescription?.slice(0, 160) ||
    style.description?.slice(0, 160) ||
    `Shop ${style.name} at ${SITE_NAME}.`;
  const canonicalUrl = `${SITE_URL}/styles/${slug}`;
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

export default async function StyleDetailPage({ params }: StyleDetailPageProps) {
  const { slug } = await params;

  return <StyleDetailClient slug={slug} />;
}

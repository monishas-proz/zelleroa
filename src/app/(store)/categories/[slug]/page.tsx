import { redirect } from "next/navigation";

interface LegacyCategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * `/categories/:slug` is the old listing URL. The listing now lives at
 * `/category/:slug`; keep old links (and their filters) working.
 */
export default async function LegacyCategoryPage({ params, searchParams }: LegacyCategoryPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(rawSearchParams)) {
    if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
    else if (value !== undefined) qs.set(key, value);
  }
  const suffix = qs.toString();
  redirect(`/category/${encodeURIComponent(slug)}${suffix ? `?${suffix}` : ""}`);
}

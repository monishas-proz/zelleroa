import { Metadata } from "next";
import {
  AboutHeroSection,
  AboutOurStorySection,
  AboutFounderSection,
} from "@/components/storefront/about";

export const metadata: Metadata = {
  title: "About Us - Zellora | Elegance in Every Stitch",
  description:
    "Learn about Zellora, delivering bespoke fashion, contemporary craftsmanship, and timeless designer clothing crafted with care.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* 1. Hero Banner: Tradition in Every Bite */}
      <AboutHeroSection />

      {/* 2. Our Story: Rooted in tradition, growing with purpose */}
      <AboutOurStorySection />

      {/* 3. The Woman Behind The Vision: Dr. S. Anita */}
      <AboutFounderSection />
    </div>
  );
}

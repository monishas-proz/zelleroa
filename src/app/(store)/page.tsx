
import {
  HeroIntro,
  ShopByCategory,
  ProductSection,
  PromoBanner,
  TrendingNow,
  DealsSection,
  Features,
  OccasionEdits,
  Feedback,
  Newsletter,
  OfferPopup,
  OfferReels,
} from "@/components/storefront";

export default function HomePage() {
  return (
    <div className="bg-white">
      <OfferPopup />
      <HeroIntro />
      <ShopByCategory />
      <ProductSection />
      <PromoBanner />
      <TrendingNow />
      <DealsSection />
      <OfferReels />
      <Features />
      <OccasionEdits />
      <Feedback />
      <Newsletter />
    </div>
  );
}

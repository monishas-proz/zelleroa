import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TAGS = ["Summer Essentials", "Festive Curations", "Workwear Refresh", "Weekend Comfort"];

export function PromoBanner() {
  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12 sm:py-16 text-center">
          <div className="pointer-events-none absolute -left-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-1/3 h-56 w-56 -translate-y-1/2 rounded-full bg-theme-primary/20 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="relative mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase leading-tight tracking-tight text-white">
            Upgrade Your Everyday Style
          </h2>

          <p className="relative mt-4 max-w-xl mx-auto text-sm sm:text-base text-white/70">
            Quality essentials. Contemporary designs. Prices you&apos;ll love. Engineered for your
            everyday rhythm.
          </p>

          <div className="relative mt-7">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-theme-primary hover:bg-theme-primary-hover px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;

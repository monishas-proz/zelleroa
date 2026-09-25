import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ShieldCheck, RefreshCcw, ArrowRight, ShoppingBag } from "lucide-react";

const STATS = [
  { icon: Zap, label: "48-HR DISPATCH" },
  { icon: ShieldCheck, label: "100% QUALITY VERIFIED" },
  { icon: RefreshCcw, label: "15-DAY HASSLE-FREE" },
];

export function HeroIntro() {
  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-theme-primary-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-theme-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-theme-primary" />
            New Season 2026 Collection
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl xl:text-6xl font-extrabold uppercase leading-[1.05] tracking-tight text-theme-text-primary">
            Everyday Style.
            <br />
            <span className="text-theme-primary">Made For You.</span>
          </h1>

          <p className="mt-5 max-w-md text-sm sm:text-base text-theme-text-subtle">
            Discover products you&apos;ll love at prices you&apos;ll appreciate. Built for
            modern lifestyles with uncompromising comfort and sharp aesthetics.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/products?gender=men"
              className="rounded-md bg-theme-primary hover:bg-theme-primary-hover px-6 py-3 text-sm font-bold uppercase tracking-wide text-theme-primary-fg transition-colors"
            >
              Shop Men
            </Link>
            <Link
              href="/products?gender=women"
              className="rounded-md bg-slate-800 hover:bg-slate-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors"
            >
              Shop Women
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-theme-primary hover:text-theme-primary-hover transition-colors"
            >
              Explore Lifestyle
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-theme-text-subtle">
            {STATS.map(({ icon: Icon, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="h-1 w-1 rounded-full bg-theme-border" />}
                <span className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-theme-primary" strokeWidth={2} />
                  {label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: image + trending card */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
              alt="Shopper carrying bags from the new season collection"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-6 left-4 right-4 sm:left-8 sm:right-auto sm:w-[340px] flex items-center gap-3 rounded-xl border border-theme-border bg-white p-4 shadow-lg">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-theme-primary-light">
              <ShoppingBag className="h-5 w-5 text-theme-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                  Trending
                </span>
                <span className="text-xs text-theme-text-subtle">Curated</span>
              </div>
              <p className="text-sm font-bold text-theme-text-primary truncate">The Weekend Edit</p>
              <p className="text-sm font-semibold text-theme-primary">Starting ₹899</p>
            </div>
            <Link
              href="/products"
              aria-label="Shop the Weekend Edit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-theme-primary-light text-theme-primary hover:bg-theme-primary hover:text-theme-primary-fg transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroIntro;

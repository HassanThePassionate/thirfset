import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AlabamaLeafletOverview } from "@/components/alabama/AlabamaLeafletOverview";
import { AL_LAST_UPDATED, AL_STORES } from "@/data/alabama-bin-stores";

export function AlabamaHeroIntro() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border/80 grain">
      <div className="pointer-events-none absolute -top-32 left-0 size-[460px] rounded-full bg-mint/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-10 right-0 size-[380px] rounded-full bg-cyan/10 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-22">
        <nav className="mb-8 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="text-border">/</span>
          <a href="#directory" className="hover:text-foreground">
            Bin stores
          </a>
          <span className="text-border">/</span>
          <span className="text-foreground">Alabama</span>
          <span className="text-border">/</span>
          <span>AL</span>
        </nav>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <MapPin className="size-3.5 text-mint" />
          State guide · {AL_STORES.length} locations · Updated {AL_LAST_UPDATED}
        </div>

        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-6xl">
          Bin Stores in <span className="text-gradient-mint">Alabama</span>
        </h1>

        <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Looking for bin stores in Alabama? This is the long-form directory layout for Amazon bin stores, liquidation
            stores, and discount stores across the state — re-themed for BinIndex while keeping the same structure,
            headings, and listing order as your reference page.
          </p>
          <p>
            Whether you are in Dothan, Fort Payne, Gadsden, or anywhere else, use the city jump links, hour grids, and
            directions buttons to plan a route fast.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card/80 p-6 shadow-card backdrop-blur md:p-8">
          <h2 className="font-display text-xl font-semibold md:text-2xl">
            How Alabama Bin Stores Work: The Weekly Pricing Model
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Bin stores in Alabama offer deep savings on brand-name merchandise. These stores purchase overstock
            inventory, Amazon returns, and liquidated items from major retailers, then pass discounts on to shoppers.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Items often start at higher prices on restock days and drop daily through the week — sometimes down to a few
            cents or near-free tiers. Always verify today&apos;s tier on social media before a long drive.
          </p>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">Last updated: {AL_LAST_UPDATED}</p>
      </div>
    </section>
  );
}

export function AlabamaOverviewMap() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-18">
      <h2 className="font-display text-2xl font-semibold md:text-3xl">Alabama Bin Store Overview</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Quick summary of the Alabama liquidation market: a dense mix of franchise bargain-bin operators and independent
        discount warehouses — strongest clusters around{" "}
        <span className="text-foreground">Birmingham, Huntsville, Dothan, and Montgomery</span>.
      </p>

      <div id="map" className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Alabama Bin Store Map & Directions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All {AL_STORES.length} pinned locations on OpenStreetMap — click a marker to jump to the store section
              below.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">Pan & zoom · scroll wheel enabled inside the map</div>
        </div>
        <AlabamaLeafletOverview />
      </div>
    </section>
  );
}

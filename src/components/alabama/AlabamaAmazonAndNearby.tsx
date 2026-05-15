import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AL_AMAZON_DEALS, AL_NEARBY_STATES } from "@/data/alabama-bin-stores";

export function AlabamaAmazonDealsSection() {
  return (
    <section className="border-y border-border bg-gradient-to-b from-card/60 to-background">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">Get the Same Amazon Bin Store Deals Online</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Shop online and get bin store-style deals delivered — handy if you are building a shopping list before you dig.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="https://www.amazon.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:brightness-110"
          >
            Shop on Amazon
            <ArrowRight className="size-4" />
          </a>
          <span className="text-xs text-muted-foreground">Support local stores first.</span>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AL_AMAZON_DEALS.map((d) => (
            <div key={d.title} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="font-display text-sm font-semibold">{d.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{d.subtitle}</div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          BinIndex may earn from qualifying purchases through outbound retailer links.
        </p>
      </div>
    </section>
  );
}

export function AlabamaNearbyStates() {
  return (
    <section id="nearby" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <h2 className="font-display text-2xl font-semibold md:text-3xl">Browse Bin Store Directories in Nearby States</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Planning a trip across state lines? These cards mirror the reference guide framing — wire them to your real state
        routes when those pages go live.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {AL_NEARBY_STATES.map((s) => (
          <div key={s.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">{s.rank}</div>
                <div className="mt-1 font-display text-lg font-semibold">Bin Stores in {s.name}</div>
              </div>
              <div className="rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-mint">{s.distance}</div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.nearest}</p>
            <a
              href={s.href}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-mint hover:underline"
            >
              View all {s.count} {s.name} bin stores
              <ArrowRight className="size-4" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>
    </section>
  );
}

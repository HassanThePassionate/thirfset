import { Link } from "@tanstack/react-router";
import { Boxes, Search } from "lucide-react";

export function AlabamaPageNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-mint to-cyan">
            <Boxes className="size-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">BinIndex</span>
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <label className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              readOnly
              placeholder="Search stores, cities, or routes…"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-mint/60 focus:ring-2 focus:ring-mint/20"
            />
          </label>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          <Link to="/" className="transition hover:text-foreground">
            Home
          </Link>
          <a href="#directory" className="transition hover:text-foreground">
            Directory
          </a>
          <a href="#map" className="transition hover:text-foreground">
            Map
          </a>
          <a href="#nearby" className="transition hover:text-foreground">
            Nearby states
          </a>
        </nav>
      </div>
    </header>
  );
}

export function AlabamaPageFooter() {
  return (
    <footer className="mt-10 border-t border-border py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-mint to-cyan">
              <Boxes className="size-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold">BinIndex</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            America's premium directory for bin stores, liquidation outlets, and treasure-hunt shopping — verified,
            mapped, and organized for fast trip planning.
          </p>
        </div>
        {[
          { title: "Explore", links: ["Home", "Alabama directory", "Submit a store"] as const },
          { title: "Company", links: ["About", "Contact", "Privacy", "Terms"] as const },
        ].map((col) => (
          <div key={col.title}>
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {col.title}
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((label) => (
                <li key={label}>
                  {label === "Home" ? (
                    <Link to="/" className="transition hover:text-mint">
                      {label}
                    </Link>
                  ) : label === "Alabama directory" ? (
                    <a href="#top" className="transition hover:text-mint">
                      {label}
                    </a>
                  ) : (
                    <span className="cursor-not-allowed opacity-60">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-start justify-between gap-3 border-t border-border px-6 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <span>© 2026 BinIndex. All rights reserved.</span>
        <span>Confirm hours and pricing on official pages before you travel.</span>
      </div>
    </footer>
  );
}

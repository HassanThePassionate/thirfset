import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Boxes,
  Tag,
  ArrowRight,
  Clock,
  Navigation,
  Heart,
} from "lucide-react";
import heroBins from "@/assets/hero-bins.jpg";
import store1 from "@/assets/store-1.jpg";
import store2 from "@/assets/store-2.jpg";
import store3 from "@/assets/store-3.jpg";
import {
  BinStoreEducationSection,
  BinStoreFAQSection,
  BrowseBinStoresByStateSection,
  GoodwillBinsSection,
  WhereFromMapSection,
} from "@/components/home/HomeDirectorySections";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const trendingStores = [
  {
    img: store3,
    name: "Bargain Bin Republic",
    city: "Atlanta, GA",
    rating: 4.9,
    reviews: 312,
    price: "$",
    tags: ["Bin Store", "Restock Fri"],
    open: true,
    distance: "2.4 mi",
  },
  {
    img: store2,
    name: "Pallet Empire Warehouse",
    city: "Dallas, TX",
    rating: 4.8,
    reviews: 189,
    price: "$$",
    tags: ["Pallets", "Amazon Returns"],
    open: true,
    distance: "5.1 mi",
  },
  {
    img: store1,
    name: "The Liquidation Vault",
    city: "Phoenix, AZ",
    rating: 4.7,
    reviews: 256,
    price: "$",
    tags: ["Liquidation", "Verified"],
    open: false,
    distance: "0.9 mi",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <WhereFromMapSection />
      <BrowseBinStoresByStateSection />
      <GoodwillBinsSection />
      <BinStoreEducationSection />
      <BinStoreFAQSection />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-6 pt-5">
      <div className="mx-auto max-w-7xl glass rounded-2xl flex items-center justify-between px-5 py-3">
        <a href="#" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-mint to-cyan grid place-items-center">
            <Boxes className="size-4 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">BinIndex</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#explore" className="hover:text-foreground transition">
            Explore
          </a>
          <a href="#where-from" className="hover:text-foreground transition">
            States
          </a>
          <a href="#map" className="hover:text-foreground transition">
            Map
          </a>
          <a href="#goodwill" className="hover:text-foreground transition">
            Goodwill
          </a>
          <a href="#learn" className="hover:text-foreground transition">
            Guide
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-2">
            Sign in
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-mint transition">
            Submit a store <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32 grain">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-32 size-[520px] rounded-full bg-mint/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 size-[420px] rounded-full bg-cyan/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-[380px] rounded-full bg-lime/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground mb-7">
            <span className="size-1.5 rounded-full bg-mint animate-pulse-glow" />
            3,816 verified stores · updated this week
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[88px] leading-[0.95] font-semibold tracking-tight">
            Discover America's best <br />
            <span className="text-gradient-mint">bin stores</span> & liquidation deals.
          </h1>
          <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
            The curated, verified directory for bin stores, Amazon return outlets, pallet warehouses
            and liquidation finds — mapped nationwide.
          </p>

          {/* search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 glass rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 max-w-2xl shadow-elevate"
          >
            <div className="flex items-center gap-3 px-4 flex-1">
              <Search className="size-4 text-muted-foreground" />
              <input
                placeholder="Search stores, brands, categories…"
                className="bg-transparent outline-none w-full py-3 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="hidden sm:block w-px bg-border my-2" />
            <div className="flex items-center gap-3 px-4 sm:w-56">
              <MapPin className="size-4 text-mint" />
              <input
                placeholder="City or zip"
                className="bg-transparent outline-none w-full py-3 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint text-primary-foreground px-6 py-3 font-medium hover:brightness-110 transition">
              Search <ArrowRight className="size-4" />
            </button>
          </motion.div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3 text-lime" /> Try:
            </span>
            {["Pallets in Dallas", "Amazon returns near me", "Bin store Atlanta"].map((q) => (
              <button
                key={q}
                className="hover:text-foreground transition underline-offset-4 hover:underline"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>

        {/* floating stat cards */}
        <div className="hidden lg:block absolute right-6 top-44 w-[320px]">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-tr from-mint/20 to-cyan/10 blur-3xl rounded-full" />
            <img
              src={heroBins}
              alt="A treasure bin filled with curated finds"
              width={1600}
              height={1200}
              className="relative rounded-3xl border border-border shadow-elevate"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -left-12 top-8 glass rounded-2xl px-4 py-3 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-mint/20 grid place-items-center">
                  <ShieldCheck className="size-5 text-mint" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Verified today</div>
                  <div className="font-semibold text-sm">+ 24 stores</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -right-8 -bottom-6 glass rounded-2xl px-4 py-3 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-lime/20 grid place-items-center">
                  <Star className="size-5 text-lime" fill="currentColor" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg. rating</div>
                  <div className="font-semibold text-sm">4.8 / 5.0</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 rounded-lg bg-gradient-to-br from-mint to-cyan grid place-items-center">
              <Boxes className="size-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-lg">BinIndex</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            America's premium directory for bin stores, pallet outlets and liquidation finds.
          </p>
        </div>
        {[
          { t: "Explore", l: ["Bin stores", "Pallet stores", "Amazon returns", "Liquidation"] },
          { t: "Company", l: ["About", "Blog", "Pricing", "Contact"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {c.t}
            </div>
            <ul className="space-y-2.5 text-sm">
              {c.l.map((i) => (
                <li key={i}>
                  <a href="#" className="hover:text-mint transition">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-10 pt-6 border-t border-border flex justify-between text-xs text-muted-foreground">
        <span>© 2026 BinIndex. All rights reserved.</span>
        <span>Made for treasure hunters.</span>
      </div>
    </footer>
  );
}

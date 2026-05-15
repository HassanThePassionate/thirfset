import { AL_CITY_JUMPS, AL_STORES } from "@/data/alabama-bin-stores";

export function AlabamaDirectorySummary() {
  return (
    <section id="directory" className="border-y border-border/80 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">
          All {AL_STORES.length} Bin Stores in Alabama
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
          Below is the complete directory. Click a name to jump to hours + pricing, or jump to a city:
        </p>

        <div className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-sm">
          {AL_CITY_JUMPS.map((c, i) => (
            <span key={c.anchor} className="inline-flex items-center gap-2">
              <a className="text-mint hover:underline" href={`#${c.anchor}`}>
                {c.city}
              </a>
              {i < AL_CITY_JUMPS.length - 1 ? <span className="text-border">|</span> : null}
            </span>
          ))}
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {AL_STORES.map((s) => (
            <li
              key={s.anchor}
              className="flex gap-4 rounded-xl border border-border bg-background p-4 transition hover:border-mint/40 hover:shadow-card"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-mint/15 font-display text-sm font-semibold text-mint">
                {s.num}
              </div>
              <div className="min-w-0">
                <a href={`#${s.anchor}`} className="font-semibold text-foreground hover:text-mint">
                  {s.name}
                </a>
                <div className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{"Today's Price:"}</span> {s.todayPrice}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.address}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

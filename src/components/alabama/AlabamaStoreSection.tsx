import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Facebook,
  Globe,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { alStoreImagePaths, type AlabamaStore, type ScheduleRow } from "@/data/alabama-bin-stores";

export function AlabamaStoreSection({ store }: { store: AlabamaStore }) {
  return (
    <article id={store.anchor} className="scroll-mt-28 border-b border-border/80">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{store.sectionLabel}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold md:text-4xl">
              <span className="text-muted-foreground">{store.num}</span> {store.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                <span className="text-foreground">Address:</span> {store.address}
              </span>
              <span>
                <span className="text-foreground">Phone:</span> {store.phone ?? "Not listed"}
              </span>
            </div>
            {store.rating != null ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Star className="size-4 text-lime" fill="currentColor" />
                  {store.rating}
                </span>
                <span className="text-border">·</span>
                <span>{store.reviewCount} reviews</span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-4 text-mint" />
                  {store.verified}
                </span>
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="text-foreground">No public rating yet</span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-4 text-mint" />
                  {store.verified}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs font-medium text-muted-foreground">Status</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-mint">
                Today: {store.todayPrice}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{store.hoursNote}</span>
              {store.permanentlyClosed ? (
                <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
                  Permanently closed
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AlabamaStoreGallery images={alStoreImagePaths(store.num)} title={store.name} />
          </div>
          <div className="lg:col-span-5">
            <AlabamaContactCard store={store} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-5">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Store Address</div>
            <p className="mt-2 text-sm text-foreground">{store.address}</p>
          </div>
          <div className="lg:col-span-7">
            <AlabamaScheduleTable schedule={store.schedule} />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-lg font-semibold">Location map</h3>
          <p className="mt-1 text-xs text-muted-foreground">Embedded map · opens at the pinned coordinates for this listing</p>
          <iframe
            title={`Map of ${store.name}`}
            className="mt-3 aspect-video w-full min-h-[260px] rounded-2xl border border-border shadow-card"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${store.lat},${store.lng}&z=15&output=embed`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-mint" />
            <span>
              {store.address} ·{" "}
              <a className="font-medium text-mint hover:underline" href={store.directionsUrl} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-6">
          <h3 className="font-display text-lg font-semibold">Looking for the freshest Amazon returns?</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{store.restockTip}</p>
        </div>

        {store.reviews.length ? (
          <div className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-xl font-semibold">Customer Reviews</h3>
              <div className="text-xs text-muted-foreground">Public review excerpts</div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {store.reviews.map((r) => (
                <figure key={`${store.anchor}-${r.author}`} className="rounded-2xl border border-border bg-card p-5">
                  <figcaption className="text-sm font-semibold">{r.author}</figcaption>
                  <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</blockquote>
                </figure>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={store.mapSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:border-mint/50 hover:bg-card"
          >
            <Globe className="size-4" />
            Show Map
          </a>
          <a
            href={store.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            <Navigation className="size-4" />
            Get Directions
          </a>
        </div>
      </div>
    </article>
  );
}

function AlabamaStoreGallery({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);

  const total = Math.max(1, images.length);
  const safeIdx = ((idx % total) + total) % total;
  const src = images[safeIdx] ?? images[0]!;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="relative aspect-[16/10]">
        <img src={src} alt={`${title} photo ${safeIdx + 1}`} className="size-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Photo {safeIdx + 1} / {total}
            </div>
            {total > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIdx((v) => v - 1)}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/80 backdrop-blur transition hover:border-mint/50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIdx((v) => v + 1)}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/80 backdrop-blur transition hover:border-mint/50"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlabamaContactCard({ store }: { store: AlabamaStore }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Contact Information</div>
      <div className="mt-4 grid gap-3">
        {store.website ? (
          <a
            href={store.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-mint/50"
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <Globe className="size-4 text-mint" />
              Visit Website
            </span>
            <ExternalLink className="size-4 text-muted-foreground" />
          </a>
        ) : null}
        {store.facebook ? (
          <a
            href={store.facebook}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-mint/50"
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <Facebook className="size-4 text-mint" />
              Facebook Page
            </span>
            <ExternalLink className="size-4 text-muted-foreground" />
          </a>
        ) : null}
        {store.phone ? (
          <a
            href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-mint hover:text-primary-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Phone className="size-4" />
              Call Now
            </span>
            <span className="tabular-nums">{store.phone}</span>
          </a>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground">
            Phone not listed — check social pages for the fastest updates.
          </div>
        )}
      </div>
    </div>
  );
}

function AlabamaScheduleTable({ schedule }: { schedule: AlabamaStore["schedule"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="font-display text-lg font-semibold">Restock Schedule & Pricing</h3>
        <p className="mt-1 text-xs text-muted-foreground">Day-by-day snapshot · confirm on Facebook before visiting</p>
      </div>
      {"single" in schedule ? (
        <div className="px-6 py-10 text-sm text-muted-foreground">{schedule.single}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Day</th>
                <th className="px-6 py-3 font-medium">Hours</th>
                <th className="px-6 py-3 font-medium">Price per Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(schedule as ScheduleRow[]).map((row) => (
                <tr key={`${row.day}-${row.hours}-${row.price}`} className="text-muted-foreground">
                  <td className="px-6 py-3 font-medium text-foreground">{row.day}</td>
                  <td className="px-6 py-3">{row.hours}</td>
                  <td className="px-6 py-3">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

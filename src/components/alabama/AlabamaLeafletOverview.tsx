import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { AL_STORES } from "@/data/alabama-bin-stores";

const MARKER = {
  color: "#0d9488",
  fill: "#5eead4",
};

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * OpenStreetMap + Leaflet overview for all Alabama listings.
 * Initializes only after the block scrolls into view (lazy).
 */
export function AlabamaLeafletOverview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { rootMargin: "120px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="relative z-0 mt-6">
      {!visible ? (
        <div className="grid h-[min(55vh,520px)] min-h-[320px] place-items-center rounded-xl border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground">Scroll to load map</div>
            <div className="mt-2 max-w-md px-4 text-xs text-muted-foreground">
              Click markers for store details · use zoom controls or scroll to zoom
            </div>
          </div>
        </div>
      ) : (
        <AlabamaLeafletMapInner />
      )}
    </div>
  );
}

function AlabamaLeafletMapInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ remove: () => void } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const points = AL_STORES.map((s) => ({ lat: s.lat, lng: s.lng, name: s.name, anchor: s.anchor }));
      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const latLngs: [number, number][] = points.map((p) => [p.lat, p.lng]);
      const bounds = L.latLngBounds(latLngs);

      for (const p of points) {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 8,
          color: MARKER.color,
          weight: 2,
          fillColor: MARKER.fill,
          fillOpacity: 0.45,
        }).addTo(map);
        marker.bindPopup(
          `<div class="text-sm"><strong>${escapeHtml(p.name)}</strong><br/><a href="#${escapeHtml(p.anchor)}">Jump to listing</a></div>`,
          { maxWidth: 240 },
        );
      }

      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 8 });
      mapInstanceRef.current = map;
      setLoaded(true);
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    })();

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      {!loaded ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-muted/40 text-sm text-muted-foreground backdrop-blur-[2px]">
          Loading map…
        </div>
      ) : null}
      <div ref={containerRef} className="h-[min(55vh,520px)] min-h-[320px] w-full rounded-xl bg-muted/20" />
    </div>
  );
}

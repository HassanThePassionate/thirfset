import { AlabamaPageFooter, AlabamaPageNav } from "@/components/alabama/AlabamaChrome";
import { AlabamaDirectorySummary } from "@/components/alabama/AlabamaDirectorySummary";
import { AlabamaHeroIntro, AlabamaOverviewMap } from "@/components/alabama/AlabamaHeroAndMap";
import {
  AlabamaAmazonDealsSection,
  AlabamaNearbyStates,
} from "@/components/alabama/AlabamaAmazonAndNearby";
import { AlabamaStoreSection } from "@/components/alabama/AlabamaStoreSection";
import { AL_STORES } from "@/data/alabama-bin-stores";
import { useEffect } from "react";

const PAGE_TITLE = "Bin Stores in Alabama — BinIndex";
const PAGE_DESCRIPTION =
  "Find 22 Amazon bin stores in Alabama with hours, weekly pricing schedules, maps, and verified listings — curated on BinIndex.";

export function AlabamaBinStoresPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = PAGE_TITLE;
    let meta = document.querySelector('meta[name="description"]');
    const prevContent = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", PAGE_DESCRIPTION);
    return () => {
      document.title = prevTitle;
      if (meta) {
        if (prevContent != null) meta.setAttribute("content", prevContent);
        else meta.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlabamaPageNav />
      <main>
        <AlabamaHeroIntro />
        <AlabamaOverviewMap />
        <AlabamaDirectorySummary />
        {AL_STORES.map((store) => (
          <div key={store.anchor}>
            <AlabamaStoreSection store={store} />
            {[2, 14, 22].includes(store.num) ? (
              <AlabamaAmazonDealsSection key={`amazon-${store.num}`} />
            ) : null}
          </div>
        ))}
        <AlabamaNearbyStates />
      </main>
      <AlabamaPageFooter />
    </div>
  );
}

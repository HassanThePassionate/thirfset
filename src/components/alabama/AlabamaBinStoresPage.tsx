import { AlabamaPageFooter, AlabamaPageNav } from "@/components/alabama/AlabamaChrome";
import { AlabamaDirectorySummary } from "@/components/alabama/AlabamaDirectorySummary";
import { AlabamaHeroIntro, AlabamaOverviewMap } from "@/components/alabama/AlabamaHeroAndMap";
import { AlabamaAmazonDealsSection, AlabamaNearbyStates } from "@/components/alabama/AlabamaAmazonAndNearby";
import { AlabamaStoreSection } from "@/components/alabama/AlabamaStoreSection";
import { AL_STORES } from "@/data/alabama-bin-stores";

export function AlabamaBinStoresPage() {
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
            {[2, 14, 22].includes(store.num) ? <AlabamaAmazonDealsSection key={`amazon-${store.num}`} /> : null}
          </div>
        ))}
        <AlabamaNearbyStates />
      </main>
      <AlabamaPageFooter />
    </div>
  );
}

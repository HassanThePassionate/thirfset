import { createFileRoute } from "@tanstack/react-router";
import { AlabamaBinStoresPage } from "@/components/alabama/AlabamaBinStoresPage";

export const Route = createFileRoute("/bin-stores-in-alabama")({
  head: () => ({
    meta: [
      { title: "Bin Stores in Alabama — BinIndex" },
      {
        name: "description",
        content:
          "Find 22 Amazon bin stores in Alabama with hours, weekly pricing schedules, maps, and verified listings — curated on BinIndex.",
      },
    ],
  }),
  component: AlabamaBinStoresPage,
});


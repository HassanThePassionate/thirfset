import { createFileRoute } from "@tanstack/react-router";

import { AlabamaBinStoresPage } from "@/components/alabama/AlabamaBinStoresPage";

export const Route = createFileRoute("/bin-stores-in-alabama")({
  component: AlabamaBinStoresPage,
});

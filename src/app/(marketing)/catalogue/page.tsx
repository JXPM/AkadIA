import type { Metadata } from "next";
import { getFormations } from "@/lib/queries";
import { CatalogueClient } from "./catalogue-client";

export const metadata: Metadata = { title: "Catalogue" };

export default async function CataloguePage() {
  const formations = await getFormations();
  return <CatalogueClient formations={formations} />;
}

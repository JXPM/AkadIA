import type { Metadata } from "next";
import { CatalogueClient } from "@/app/(marketing)/catalogue/catalogue-client";
import { getFormations } from "@/lib/queries";

export const metadata: Metadata = { title: "Catalogue" };
export const dynamic = "force-dynamic";

// Catalogue dans l'espace connecté (sidebar AppShell, liens internes).
export default async function AppCataloguePage() {
  const formations = await getFormations();
  return <CatalogueClient formations={formations} hrefBase="/app/catalogue" />;
}

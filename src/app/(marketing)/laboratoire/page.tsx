import type { Metadata } from "next";
import { getPromptLibrary } from "@/lib/queries";
import { LaboratoireClient } from "./laboratoire-client";

export const metadata: Metadata = { title: "Laboratoire IA" };

export default async function LaboratoirePage() {
  const promptLibrary = await getPromptLibrary();
  return <LaboratoireClient promptLibrary={promptLibrary} />;
}

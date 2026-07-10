import type { Metadata } from "next";
import { Play } from "@/components/live/play";

export const metadata: Metadata = { title: "Rejoindre une session" };

// Cible du QR code : le code de session est prérempli.
export default async function RejoindreCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <Play codeInitial={decodeURIComponent(code).toUpperCase()} />;
}

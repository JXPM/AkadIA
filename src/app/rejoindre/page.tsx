import type { Metadata } from "next";
import { Play } from "@/components/live/play";

export const metadata: Metadata = { title: "Rejoindre une session" };

export default function RejoindrePage() {
  return <Play />;
}

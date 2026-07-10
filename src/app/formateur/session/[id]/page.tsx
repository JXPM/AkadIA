import { HostConsole } from "@/components/live/host-console";

export const dynamic = "force-dynamic";

export default async function SessionConsolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HostConsole sessionId={id} />;
}

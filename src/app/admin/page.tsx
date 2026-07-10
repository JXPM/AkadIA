import Link from "next/link";
import { Users, BookOpen, Radio, HelpCircle, Plus, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFormations } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

const etatSession: Record<string, { label: string; variant: "success" | "muted" | "warning" }> = {
  lobby: { label: "Lobby", variant: "warning" },
  question: { label: "En direct", variant: "success" },
  resultats: { label: "En direct", variant: "success" },
  terminee: { label: "Terminée", variant: "muted" },
};

export default async function AdminPage() {
  const formations = await getFormations();
  const publiees = formations.filter((f) => f.status === "publiee").length;

  let membres = 0;
  let quizCount = 0;
  let sessions: { id: string; titre: string; etat: string; debut_at: string | null }[] = [];

  if (isSupabaseEnabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data: me } = await admin
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .maybeSingle();
      if (me?.organization_id) {
        const [m, q, s] = await Promise.all([
          admin
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("organization_id", me.organization_id),
          admin
            .from("quizzes")
            .select("id", { count: "exact", head: true })
            .eq("organization_id", me.organization_id),
          admin
            .from("sessions")
            .select("id, titre, etat, debut_at")
            .eq("organization_id", me.organization_id)
            .not("quiz_id", "is", null)
            .order("debut_at", { ascending: false })
            .limit(6),
        ]);
        membres = m.count ?? 0;
        quizCount = q.count ?? 0;
        sessions = s.data ?? [];
      }
    }
  }

  const kpis = [
    { label: "Membres de l'organisation", value: String(membres), icon: Users },
    { label: "Formations publiées", value: String(publiees), icon: BookOpen },
    { label: "Sessions live animées", value: String(sessions.length), icon: Radio },
    { label: "Quiz créés", value: String(quizCount), icon: HelpCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
          <p className="mt-1 text-muted-foreground">
            Pilotage de votre organisation sur AKADIA.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/equipe">
              <Users className="size-4" /> Inviter un membre
            </Link>
          </Button>
          <Button variant="brand" asChild>
            <Link href="/admin/formations/nouvelle">
              <Sparkles className="size-4" /> Générer une formation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                <k.icon className="size-5" />
              </span>
              <p className="mt-3 text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Dernières sessions live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Radio className="size-8 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Aucune session live pour l&apos;instant. Lancez votre premier
                  quiz depuis le mode formateur !
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/formateur">
                    <Plus className="size-4" /> Mode formateur
                  </Link>
                </Button>
              </div>
            ) : (
              sessions.map((s) => {
                const e = etatSession[s.etat] ?? etatSession.terminee;
                return (
                  <div key={s.id} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Badge variant={e.variant}>{e.label}</Badge>
                      <span className="truncate text-sm">{s.titre}</span>
                    </div>
                    <Link
                      href={`/formateur/session/${s.id}`}
                      className="shrink-0 text-sm text-brand hover:underline"
                    >
                      Ouvrir
                    </Link>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top formations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formations.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{f.titre}</span>
                <Badge variant="muted">{formatNumber(f.apprenants)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

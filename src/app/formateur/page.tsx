import Link from "next/link";
import { Plus, Sparkles, Play, Radio, HelpCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { LancerSessionBouton } from "@/components/live/lancer-session";

export const dynamic = "force-dynamic";

type QuizRow = {
  id: string;
  titre: string;
  questions: { count: number }[];
};

type SessionRow = {
  id: string;
  titre: string;
  code: string | null;
  etat: string;
  debut_at: string | null;
};

const etatBadge: Record<string, { label: string; variant: "success" | "warning" | "muted" }> = {
  lobby: { label: "Lobby ouvert", variant: "warning" },
  question: { label: "En direct", variant: "success" },
  resultats: { label: "En direct", variant: "success" },
  terminee: { label: "Terminée", variant: "muted" },
};

export default async function FormateurPage() {
  let quizzes: QuizRow[] = [];
  let sessions: SessionRow[] = [];

  if (isSupabaseEnabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .maybeSingle();
      const orgId = profile?.organization_id;
      if (orgId) {
        const [q, s] = await Promise.all([
          admin
            .from("quizzes")
            .select("id, titre, questions(count)")
            .eq("organization_id", orgId)
            .order("titre", { ascending: true }),
          admin
            .from("sessions")
            .select("id, titre, code, etat, debut_at")
            .eq("organization_id", orgId)
            .not("quiz_id", "is", null)
            .order("debut_at", { ascending: false })
            .limit(8),
        ]);
        quizzes = (q.data ?? []) as QuizRow[];
        sessions = (s.data ?? []) as SessionRow[];
      }
    }
  }

  const enDirect = sessions.filter((s) => s.etat !== "terminee");

  return (
    <div className="min-h-screen">
      <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/dashboard">
              <ArrowLeft className="size-4" /> Tableau de bord
            </Link>
          </Button>
          <Badge variant="brand">
            <Radio className="size-3" /> Mode formateur
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Logo showText={false} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sessions live</h1>
            <p className="mt-1 text-muted-foreground">
              Créez un quiz, lancez une session : vos participants rejoignent avec
              un code ou un QR code, comme sur Kahoot.
            </p>
          </div>
          <Button variant="brand" asChild>
            <Link href="/formateur/quiz/nouveau">
              <Plus className="size-4" /> Créer un quiz
            </Link>
          </Button>
        </div>

        {!isSupabaseEnabled() && (
          <Card className="p-6 text-sm text-muted-foreground">
            Le mode live nécessite le backend Supabase (désactivé en mode démo).
          </Card>
        )}

        {enDirect.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">En ce moment</h2>
            {enDirect.map((s) => (
              <Card key={s.id} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <Badge variant={etatBadge[s.etat]?.variant ?? "muted"}>
                    {etatBadge[s.etat]?.label ?? s.etat}
                  </Badge>
                  <span className="font-medium">{s.titre}</span>
                  {s.code && (
                    <span className="font-mono text-sm text-muted-foreground">
                      Code {s.code}
                    </span>
                  )}
                </div>
                <Button variant="brand" size="sm" asChild>
                  <Link href={`/formateur/session/${s.id}`}>
                    <Play className="size-4" /> Reprendre la console
                  </Link>
                </Button>
              </Card>
            ))}
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Mes quiz</h2>
          {quizzes.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-10 text-center">
              <Sparkles className="size-8 text-brand" />
              <p className="font-medium">Aucun quiz pour l&apos;instant</p>
              <p className="text-sm text-muted-foreground">
                Créez votre premier quiz à la main ou générez-le avec l&apos;IA en
                quelques secondes.
              </p>
              <Button variant="brand" asChild>
                <Link href="/formateur/quiz/nouveau">
                  <Plus className="size-4" /> Créer un quiz
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {quizzes.map((q) => (
                <Card key={q.id} className="flex flex-col justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-semibold">{q.titre}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <HelpCircle className="size-4" />
                      {q.questions?.[0]?.count ?? 0} question(s)
                    </p>
                  </div>
                  <LancerSessionBouton quizId={q.id} />
                </Card>
              ))}
            </div>
          )}
        </section>

        {sessions.some((s) => s.etat === "terminee") && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Sessions passées</h2>
            <div className="space-y-2">
              {sessions
                .filter((s) => s.etat === "terminee")
                .map((s) => (
                  <Card key={s.id} className="flex items-center justify-between p-4 text-sm">
                    <span>{s.titre}</span>
                    <Link
                      href={`/formateur/session/${s.id}`}
                      className="text-brand hover:underline"
                    >
                      Voir le podium
                    </Link>
                  </Card>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

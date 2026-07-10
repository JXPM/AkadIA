import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AkaAssistant } from "@/components/course/aka-assistant";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { lessonTypeLabels } from "@/lib/data";
import { getFormationBySlug } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import { basculerLeconTerminee } from "./actions";
import type { Lesson } from "@/lib/types";

// Données dynamiques (Supabase + cookies) : rendu à la demande.
export const dynamic = "force-dynamic";

type LeconAplatie = Lesson & { moduleTitre: string; chapitreTitre: string };

export default async function CoursPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lecon?: string }>;
}) {
  const { slug } = await params;
  const { lecon } = await searchParams;
  const formation = await getFormationBySlug(slug);
  if (!formation) notFound();

  // Liste ordonnée de toutes les leçons (pour navigation et progression).
  const lecons: LeconAplatie[] = formation.modules.flatMap((m) =>
    m.chapitres.flatMap((c) =>
      c.lessons.map((l) => ({ ...l, moduleTitre: m.titre, chapitreTitre: c.titre }))
    )
  );
  if (lecons.length === 0) notFound();

  const index = Math.max(
    0,
    lecons.findIndex((l) => l.id === lecon)
  );
  const courante = lecons[index];
  const precedente = index > 0 ? lecons[index - 1] : null;
  const suivante = index < lecons.length - 1 ? lecons[index + 1] : null;

  // Progression réelle de l'utilisateur (lesson_progress).
  const faites = new Set<string>();
  if (isSupabaseEnabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in(
          "lesson_id",
          lecons.map((l) => l.id)
        );
      for (const row of data ?? []) faites.add(row.lesson_id);
    }
  }
  const progression = Math.round((faites.size / lecons.length) * 100);
  const couranteFaite = faites.has(courante.id);

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/dashboard">
              <ArrowLeft className="size-4" /> Tableau de bord
            </Link>
          </Button>
          <span className="hidden text-sm font-medium sm:block">{formation.titre}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden w-40 items-center gap-2 sm:flex">
            <Progress value={progression} />
            <span className="text-xs text-muted-foreground">{progression}%</span>
          </div>
          <ThemeToggle />
          <Logo showText={false} />
        </div>
      </header>

      {/* 3 colonnes */}
      <div className="grid min-h-0 flex-1 lg:grid-cols-[280px_1fr_360px]">
        {/* Menu gauche : sommaire */}
        <aside className="hidden overflow-y-auto border-r border-border bg-card/40 lg:block">
          <div className="p-4">
            <span className="text-sm font-semibold">Programme</span>
            <p className="mt-1 text-xs text-muted-foreground">
              {faites.size}/{lecons.length} leçons terminées
            </p>
          </div>
          <nav className="space-y-4 px-3 pb-6">
            {formation.modules.map((m, mi) => (
              <div key={m.id}>
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {mi + 1}. {m.titre}
                </p>
                {m.chapitres.map((c) => (
                  <div key={c.id} className="mt-1">
                    <p className="px-2 py-1 text-xs text-muted-foreground">{c.titre}</p>
                    {c.lessons.map((l) => {
                      const Icon =
                        l.type === "capsule_video"
                          ? PlayCircle
                          : l.type === "quiz"
                            ? HelpCircle
                            : FileText;
                      const done = faites.has(l.id);
                      const active = l.id === courante.id;
                      return (
                        <Link
                          key={l.id}
                          href={`/cours/${slug}?lecon=${l.id}`}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent",
                            active && "bg-brand/10 font-medium text-brand"
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="size-4 shrink-0 text-success" />
                          ) : (
                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="flex-1 truncate">{l.titre}</span>
                          <span className="text-xs text-muted-foreground">{l.duree}m</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Contenu central */}
        <div className="min-w-0 overflow-y-auto">
          <article className="mx-auto max-w-2xl px-6 py-8">
            <Badge variant="brand" className="mb-3">
              {lessonTypeLabels[courante.type] ?? "Leçon"}
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight">{courante.titre}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {courante.moduleTitre} · {courante.chapitreTitre}
              {courante.duree ? ` · ${courante.duree} min` : ""}
            </p>

            {/* Lecteur vidéo factice pour les capsules */}
            {courante.type === "capsule_video" && (
              <div className="mt-6 grid aspect-video place-items-center rounded-xl gradient-brand text-white">
                <PlayCircle className="size-16 opacity-90" />
              </div>
            )}

            <div className="prose-akadia mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/90">
              {courante.contenu ? (
                courante.contenu
                  .split(/\n{2,}/)
                  .map((paragraphe, i) => <p key={i}>{paragraphe}</p>)
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                  <p className="font-medium">Contenu en cours de rédaction</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Cette leçon n&apos;a pas encore de contenu publié. Posez vos
                    questions à AKA en attendant !
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
              {precedente ? (
                <Button variant="outline" asChild>
                  <Link href={`/cours/${slug}?lecon=${precedente.id}`}>
                    <ArrowLeft className="size-4" /> Précédent
                  </Link>
                </Button>
              ) : (
                <span />
              )}

              <form action={basculerLeconTerminee}>
                <input type="hidden" name="lessonId" value={courante.id} />
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="dejaFaite" value={couranteFaite ? "1" : "0"} />
                <Button
                  variant={couranteFaite ? "outline" : "brand"}
                  type="submit"
                  disabled={!isSupabaseEnabled()}
                >
                  <Check className="size-4" />
                  {couranteFaite ? "Terminée ✓" : "Marquer comme terminé"}
                </Button>
              </form>

              {suivante ? (
                <Button variant="brand" asChild>
                  <Link href={`/cours/${slug}?lecon=${suivante.id}`}>
                    Suivant <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <span />
              )}
            </div>
          </article>
        </div>

        {/* Assistant AKA */}
        <aside className="hidden border-l border-border lg:block">
          <AkaAssistant context={`${formation.titre} — ${courante.titre}`} />
        </aside>
      </div>
    </div>
  );
}

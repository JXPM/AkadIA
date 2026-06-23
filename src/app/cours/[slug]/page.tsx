import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  PanelLeftClose,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AkaAssistant } from "@/components/course/aka-assistant";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { lessonTypeLabels } from "@/lib/data";
import { getFormationBySlug } from "@/lib/queries";

// Données dynamiques (Supabase + cookies) : rendu à la demande.
export const dynamic = "force-dynamic";

export default async function CoursPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);
  if (!formation) notFound();

  const firstLesson = formation.modules[0]?.chapitres[0]?.lessons[0];

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
            <Progress value={42} />
            <span className="text-xs text-muted-foreground">42%</span>
          </div>
          <ThemeToggle />
          <Logo showText={false} />
        </div>
      </header>

      {/* 3 colonnes */}
      <div className="grid min-h-0 flex-1 lg:grid-cols-[280px_1fr_360px]">
        {/* Menu gauche : sommaire */}
        <aside className="hidden overflow-y-auto border-r border-border bg-card/40 lg:block">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-semibold">Programme</span>
            <PanelLeftClose className="size-4 text-muted-foreground" />
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
                    {c.lessons.map((l, li) => {
                      const Icon =
                        l.type === "capsule_video"
                          ? PlayCircle
                          : l.type === "quiz"
                            ? HelpCircle
                            : FileText;
                      const done = mi === 0 && li === 0;
                      return (
                        <button
                          key={l.id}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                        >
                          {done ? (
                            <CheckCircle2 className="size-4 shrink-0 text-success" />
                          ) : (
                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="flex-1 truncate">{l.titre}</span>
                          <span className="text-xs text-muted-foreground">{l.duree}m</span>
                        </button>
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
              {firstLesson ? lessonTypeLabels[firstLesson.type] : "Leçon"}
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight">
              {firstLesson?.titre ?? "Leçon"}
            </h1>

            {/* Lecteur vidéo factice pour les capsules */}
            {firstLesson?.type === "capsule_video" && (
              <div className="mt-6 grid aspect-video place-items-center rounded-xl gradient-brand text-white">
                <PlayCircle className="size-16 opacity-90" />
              </div>
            )}

            <div className="prose-akadia mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/90">
              <p>
                Un <strong>LLM</strong> (Large Language Model) est un modèle d&apos;intelligence
                artificielle entraîné sur d&apos;immenses quantités de texte pour prédire le
                mot suivant le plus probable. Cette capacité, en apparence simple, permet de
                résumer, traduire, rédiger et raisonner.
              </p>
              <p>
                Le contenu d&apos;une leçon peut contenir du <strong>texte enrichi</strong>,
                des images, des schémas, des tableaux, des PDF, des vidéos et des exercices
                interactifs — le tout dans une navigation fluide.
              </p>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm font-medium">💡 À retenir</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Un bon prompt fournit un rôle, un contexte, des contraintes et un format de
                  sortie attendu. Entraînez-vous dans le{" "}
                  <Link href="/laboratoire" className="text-brand hover:underline">
                    Laboratoire IA
                  </Link>
                  .
                </p>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2">Élément</th>
                    <th className="py-2">Rôle</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-2">Tokens</td>
                    <td className="py-2">Unités de texte traitées par le modèle</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">Contexte</td>
                    <td className="py-2">Mémoire de travail du modèle</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Button variant="outline">
                <ArrowLeft className="size-4" /> Précédent
              </Button>
              <Button variant="brand">Marquer comme terminé</Button>
            </div>
          </article>
        </div>

        {/* Assistant AKA */}
        <aside className="hidden border-l border-border lg:block">
          <AkaAssistant context={`${formation.titre} — ${firstLesson?.titre ?? ""}`} />
        </aside>
      </div>
    </div>
  );
}

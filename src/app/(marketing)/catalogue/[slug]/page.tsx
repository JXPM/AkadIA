import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Star,
  Users,
  Check,
  PlayCircle,
  FileText,
  HelpCircle,
  Boxes,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formations as demoFormations, lessonTypeLabels } from "@/lib/data";
import { getFormationBySlug, isSupabaseEnabled } from "@/lib/queries";
import { formatPrice, formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  // Avec Supabase, rendu à la demande (pas d'accès cookies au build).
  if (isSupabaseEnabled()) return [];
  return demoFormations.map((f) => ({ slug: f.slug }));
}

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);
  if (!formation) notFound();

  const totalLessons = formation.modules.reduce(
    (acc, m) => acc + m.chapitres.reduce((a, c) => a + c.lessons.length, 0),
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Colonne principale */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{formation.categorie}</Badge>
            <Badge variant="muted">{formation.difficulte}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {formation.titre}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {formation.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {formation.note} · {formatNumber(formation.apprenants)} apprenants
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> {formation.duree}h · {totalLessons} leçons
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> Par {formation.auteur}
            </span>
          </div>

          {/* Objectifs */}
          <Card className="mt-8 p-6">
            <h2 className="font-semibold">Objectifs pédagogiques</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {formation.objectifs.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {o}
                </li>
              ))}
            </ul>
          </Card>

          {/* Programme */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Programme</h2>
            <div className="mt-4 space-y-4">
              {formation.modules.map((m, mi) => (
                <Card key={m.id} className="overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3">
                    <Boxes className="size-4 text-brand" />
                    <span className="font-medium">
                      Module {mi + 1} · {m.titre}
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {m.chapitres.map((c) => (
                      <div key={c.id} className="px-5 py-3">
                        <p className="text-sm font-medium text-muted-foreground">
                          {c.titre}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {c.lessons.map((l) => {
                            const Icon =
                              l.type === "capsule_video"
                                ? PlayCircle
                                : l.type === "quiz"
                                  ? HelpCircle
                                  : FileText;
                            return (
                              <li
                                key={l.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon className="size-4 text-brand" />
                                  {l.titre}
                                  <Badge variant="muted" className="ml-1">
                                    {lessonTypeLabels[l.type]}
                                  </Badge>
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {l.duree} min
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {formation.tags.map((t) => (
              <Badge key={t} variant="outline">
                #{t}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sidebar achat */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            <div className="h-32 gradient-brand" />
            <div className="space-y-4 p-6">
              <p className="text-3xl font-bold">{formatPrice(formation.prix)}</p>
              <Button variant="brand" className="w-full" size="lg" asChild>
                <Link href={`/cours/${formation.slug}`}>Commencer la formation</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/inscription">Ajouter au panier</Link>
              </Button>
              <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
                {[
                  `${formation.duree}h de contenu`,
                  `${totalLessons} leçons`,
                  "Assistant IA AKA inclus",
                  "Attestation de réussite",
                  "Accès à vie",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Check className="size-4 text-success" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

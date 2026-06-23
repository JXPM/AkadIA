import Link from "next/link";
import {
  TrendingUp,
  Clock,
  Award,
  Trophy,
  Compass,
  Wand2,
  BarChart3,
  BrainCircuit,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getFormations, getBadges } from "@/lib/queries";
import { cn } from "@/lib/utils";

const badgeIcons: Record<string, typeof Compass> = {
  Compass,
  Wand2,
  BarChart3,
  BrainCircuit,
  GraduationCap,
};

const kpis = [
  { label: "Progression globale", value: "72 %", icon: TrendingUp, hint: "+8 % cette semaine" },
  { label: "Temps d'apprentissage", value: "41 h", icon: Clock, hint: "Ce mois-ci" },
  { label: "Certifications", value: "3", icon: Award, hint: "Obtenues" },
  { label: "Badges", value: "3 / 5", icon: Trophy, hint: "Niveau 6" },
];

const activites = [
  { txt: "Quiz « Les bases » réussi — 9/10", time: "Il y a 2 h", icon: Trophy },
  { txt: "Capsule vidéo « Qu'est-ce qu'un LLM ? » visionnée", time: "Il y a 5 h", icon: GraduationCap },
  { txt: "Badge « Prompt Master » débloqué", time: "Hier", icon: Wand2 },
  { txt: "Atelier « Réécrire un prompt » terminé", time: "Il y a 2 j", icon: BrainCircuit },
];

export default async function DashboardPage() {
  const [formations, badges] = await Promise.all([getFormations(), getBadges()]);
  const progressByIndex = [68, 35, 90];
  const enCours = [formations[0], formations[2], formations[3]]
    .filter(Boolean)
    .map((f, i) => ({ ...f, progress: progressByIndex[i] ?? 50 }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bonjour, Marie 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Vous êtes à 72 % de vos objectifs. Continuez sur votre lancée !
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <k.icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-xs text-success">{k.hint}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formations en cours */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Formations en cours</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/catalogue">
                Catalogue <ArrowRight />
              </Link>
            </Button>
          </div>
          {enCours.map((f) => (
            <Card key={f.id}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="h-14 w-14 shrink-0 rounded-lg gradient-brand" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-medium">{f.titre}</h3>
                    <Badge variant="muted">{f.progress}%</Badge>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">{f.categorie}</p>
                  <Progress value={f.progress} />
                </div>
                <Button variant="brand" size="sm" asChild>
                  <Link href={`/cours/${f.slug}`}>Reprendre</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mes badges</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-5 gap-2">
              {badges.map((b) => {
                const Icon = badgeIcons[b.icone] ?? Trophy;
                return (
                  <div
                    key={b.id}
                    title={`${b.nom} — ${b.description}`}
                    className={cn(
                      "grid aspect-square place-items-center rounded-xl border",
                      b.obtenu
                        ? "border-brand/30 bg-brand/10 text-brand"
                        : "border-border bg-muted text-muted-foreground/40"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Activités récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activités récentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activites.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-brand">
                    <a.icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm">{a.txt}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

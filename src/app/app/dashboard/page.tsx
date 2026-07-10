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
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getFormations,
  getBadges,
  getCurrentProfile,
  getLearnerStats,
  isSupabaseEnabled,
} from "@/lib/queries";
import { cn } from "@/lib/utils";

const badgeIcons: Record<string, LucideIcon> = {
  Compass,
  Wand2,
  BarChart3,
  BrainCircuit,
  GraduationCap,
};

// Contenu fictif affiché uniquement en mode démo (NEXT_PUBLIC_DEMO_MODE=1).
const demoKpis = [
  { label: "Progression globale", value: "72 %", icon: TrendingUp, hint: "+8 % cette semaine" },
  { label: "Temps d'apprentissage", value: "41 h", icon: Clock, hint: "Ce mois-ci" },
  { label: "Certifications", value: "3", icon: Award, hint: "Obtenues" },
  { label: "Badges", value: "3 / 5", icon: Trophy, hint: "Niveau 6" },
];

const demoActivites = [
  { txt: "Quiz « Les bases » réussi — 9/10", time: "Il y a 2 h", icon: Trophy },
  { txt: "Capsule vidéo « Qu'est-ce qu'un LLM ? » visionnée", time: "Il y a 5 h", icon: GraduationCap },
  { txt: "Badge « Prompt Master » débloqué", time: "Hier", icon: Wand2 },
  { txt: "Atelier « Réécrire un prompt » terminé", time: "Il y a 2 j", icon: BrainCircuit },
];

export default async function DashboardPage() {
  const demo = !isSupabaseEnabled();
  const [formations, badges, profile, stats] = await Promise.all([
    getFormations(),
    getBadges(),
    getCurrentProfile(),
    getLearnerStats(),
  ]);

  const publiees = formations.filter((f) => f.status === "publiee");
  const prenom = demo
    ? "Marie"
    : (profile?.userName ?? "").split(" ")[0] || "bienvenue";

  // KPIs : fictifs en démo, réels (comptages Supabase) sinon.
  const kpis = demo
    ? demoKpis
    : [
        {
          label: "Formations disponibles",
          value: String(publiees.length),
          icon: BookOpen,
          hint: "Dans votre organisation",
        },
        {
          label: "Quiz réussis",
          value: String(stats?.quizReussis ?? 0),
          icon: TrendingUp,
          hint: stats?.quizReussis ? "Bravo !" : "À vous de jouer",
        },
        {
          label: "Certificats",
          value: String(stats?.certificats ?? 0),
          icon: Award,
          hint: "Obtenus",
        },
        {
          label: "Badges",
          value: `${stats?.badgesObtenus ?? 0} / ${stats?.badgesTotal ?? badges.length}`,
          icon: Trophy,
          hint: "Débloqués",
        },
      ];

  // En démo : fausses formations « en cours » avec progression.
  // En réel : les formations publiées, à démarrer (pas de fausse progression).
  const demoProgress = [68, 35, 90];
  const enCours = demo
    ? [formations[0], formations[2], formations[3]]
        .filter(Boolean)
        .map((f, i) => ({ ...f, progress: demoProgress[i] ?? 50 }))
    : publiees.slice(0, 3).map((f) => ({ ...f, progress: null as number | null }));

  const activites = demo ? demoActivites : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bonjour, {prenom} 👋</h1>
        <p className="mt-1 text-muted-foreground">
          {demo
            ? "Vous êtes à 72 % de vos objectifs. Continuez sur votre lancée !"
            : "Bienvenue sur AKADIA. Choisissez une formation pour commencer votre parcours."}
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
        {/* Formations */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {demo ? "Formations en cours" : "Formations pour vous"}
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/catalogue">
                Catalogue <ArrowRight />
              </Link>
            </Button>
          </div>
          {enCours.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <Sparkles className="size-8 text-brand" />
                <p className="font-medium">Aucune formation disponible pour l&apos;instant</p>
                <p className="text-sm text-muted-foreground">
                  Explorez le catalogue pour découvrir les parcours de votre organisation.
                </p>
                <Button variant="brand" size="sm" asChild>
                  <Link href="/app/catalogue">Parcourir le catalogue</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            enCours.map((f) => (
              <Card key={f.id}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="h-14 w-14 shrink-0 rounded-lg gradient-brand" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-medium">{f.titre}</h3>
                      {f.progress !== null && (
                        <Badge variant="muted">{f.progress}%</Badge>
                      )}
                    </div>
                    <p className="mb-2 text-xs text-muted-foreground">{f.categorie}</p>
                    {f.progress !== null ? (
                      <Progress value={f.progress} />
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {f.duree} h · {f.difficulte}
                      </p>
                    )}
                  </div>
                  <Button variant="brand" size="sm" asChild>
                    <Link href={`/cours/${f.slug}`}>
                      {f.progress !== null ? "Reprendre" : "Commencer"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
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
              {activites.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aucune activité pour l&apos;instant. Vos quiz, badges et leçons
                  terminées apparaîtront ici.
                </p>
              ) : (
                activites.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-brand">
                      <a.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm">{a.txt}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Play,
  HelpCircle,
  Boxes,
  Swords,
  KeyRound,
  Users,
  Timer,
  Trophy,
  AlertCircle,
  ArrowLeft,
  Radio,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/brand/logo";

const participants = [
  { nom: "Marie D.", score: 92, statut: "ok" },
  { nom: "Karim B.", score: 78, statut: "ok" },
  { nom: "Élodie F.", score: 64, statut: "bloque" },
  { nom: "Thomas L.", score: 88, statut: "ok" },
  { nom: "Nadia E.", score: 45, statut: "bloque" },
  { nom: "Pierre V.", score: 71, statut: "ok" },
];

const activites = [
  { label: "Lancer un quiz", icon: HelpCircle },
  { label: "Lancer un atelier", icon: Boxes },
  { label: "Lancer un challenge", icon: Swords },
  { label: "Escape game", icon: KeyRound },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function FormateurPage() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [activite, setActivite] = useState("Quiz : les bases de l'IA");

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const connectes = participants.length;
  const bloques = participants.filter((p) => p.statut === "bloque").length;
  const moyenne = Math.round(participants.reduce((a, p) => a + p.score, 0) / connectes);
  const classement = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="size-4" /> Admin
            </Link>
          </Button>
          <Badge variant={running ? "success" : "muted"}>
            <Radio className="size-3" /> {running ? "Session en direct" : "Session prête"}
          </Badge>
        </div>
        <Logo />
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[260px_1fr_300px]">
        {/* Pilotage */}
        <aside className="space-y-4 overflow-y-auto border-r border-border p-4">
          <Button
            variant={running ? "destructive" : "brand"}
            className="w-full"
            onClick={() => setRunning((v) => !v)}
          >
            <Play className="size-4" /> {running ? "Arrêter la session" : "Lancer la session"}
          </Button>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Activités
            </p>
            <div className="space-y-2">
              {activites.map((a) => (
                <button
                  key={a.label}
                  onClick={() => setActivite(a.label)}
                  className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
                >
                  <a.icon className="size-4 text-brand" /> {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <Card className="p-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Timer className="size-3.5" /> Compte à rebours
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums">{fmt(seconds)}</p>
            <div className="mt-3 flex justify-center gap-1.5">
              {[60, 300, 600].map((s) => (
                <Button key={s} variant="outline" size="sm" onClick={() => setSeconds(s)}>
                  {s / 60}m
                </Button>
              ))}
            </div>
          </Card>
        </aside>

        {/* Projection */}
        <div className="min-w-0 overflow-y-auto p-6">
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-muted/40 px-5 py-3 text-sm font-medium">
              Mode projection — {activite}
            </div>
            <div className="grid place-items-center gap-6 p-10 text-center">
              <Badge variant="brand">Question 3 / 10</Badge>
              <h2 className="max-w-xl text-2xl font-bold">
                Quel composant prédit le mot suivant dans un LLM ?
              </h2>
              <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
                {["Le tokenizer", "Le modèle de langage", "La base de données", "Le navigateur"].map(
                  (opt, i) => (
                    <div
                      key={opt}
                      className="rounded-xl border border-border px-4 py-3 text-left text-sm"
                    >
                      <span className="font-semibold text-brand">{["A", "B", "C", "D"][i]}.</span>{" "}
                      {opt}
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>

          {/* Tableau de bord live */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Connectés", value: connectes, icon: Users },
              { label: "Score moyen", value: `${moyenne}%`, icon: Trophy },
              { label: "Bloqués", value: bloques, icon: AlertCircle },
            ].map((s) => (
              <Card key={s.label} className="flex items-center gap-3 p-4">
                <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <s.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <p className="mb-1 text-sm text-muted-foreground">Progression moyenne</p>
            <Progress value={moyenne} />
          </div>
        </div>

        {/* Participants / classement */}
        <aside className="overflow-y-auto border-l border-border p-4">
          <p className="mb-3 text-sm font-semibold">Classement live</p>
          <div className="space-y-2">
            {classement.map((p, i) => (
              <div
                key={p.nom}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm">{p.nom}</span>
                {p.statut === "bloque" && (
                  <AlertCircle className="size-4 text-warning" />
                )}
                <Badge variant={i === 0 ? "brand" : "muted"}>{p.score}</Badge>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

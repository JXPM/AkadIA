"use client";

import { useState } from "react";
import { Sparkles, Loader2, BookOpen, HelpCircle, Trophy, FileText, Library } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Plan = {
  titre: string;
  objectifs: string[];
  modules: { titre: string; lecons: string[]; quiz: string }[];
  projetFinal: string;
  glossaire: string[];
  bibliographie: string[];
  _demo?: boolean;
};

const exemples = [
  "Protection des données et IA",
  "Maîtriser Power BI",
  "Fondamentaux de la cybersécurité",
  "Comptabilité pour non-financiers",
];

export default function GenerateurFormationPage() {
  const [titre, setTitre] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  async function generer(t = titre) {
    if (!t.trim()) return;
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/ai/generate-formation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre: t }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPlan(await res.json());
    } catch {
      setPlan(null);
      alert("La génération a échoué. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Sparkles className="size-6 text-brand" /> Générateur de formations IA
        </h1>
        <p className="mt-1 text-muted-foreground">
          Saisissez un titre, AKADIA génère un plan pédagogique complet — entièrement éditable.
        </p>
      </div>

      <Card className="p-6">
        <label className="text-sm font-medium" htmlFor="titre">
          Titre de la formation
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex : Protection des données et IA"
            onKeyDown={(e) => e.key === "Enter" && generer()}
          />
          <Button variant="brand" onClick={() => generer()} disabled={loading || !titre.trim()}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Générer
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {exemples.map((e) => (
            <button
              key={e}
              onClick={() => {
                setTitre(e);
                generer(e);
              }}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              {e}
            </button>
          ))}
        </div>
      </Card>

      {loading && (
        <Card className="grid h-48 place-items-center p-6">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-brand" />
            <p className="text-sm">Génération du plan pédagogique…</p>
          </div>
        </Card>
      )}

      {plan && (
        <div className="space-y-5">
          {plan._demo && (
            <Badge variant="warning">
              Mode démo — branchez AI_GATEWAY_API_KEY pour la génération réelle
            </Badge>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold">{plan.titre}</h2>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium">
              <BookOpen className="size-4 text-brand" /> Objectifs pédagogiques
            </p>
            <ul className="mt-2 space-y-1.5">
              {plan.objectifs.map((o, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-brand">→</span> {o}
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-3">
            {plan.modules.map((m, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Module {i + 1} · {m.titre}</h3>
                  <Badge variant="brand">
                    <HelpCircle className="size-3" /> {m.quiz}
                  </Badge>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {m.lecons.map((l, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="size-3.5 text-brand" /> {l}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Trophy className="size-4 text-brand" /> Projet final
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.projetFinal}</p>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Library className="size-4 text-brand" /> Glossaire & bibliographie
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {[...plan.glossaire, ...plan.bibliographie].slice(0, 5).map((g, i) => (
                  <li key={i}>• {g}</li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Éditer le plan</Button>
            <Button variant="brand">Créer la formation</Button>
          </div>
        </div>
      )}
    </div>
  );
}

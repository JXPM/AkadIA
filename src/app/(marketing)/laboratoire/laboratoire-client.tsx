"use client";

import { useState } from "react";
import { FlaskConical, Sparkles, Copy, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeading } from "@/components/marketing/section";
import type { PromptEntry } from "@/lib/types";

type Result = { score: number; axes: string[]; optimized: string };

export function LaboratoireClient({ promptLibrary }: { promptLibrary: PromptEntry[] }) {
  const [prompt, setPrompt] = useState("");
  const [domaine, setDomaine] = useState("Comptabilité");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const domaines = ["Comptabilité", "Audit", "Fiscalité", "Contrôle de gestion", "RH", "Juridique", "Marketing", "Autre"];

  async function analyser() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/prompt-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  function genererPrompt() {
    setPrompt(
      `Tu es un expert en ${domaine.toLowerCase()}. Analyse la situation suivante et propose des recommandations concrètes et chiffrées. Format : liste structurée avec priorités.`
    );
  }

  const scoreColor =
    !result ? "" : result.score >= 80 ? "text-success" : result.score >= 60 ? "text-warning" : "text-destructive";

  return (
    <>
      <Section className="!pb-8">
        <SectionHeading
          eyebrow="Laboratoire IA"
          title="Entraînez-vous au prompting"
          subtitle="Testez vos prompts, obtenez un score sur 100, des axes d'amélioration et une version optimisée."
        />
      </Section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Éditeur */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <FlaskConical className="size-5 text-brand" />
              <h3 className="font-semibold">Votre prompt</h3>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <select
                value={domaine}
                onChange={(e) => setDomaine(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              >
                {domaines.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={genererPrompt}>
                <Sparkles className="size-4" /> Générer un prompt
              </Button>
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={9}
              placeholder="Écrivez votre prompt professionnel ici…"
            />
            <Button
              variant="brand"
              className="mt-4 w-full"
              onClick={analyser}
              disabled={loading || !prompt.trim()}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Analyser mon prompt
            </Button>
          </Card>

          {/* Résultat */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Évaluation</h3>
            {!result && !loading && (
              <div className="grid h-64 place-items-center text-center text-sm text-muted-foreground">
                Lancez une analyse pour obtenir votre score et vos axes d&apos;amélioration.
              </div>
            )}
            {loading && (
              <div className="grid h-64 place-items-center">
                <Loader2 className="size-6 animate-spin text-brand" />
              </div>
            )}
            {result && (
              <div className="space-y-5">
                <div className="flex items-end gap-2">
                  <span className={`text-5xl font-bold ${scoreColor}`}>{result.score}</span>
                  <span className="mb-2 text-muted-foreground">/ 100</span>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Axes d&apos;amélioration</p>
                  <ul className="space-y-1.5">
                    {result.axes.map((a, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-brand">→</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Version optimisée</p>
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <pre className="whitespace-pre-wrap font-mono text-xs">{result.optimized}</pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigator.clipboard?.writeText(result.optimized)}
                    >
                      <Copy className="size-3.5" /> Copier
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Bibliothèque de prompts */}
        <div className="mt-14">
          <h3 className="text-xl font-semibold">Bibliothèque de prompts</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Des prompts professionnels prêts à l&apos;emploi, classés par domaine et niveau.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {promptLibrary.map((p) => (
              <Card key={p.id} className="p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{p.titre}</h4>
                  <Badge variant="muted">{p.niveau}</Badge>
                </div>
                <Badge variant="brand" className="mt-2">{p.domaine}</Badge>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.contenu}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setPrompt(p.contenu)}
                >
                  Utiliser ce prompt
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

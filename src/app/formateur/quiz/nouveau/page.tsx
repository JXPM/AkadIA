"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2, Plus, Sparkles, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { enregistrerQuiz, type QuestionInput } from "../../actions";

const OPTIONS_VIDES = ["", "", "", ""];

function questionVide(): QuestionInput {
  return { enonce: "", options: [...OPTIONS_VIDES], reponse: 0 };
}

export default function NouveauQuizPage() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([questionVide()]);
  const [sujet, setSujet] = useState("");
  const [nb, setNb] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function majQuestion(i: number, patch: Partial<QuestionInput>) {
    setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  }

  function majOption(i: number, oi: number, valeur: string) {
    setQuestions((qs) =>
      qs.map((q, j) =>
        j === i ? { ...q, options: q.options.map((o, k) => (k === oi ? valeur : o)) } : q
      )
    );
  }

  async function generer() {
    if (!sujet.trim()) return;
    setGenerating(true);
    setErreur(null);
    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sujet, nb }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTitre(data.titre ?? `Quiz : ${sujet}`);
      setQuestions(
        (data.questions ?? []).map((q: QuestionInput) => ({
          enonce: q.enonce ?? "",
          options: [...(q.options ?? []), ...OPTIONS_VIDES].slice(0, 4),
          reponse: q.reponse ?? 0,
        }))
      );
    } catch {
      setErreur("La génération a échoué. Réessayez dans un instant.");
    } finally {
      setGenerating(false);
    }
  }

  async function enregistrer() {
    setSaving(true);
    setErreur(null);
    const res = await enregistrerQuiz({ titre, questions });
    if (res.quizId) {
      router.push("/formateur");
    } else {
      setErreur(res.error ?? "Enregistrement impossible.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/formateur">
            <ArrowLeft className="size-4" /> Mes quiz
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau quiz</h1>
        <p className="mt-1 text-muted-foreground">
          Rédigez vos questions ou laissez l&apos;IA préparer le quiz — vous gardez la main
          sur tout avant d&apos;enregistrer.
        </p>
      </div>

      {/* Génération IA */}
      <Card className="space-y-3 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-brand" /> Générer avec l&apos;IA
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            placeholder="Sujet du quiz, ex. « Les bases du RGPD »"
            className="flex-1"
          />
          <select
            value={nb}
            onChange={(e) => setNb(Number(e.target.value))}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {[3, 5, 8, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={generer} disabled={generating || !sujet.trim()}>
            {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Générer
          </Button>
        </div>
      </Card>

      {/* Éditeur */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="titre">Titre du quiz</label>
        <Input
          id="titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex. Quiz : les bases de l'IA générative"
        />
      </div>

      {questions.map((q, i) => (
        <Card key={i} className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Question {i + 1}</p>
            {questions.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Supprimer la question"
                onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
          <Input
            value={q.enonce}
            onChange={(e) => majQuestion(i, { enonce: e.target.value })}
            placeholder="Énoncé de la question"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((o, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <button
                  type="button"
                  title="Marquer comme bonne réponse"
                  onClick={() => majQuestion(i, { reponse: oi })}
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                    q.reponse === oi
                      ? "border-transparent bg-success text-white"
                      : "border-border text-muted-foreground hover:bg-accent"
                  )}
                >
                  {q.reponse === oi ? <Check className="size-4" /> : String.fromCharCode(65 + oi)}
                </button>
                <Input
                  value={o}
                  onChange={(e) => majOption(i, oi, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => setQuestions((qs) => [...qs, questionVide()])}>
          <Plus className="size-4" /> Ajouter une question
        </Button>
        <Button variant="brand" onClick={enregistrer} disabled={saving || !titre.trim()}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Enregistrer le quiz
        </Button>
      </div>
      {erreur && <p className="text-sm text-destructive">{erreur}</p>}
    </div>
  );
}

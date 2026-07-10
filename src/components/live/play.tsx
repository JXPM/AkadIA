"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type PlayState = {
  etat: "lobby" | "question" | "resultats" | "terminee";
  titre: string;
  questionIndex: number;
  totalQuestions: number;
  pseudo: string;
  score: number;
  rang: number;
  nbParticipants: number;
  question?: { enonce: string; options: string[] } | null;
  tempsRestant?: number;
  aRepondu?: boolean;
  bonneReponse?: number | null;
  maReponse?: { correcte: boolean; points: number } | null;
  podium?: { pseudo: string; score: number }[];
};

const COULEURS = ["bg-red-500", "bg-blue-500", "bg-amber-500", "bg-green-600"];
const STORAGE_KEY = "akadia-live";

export function Play({ codeInitial = "" }: { codeInitial?: string }) {
  const [code, setCode] = useState(codeInitial);
  const [pseudo, setPseudo] = useState("");
  const [ids, setIds] = useState<{ sessionId: string; participantId: string } | null>(null);
  const [state, setState] = useState<PlayState | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  // Reprendre la partie après un rechargement de page.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setIds(JSON.parse(saved));
      } catch {
        /* stockage indisponible : on repart du formulaire */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const rafraichir = useCallback(async () => {
    if (!ids) return;
    try {
      const res = await fetch(
        `/api/live/state?session=${ids.sessionId}&participant=${ids.participantId}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) {
        // Session/participant disparu : retour au formulaire.
        localStorage.removeItem(STORAGE_KEY);
        setIds(null);
        setState(null);
        setErreur(data.error ?? "Session terminée.");
        return;
      }
      setState(data);
      setErreur(null);
    } catch {
      /* erreur réseau passagère : on retentera au prochain tick */
    }
  }, [ids]);

  useEffect(() => {
    if (!ids) return;
    const premier = setTimeout(rafraichir, 0);
    const id = setInterval(rafraichir, 2000);
    return () => {
      clearTimeout(premier);
      clearInterval(id);
    };
  }, [ids, rafraichir]);

  async function rejoindre() {
    setJoining(true);
    setErreur(null);
    try {
      const res = await fetch("/api/live/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, pseudo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible de rejoindre.");
      const next = { sessionId: data.sessionId, participantId: data.participantId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIds(next);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Impossible de rejoindre.");
    } finally {
      setJoining(false);
    }
  }

  async function repondre(choix: number) {
    if (!ids || envoi || state?.aRepondu) return;
    setEnvoi(true);
    try {
      await fetch("/api/live/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ids, reponse: choix }),
      });
      setState((s) => (s ? { ...s, aRepondu: true } : s));
    } finally {
      setEnvoi(false);
    }
  }

  function quitter() {
    localStorage.removeItem(STORAGE_KEY);
    setIds(null);
    setState(null);
  }

  // --- Formulaire pour rejoindre ---
  if (!ids) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-6 px-4">
        <Logo />
        <Card className="w-full space-y-4 p-6">
          <h1 className="text-center text-xl font-bold">Rejoindre une session</h1>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="code">Code de session</label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex. 7K3F9Q"
              maxLength={6}
              className="text-center font-mono text-lg tracking-[0.3em] uppercase"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="pseudo">Ton pseudo</label>
            <Input
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex. Marie"
              maxLength={24}
            />
          </div>
          <Button
            variant="brand"
            className="w-full"
            size="lg"
            onClick={rejoindre}
            disabled={joining || code.trim().length < 4 || pseudo.trim().length < 2}
          >
            {joining ? <Loader2 className="size-4 animate-spin" /> : null} C&apos;est parti !
          </Button>
          {erreur && <p className="text-center text-sm text-destructive">{erreur}</p>}
        </Card>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <Badge variant="brand">{state.pseudo}</Badge>
        <p className="font-mono text-sm">
          {state.score} pts · {state.rang}
          <sup>e</sup>
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
        {/* Lobby */}
        {state.etat === "lobby" && (
          <div className="text-center">
            <Users className="mx-auto size-10 text-brand" />
            <h1 className="mt-3 text-xl font-bold">Tu es dans la partie !</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              « {state.titre} » — {state.nbParticipants} participant(s).
              <br />
              En attente du lancement par le formateur…
            </p>
          </div>
        )}

        {/* Question */}
        {state.etat === "question" && state.question && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Question {state.questionIndex + 1}/{state.totalQuestions}
              </span>
              <span className="text-lg font-bold tabular-nums text-brand">
                {state.tempsRestant ?? 0}s
              </span>
            </div>
            <h1 className="text-center text-lg font-bold">{state.question.enonce}</h1>
            {state.aRepondu ? (
              <Card className="p-8 text-center">
                <p className="text-lg font-semibold">Réponse enregistrée ✅</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Attends la fin de la question…
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {state.question.options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => repondre(i)}
                    disabled={envoi}
                    className={cn(
                      "rounded-xl px-4 py-4 text-left font-medium text-white transition-transform active:scale-95",
                      COULEURS[i % COULEURS.length]
                    )}
                  >
                    {String.fromCharCode(65 + i)}. {o}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Résultats de la question */}
        {state.etat === "resultats" && (
          <div className="w-full text-center">
            {state.maReponse ? (
              state.maReponse.correcte ? (
                <>
                  <p className="text-5xl">🎉</p>
                  <h1 className="mt-2 text-2xl font-bold text-success">Bonne réponse !</h1>
                  <p className="mt-1 text-lg font-mono">+{state.maReponse.points} pts</p>
                </>
              ) : (
                <>
                  <p className="text-5xl">😅</p>
                  <h1 className="mt-2 text-2xl font-bold text-destructive">Raté…</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ça se joue à la prochaine !
                  </p>
                </>
              )
            ) : (
              <>
                <p className="text-5xl">⏱️</p>
                <h1 className="mt-2 text-2xl font-bold">Pas de réponse</h1>
              </>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Tu es {state.rang}
              <sup>e</sup> avec {state.score} pts
            </p>
          </div>
        )}

        {/* Fin de partie */}
        {state.etat === "terminee" && (
          <div className="w-full text-center">
            <Trophy className="mx-auto size-10 text-amber-400" />
            <h1 className="mt-2 text-2xl font-bold">
              {state.rang === 1
                ? "Champion ! 🥇"
                : state.rang <= 3
                  ? `${state.rang}e place — bien joué !`
                  : `${state.rang}e sur ${state.nbParticipants}`}
            </h1>
            <p className="mt-1 font-mono text-lg">{state.score} pts</p>
            {state.podium && (
              <Card className="mt-6 p-4 text-left">
                {state.podium.map((p, i) => (
                  <div key={p.pseudo} className="flex justify-between py-1 text-sm">
                    <span>
                      {["🥇", "🥈", "🥉"][i]} {p.pseudo}
                    </span>
                    <span className="font-mono">{p.score}</span>
                  </div>
                ))}
              </Card>
            )}
            <Button variant="outline" className="mt-6" onClick={quitter}>
              Quitter la partie
            </Button>
          </div>
        )}
      </div>
      {erreur && <p className="pb-4 text-center text-sm text-destructive">{erreur}</p>}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import {
  ArrowLeft,
  Loader2,
  Play,
  Radio,
  SkipForward,
  Square,
  Trophy,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import { commandeSession } from "@/app/formateur/actions";
import { cn } from "@/lib/utils";

type Participant = { id: string; pseudo: string; score: number };

type HostState = {
  etat: "lobby" | "question" | "resultats" | "terminee";
  code: string | null;
  titre: string;
  questionIndex: number;
  totalQuestions: number;
  participants: Participant[];
  question?: { enonce: string; options: string[]; reponse: number } | null;
  nbReponses?: number;
  repartition?: number[];
  tempsRestant?: number;
  error?: string;
};

const COULEURS_OPTIONS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-green-600",
];

export function HostConsole({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<HostState | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Hôte courant (valeur purement client, vide côté serveur).
  const host = useSyncExternalStore(
    () => () => {},
    () => window.location.host,
    () => ""
  );

  const rafraichir = useCallback(async () => {
    try {
      const res = await fetch(`/api/live/host-state?session=${sessionId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setState(data);
      setErreur(null);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur de connexion.");
    }
  }, [sessionId]);

  useEffect(() => {
    const premier = setTimeout(rafraichir, 0);
    const id = setInterval(rafraichir, 2000);
    return () => {
      clearTimeout(premier);
      clearInterval(id);
    };
  }, [rafraichir]);

  // QR code vers la page de participation.
  useEffect(() => {
    if (!state?.code) return;
    const url = `${window.location.origin}/rejoindre/${state.code}`;
    QRCode.toDataURL(url, { width: 360, margin: 1 }).then(setQr).catch(() => setQr(null));
  }, [state?.code]);

  async function commande(cmd: "demarrer" | "resultats" | "suivante" | "terminer") {
    setBusy(true);
    await commandeSession(sessionId, cmd);
    await rafraichir();
    setBusy(false);
  }

  if (!state) {
    return (
      <div className="grid h-screen place-items-center">
        {erreur ? (
          <p className="text-destructive">{erreur}</p>
        ) : (
          <Loader2 className="size-8 animate-spin text-brand" />
        )}
      </div>
    );
  }

  const derniere = state.questionIndex >= state.totalQuestions - 1;
  const classement = [...state.participants].sort((a, b) => b.score - a.score);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/formateur">
              <ArrowLeft className="size-4" /> Quitter
            </Link>
          </Button>
          <Badge variant={state.etat === "terminee" ? "muted" : "success"}>
            <Radio className="size-3" />
            {state.etat === "lobby"
              ? "Lobby ouvert"
              : state.etat === "terminee"
                ? "Session terminée"
                : `Question ${state.questionIndex + 1}/${state.totalQuestions}`}
          </Badge>
          <span className="hidden text-sm font-medium sm:block">{state.titre}</span>
        </div>
        <Logo showText={false} />
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8">
        {/* LOBBY : code + QR + participants */}
        {state.etat === "lobby" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="flex flex-col items-center gap-4 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Rejoignez sur{" "}
                <span className="font-medium text-foreground">{host}/rejoindre</span>{" "}
                avec le code
              </p>
              <p className="font-mono text-6xl font-bold tracking-[0.3em] text-brand">
                {state.code}
              </p>
              {qr && (
                <Image
                  src={qr}
                  alt={`QR code pour rejoindre la session ${state.code}`}
                  width={220}
                  height={220}
                  unoptimized
                  className="rounded-xl border border-border bg-white p-2"
                />
              )}
            </Card>
            <Card className="flex flex-col p-6">
              <p className="flex items-center gap-2 font-semibold">
                <Users className="size-4 text-brand" />
                {state.participants.length} participant(s)
              </p>
              <div className="mt-4 flex flex-1 flex-wrap content-start gap-2">
                {state.participants.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    En attente des participants…
                  </p>
                ) : (
                  state.participants.map((p) => (
                    <Badge key={p.id} variant="muted">{p.pseudo}</Badge>
                  ))
                )}
              </div>
              <Button
                variant="brand"
                size="lg"
                className="mt-6"
                disabled={busy || state.participants.length === 0}
                onClick={() => commande("demarrer")}
              >
                <Play className="size-4" /> Démarrer le quiz
              </Button>
            </Card>
          </div>
        )}

        {/* QUESTION en cours */}
        {state.etat === "question" && state.question && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {state.nbReponses ?? 0}/{state.participants.length} réponses
              </p>
              <p className="text-3xl font-bold tabular-nums text-brand">
                {state.tempsRestant ?? 0}s
              </p>
            </div>
            <Card className="p-8">
              <h2 className="text-center text-2xl font-bold">{state.question.enonce}</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {state.question.options.map((o, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-xl px-5 py-4 font-medium text-white",
                      COULEURS_OPTIONS[i % COULEURS_OPTIONS.length]
                    )}
                  >
                    {String.fromCharCode(65 + i)}. {o}
                  </div>
                ))}
              </div>
            </Card>
            <Button variant="brand" size="lg" disabled={busy} onClick={() => commande("resultats")}>
              <Square className="size-4" /> Clore et afficher les résultats
            </Button>
          </div>
        )}

        {/* RÉSULTATS de la question */}
        {state.etat === "resultats" && state.question && (
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-center text-2xl font-bold">{state.question.enonce}</h2>
              <div className="mt-8 space-y-3">
                {state.question.options.map((o, i) => {
                  const total = Math.max(1, state.nbReponses ?? 0);
                  const n = state.repartition?.[i] ?? 0;
                  const bonne = i === state.question?.reponse;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={cn("font-medium", bonne && "text-success")}>
                          {bonne ? "✓ " : ""}
                          {String.fromCharCode(65 + i)}. {o}
                        </span>
                        <span className="text-muted-foreground">{n}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            bonne ? "bg-success" : COULEURS_OPTIONS[i % COULEURS_OPTIONS.length]
                          )}
                          style={{ width: `${Math.round((n / total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <Button
                variant="brand"
                size="lg"
                disabled={busy}
                onClick={() => commande(derniere ? "terminer" : "suivante")}
              >
                {derniere ? (
                  <>
                    <Trophy className="size-4" /> Afficher le podium
                  </>
                ) : (
                  <>
                    <SkipForward className="size-4" /> Question suivante
                  </>
                )}
              </Button>
              <Card className="p-4">
                <p className="mb-2 text-sm font-semibold">Top 5</p>
                {classement.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="flex justify-between py-1 text-sm">
                    <span>
                      {i + 1}. {p.pseudo}
                    </span>
                    <span className="font-mono">{p.score}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* PODIUM final */}
        {state.etat === "terminee" && (
          <div className="space-y-6">
            <div className="text-center">
              <Trophy className="mx-auto size-12 text-amber-400" />
              <h2 className="mt-2 text-3xl font-bold">Podium</h2>
            </div>
            <div className="mx-auto flex max-w-xl items-end justify-center gap-4">
              {[1, 0, 2].map((pos) => {
                const p = classement[pos];
                if (!p) return null;
                const hauteurs = ["h-40", "h-28", "h-20"];
                const medailles = ["🥇", "🥈", "🥉"];
                return (
                  <div key={p.id} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-3xl">{medailles[pos]}</span>
                    <p className="font-semibold">{p.pseudo}</p>
                    <p className="font-mono text-sm text-muted-foreground">{p.score} pts</p>
                    <div
                      className={cn(
                        "w-full rounded-t-xl gradient-brand",
                        hauteurs[pos]
                      )}
                    />
                  </div>
                );
              })}
            </div>
            {classement.length > 3 && (
              <Card className="mx-auto max-w-xl p-4">
                {classement.slice(3).map((p, i) => (
                  <div key={p.id} className="flex justify-between py-1 text-sm">
                    <span>
                      {i + 4}. {p.pseudo}
                    </span>
                    <span className="font-mono">{p.score}</span>
                  </div>
                ))}
              </Card>
            )}
            <div className="text-center">
              <Button variant="brand" asChild>
                <Link href="/formateur">Retour à mes quiz</Link>
              </Button>
            </div>
          </div>
        )}

        {erreur && <p className="text-sm text-destructive">{erreur}</p>}
      </main>
    </div>
  );
}

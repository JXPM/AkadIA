"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creerSession } from "@/app/formateur/actions";

export function LancerSessionBouton({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function lancer() {
    setLoading(true);
    setErreur(null);
    const res = await creerSession(quizId);
    if (res.sessionId) {
      router.push(`/formateur/session/${res.sessionId}`);
    } else {
      setErreur(res.error ?? "Erreur inconnue.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="brand" size="sm" onClick={lancer} disabled={loading} className="w-full">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
        Lancer une session live
      </Button>
      {erreur && <p className="text-xs text-destructive">{erreur}</p>}
    </div>
  );
}

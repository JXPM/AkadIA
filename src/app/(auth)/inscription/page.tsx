import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "../actions";

export const metadata: Metadata = { title: "Inscription" };

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Créer votre compte</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Commencez gratuitement, sans carte bancaire.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <form action={signUp} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="prenom">Prénom</label>
            <Input id="prenom" name="prenom" placeholder="Marie" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="nom">Nom</label>
            <Input id="nom" name="nom" placeholder="Durand" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email professionnel</label>
          <Input id="email" name="email" type="email" required placeholder="marie@entreprise.fr" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
          <Input id="password" name="password" type="password" required minLength={8} placeholder="8 caractères minimum" />
        </div>
        <Button variant="brand" className="w-full" type="submit">
          Créer mon compte
        </Button>
      </form>

      <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
        {["Essai gratuit du plan Pro", "Annulable à tout moment", "Conforme RGPD"].map((x) => (
          <li key={x} className="flex items-center gap-2">
            <Check className="size-4 text-success" /> {x}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-medium text-brand hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

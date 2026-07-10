import Link from "next/link";
import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LordIcon } from "@/components/ui/lord-icon";
import { demanderReinitialisation } from "../actions";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default async function MotDePasseOubliePage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <LordIcon icon="email" size={64} trigger="loop" delay={2000} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Vérifiez votre boîte mail</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Si un compte existe avec cette adresse, un lien de réinitialisation
          vient de lui être envoyé. Il est valable 1 heure.
        </p>
        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/connexion" className="font-medium text-brand hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Mot de passe oublié</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Indiquez votre email : nous vous enverrons un lien pour choisir un
        nouveau mot de passe.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <form action={demanderReinitialisation} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" required placeholder="vous@entreprise.fr" />
        </div>
        <Button variant="brand" className="w-full" type="submit">
          Envoyer le lien
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/connexion" className="font-medium text-brand hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}

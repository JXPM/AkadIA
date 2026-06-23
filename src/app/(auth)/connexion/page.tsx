import Link from "next/link";
import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, signInWithGoogle } from "../actions";

export const metadata: Metadata = { title: "Connexion" };

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;
  const dest = redirect ?? "/app/dashboard";

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Bon retour 👋</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Connectez-vous pour accéder à votre espace.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <form action={signIn} className="mt-8 space-y-4">
        <input type="hidden" name="redirect" value={dest} />
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" required placeholder="vous@entreprise.fr" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
            <Link href="/connexion" className="text-xs text-brand hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        <Button variant="brand" className="w-full" type="submit">
          Se connecter
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> OU <span className="h-px flex-1 bg-border" />
      </div>
      <form action={signInWithGoogle}>
        <input type="hidden" name="redirect" value={dest} />
        <Button variant="outline" className="w-full" type="submit">
          Continuer avec Google
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-brand hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

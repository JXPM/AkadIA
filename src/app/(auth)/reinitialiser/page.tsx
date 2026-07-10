import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { definirNouveauMotDePasse } from "../actions";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // Accessible uniquement avec la session ouverte par le lien de réinitialisation.
  if (isSupabaseEnabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/mot-de-passe-oublie");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nouveau mot de passe</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choisissez votre nouveau mot de passe (8 caractères minimum).
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <form action={definirNouveauMotDePasse} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">Nouveau mot de passe</label>
          <Input id="password" name="password" type="password" required minLength={8} placeholder="••••••••" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="confirmation">Confirmez le mot de passe</label>
          <Input id="confirmation" name="confirmation" type="password" required minLength={8} placeholder="••••••••" />
        </div>
        <Button variant="brand" className="w-full" type="submit">
          Enregistrer et me connecter
        </Button>
      </form>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/logo";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { signUpViaInvitation } from "@/app/(auth)/actions";

export const metadata: Metadata = { title: "Rejoindre une organisation" };
export const dynamic = "force-dynamic";

// Cible du lien d'invitation partageable : inscription directe dans
// l'organisation du code, avec le rôle apprenant.
export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { code } = await params;
  const { error } = await searchParams;

  let orgNom: string | null = null;
  if (isSupabaseEnabled()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("organizations")
      .select("nom")
      .eq("invite_code", code)
      .maybeSingle();
    orgNom = data?.nom ?? null;
  }

  if (!orgNom) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-6 px-4 text-center">
        <Logo />
        <Card className="w-full space-y-3 p-6">
          <h1 className="text-xl font-bold">Lien d&apos;invitation invalide</h1>
          <p className="text-sm text-muted-foreground">
            Ce lien n&apos;existe pas ou n&apos;est plus actif. Demandez un
            nouveau lien à votre formateur.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4 py-10">
      <Logo />
      <Card className="w-full space-y-5 p-6 sm:p-8">
        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
            <GraduationCap className="size-6" />
          </span>
          <h1 className="mt-3 text-xl font-bold">
            Rejoindre {orgNom}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Créez votre compte apprenant pour accéder aux formations de{" "}
            {orgNom}.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <form action={signUpViaInvitation} className="space-y-4">
          <input type="hidden" name="code" value={code} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="prenom">Prénom</label>
              <Input id="prenom" name="prenom" required placeholder="Marie" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="nom">Nom</label>
              <Input id="nom" name="nom" placeholder="Durand" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required placeholder="marie@exemple.fr" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
            <Input id="password" name="password" type="password" required minLength={8} placeholder="8 caractères minimum" />
          </div>
          <Button variant="brand" className="w-full" size="lg" type="submit">
            Rejoindre {orgNom}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-brand hover:underline">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
}

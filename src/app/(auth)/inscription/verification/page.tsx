import Link from "next/link";
import type { Metadata } from "next";
import { LordIcon } from "@/components/ui/lord-icon";

export const metadata: Metadata = { title: "Vérifiez votre email" };

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <LordIcon icon="email" size={72} trigger="loop" delay={2000} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">
        Vérifiez votre boîte mail 📬
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Nous avons envoyé un lien de confirmation à{" "}
        {email ? (
          <strong className="text-foreground">{email}</strong>
        ) : (
          "votre adresse email"
        )}
        . Cliquez sur le bouton dans l&apos;email pour activer votre compte.
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        Pensez à vérifier vos spams. Le lien est valable 24 heures.
      </p>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Déjà confirmé ?{" "}
        <Link href="/connexion" className="font-medium text-brand hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

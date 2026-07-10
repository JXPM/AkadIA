import type { Metadata } from "next";
import { LordIcon, type LordIconName } from "@/components/ui/lord-icon";
import { Section } from "@/components/marketing/section";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { envoyerMessageContact } from "./actions";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Parlons de votre projet de formation
          </h1>
          <p className="mt-4 text-muted-foreground">
            Une question, une démo, un besoin sur-mesure ? Notre équipe vous
            répond sous 24h.
          </p>
          <div className="mt-8 space-y-4">
            {(
              [
                { icon: "email", label: "contact@akadia.fr" },
                { icon: "telephone", label: "+33 1 84 80 00 00" },
                { icon: "localisation", label: "12 rue de la Connaissance, 75002 Paris" },
              ] satisfies { icon: LordIconName; label: string }[]
            ).map(({ icon, label }) => (
              <div key={label} className="group flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-brand/10">
                  <LordIcon icon={icon} size={20} trigger="loop-on-hover" target=".group" />
                </span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          {sent && (
            <p className="mb-4 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              Message envoyé ! Nous vous répondons sous 24h.
            </p>
          )}
          {error && (
            <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <form action={envoyerMessageContact} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="prenom">
                  Prénom
                </label>
                <Input id="prenom" name="prenom" placeholder="Marie" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="nom">
                  Nom
                </label>
                <Input id="nom" name="nom" placeholder="Durand" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">
                Email professionnel
              </label>
              <Input id="email" name="email" type="email" required placeholder="marie@entreprise.fr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="message">
                Message
              </label>
              <Textarea id="message" name="message" rows={5} required minLength={10} placeholder="Votre besoin…" />
            </div>
            <Button variant="brand" className="w-full" type="submit">
              Envoyer le message
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              En envoyant ce formulaire, vous acceptez notre politique de
              confidentialité (RGPD).
            </p>
          </form>
        </Card>
      </div>
    </Section>
  );
}

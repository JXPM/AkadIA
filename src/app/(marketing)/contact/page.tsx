import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/marketing/section";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
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
            {[
              { icon: Mail, label: "contact@akadia.fr" },
              { icon: Phone, label: "+33 1 84 80 00 00" },
              { icon: MapPin, label: "12 rue de la Connaissance, 75002 Paris" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="prenom">
                  Prénom
                </label>
                <Input id="prenom" placeholder="Marie" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="nom">
                  Nom
                </label>
                <Input id="nom" placeholder="Durand" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">
                Email professionnel
              </label>
              <Input id="email" type="email" placeholder="marie@entreprise.fr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="message">
                Message
              </label>
              <Textarea id="message" rows={5} placeholder="Votre besoin…" />
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

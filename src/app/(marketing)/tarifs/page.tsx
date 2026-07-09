import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LordIcon, type LordIconName } from "@/components/ui/lord-icon";
import { Section, SectionHeading } from "@/components/marketing/section";
import { faq } from "@/lib/data";

export const metadata: Metadata = { title: "Pour les entreprises" };

const etapes: { icon: LordIconName; titre: string; desc: string }[] = [
  {
    icon: "assistant",
    titre: "On échange",
    desc: "Vous nous contactez et on cerne vos besoins de formation et vos équipes.",
  },
  {
    icon: "coche",
    titre: "On définit le programme",
    desc: "On choisit ensemble les formations pertinentes pour vos collaborateurs.",
  },
  {
    icon: "securite",
    titre: "On active l'accès",
    desc: "On ouvre l'accès à la plateforme pour votre organisation, sans frais cachés.",
  },
  {
    icon: "horloge",
    titre: "Pour la durée convenue",
    desc: "Vos équipes apprennent pendant la période définie ensemble.",
  },
];

export default function EntreprisesPage() {
  return (
    <>
      <Section className="!pb-10">
        <SectionHeading
          eyebrow="Pour les entreprises"
          title="Un accès sur mesure, pas de catalogue à la carte"
          subtitle="AKADIA s'adresse aux organisations. On définit ensemble le programme, puis on ouvre l'accès de vos équipes pour la durée qui vous convient."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {etapes.map((e, i) => (
            <Card key={e.titre} className="group flex flex-col gap-3 p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand/10">
                  <LordIcon icon={e.icon} size={22} trigger="loop-on-hover" target=".group" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  Étape {i + 1}
                </span>
              </div>
              <h3 className="font-semibold">{e.titre}</h3>
              <p className="text-sm text-muted-foreground">{e.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="max-w-xl text-muted-foreground">
            Chaque accès est défini avec vous : nombre d&apos;apprenants, formations
            incluses et période. Parlons de votre projet.
          </p>
          <Button variant="brand" size="lg" asChild>
            <Link href="/contact">Demander un accès</Link>
          </Button>
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHeading title="Questions fréquentes" />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border bg-card p-5"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium marker:content-none">
                {item.q}
                <span className="text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.r}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}

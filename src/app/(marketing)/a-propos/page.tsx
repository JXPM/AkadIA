import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Card } from "@/components/ui/card";
import { stats } from "@/lib/data";

export const metadata: Metadata = { title: "À propos" };

const valeurs = [
  {
    titre: "L'IA au service de l'humain",
    desc: "Nous automatisons la production et la maintenance pédagogique pour que formateurs et apprenants se concentrent sur l'essentiel.",
  },
  {
    titre: "Excellence pédagogique",
    desc: "Des parcours structurés, mesurables et certifiants, conçus avec des experts de chaque domaine.",
  },
  {
    titre: "Accessible à tous",
    desc: "Conformité WCAG, mode sombre, navigation clavier et design mobile-first : apprendre sans barrière.",
  },
];

export default function AProposPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="À propos"
          title="Nous construisons le Learning Operating System de demain"
          subtitle="AKADIA réinvente la formation professionnelle : un produit SaaS où l'IA générative compile, maintient et anime le savoir, pendant que les humains explorent et décident."
        />
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHeading title="Nos valeurs" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {valeurs.map((v) => (
            <Card key={v.titre} className="p-6">
              <h3 className="font-semibold">{v.titre}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

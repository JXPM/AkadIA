import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeading } from "@/components/marketing/section";
import { plans, faq } from "@/lib/data";
import { formatPrice, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tarifs" };

export default function TarifsPage() {
  return (
    <>
      <Section className="!pb-10">
        <SectionHeading
          eyebrow="Tarifs"
          title="Un plan pour chaque ambition"
          subtitle="Commencez gratuitement, passez à l'échelle quand vous êtes prêt."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.nom}
              className={cn(
                "relative flex flex-col p-7",
                p.highlight && "border-brand shadow-lg glow-brand"
              )}
            >
              {p.highlight && (
                <Badge variant="brand" className="absolute -top-3 left-7">
                  Le plus populaire
                </Badge>
              )}
              <h3 className="text-lg font-semibold">{p.nom}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold">
                  {p.prix === null
                    ? "Sur devis"
                    : p.prix === 0
                      ? "Gratuit"
                      : formatPrice(p.prix)}
                </span>
                {p.prix ? (
                  <span className="mb-1 text-sm text-muted-foreground">
                    {p.periode}
                  </span>
                ) : null}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={p.highlight ? "brand" : "outline"}
                className="mt-7 w-full"
                asChild
              >
                <Link href={p.prix === null ? "/contact" : "/inscription"}>
                  {p.cta}
                </Link>
              </Button>
            </Card>
          ))}
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

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LordIcon, type LordIconName } from "@/components/ui/lord-icon";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/marketing/reveal";
import { FormationCard } from "@/components/formation-card";
import { stats, features, temoignages, faq } from "@/lib/data";
import { getFormations } from "@/lib/queries";

const featureIcons: Record<string, LordIconName> = {
  Sparkles: "etincelles",
  Video: "video",
  Bot: "assistant",
  MonitorPlay: "ecran",
  FlaskConical: "outils",
  Trophy: "confettis",
};

const statIcons: LordIconName[] = ["avatar", "livre", "graphique", "cible"];

export default async function HomePage() {
  const formations = await getFormations();
  const populaires = formations.filter((f) => f.status === "publiee").slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Badge variant="brand" className="mb-6">
                <Sparkles className="size-3.5" /> Propulsé par l&apos;IA générative
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                Développez les compétences de demain avec{" "}
                <span className="text-gradient">AKADIA</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
                Une plateforme intelligente qui transforme l&apos;apprentissage
                professionnel grâce à l&apos;IA.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="brand" size="lg" asChild>
                  <Link href="/catalogue">
                    Découvrir les formations <ArrowRight />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/inscription">Créer un compte</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                Noté 4.8/5 par 48 000+ apprenants
              </p>
            </Reveal>
          </div>

          {/* Aperçu produit */}
          <Reveal delay={0.25}>
            <div className="mx-auto mt-16 max-w-5xl">
              <Card className="overflow-hidden glow-brand">
                <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
                  <span className="size-3 rounded-full bg-red-400" />
                  <span className="size-3 rounded-full bg-amber-400" />
                  <span className="size-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-muted-foreground">
                    app.akadia.fr/dashboard
                  </span>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-3">
                  {[
                    { k: "Progression", v: "72 %" },
                    { k: "Temps d'apprentissage", v: "41 h" },
                    { k: "Badges obtenus", v: "12" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-lg border border-border bg-background p-4">
                      <p className="text-sm text-muted-foreground">{s.k}</p>
                      <p className="mt-1 text-2xl font-bold">{s.v}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <Section className="!py-14">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="group text-center">
                <div className="mb-2 flex justify-center">
                  <LordIcon icon={statIcons[i]} size={32} trigger="loop-on-hover" target=".group" />
                </div>
                <p className="text-3xl font-bold sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FONCTIONNALITÉS */}
      <Section className="border-t border-border bg-card/30">
        <SectionHeading
          eyebrow="Fonctionnalités"
          title="Un Learning Operating System complet"
          subtitle="Tout ce qu'il faut pour créer, animer, vendre et suivre des formations — augmenté par l'IA à chaque étape."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const icon = featureIcons[f.icon] ?? "etincelles";
            return (
              <Reveal key={f.titre} delay={i * 0.05}>
                <Card className="group h-full p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4 grid size-11 place-items-center rounded-xl bg-brand/10">
                    <LordIcon icon={icon} size={26} trigger="loop-on-hover" target=".group" />
                  </div>
                  <h3 className="font-semibold">{f.titre}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* FORMATIONS POPULAIRES */}
      <Section>
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            center={false}
            eyebrow="Catalogue"
            title="Formations populaires"
            subtitle="Des parcours conçus par des experts, sur tous les sujets professionnels."
          />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/catalogue">
              Tout voir <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {populaires.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.05}>
              <FormationCard formation={f} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* TÉMOIGNAGES */}
      <Section className="border-t border-border bg-card/30">
        <SectionHeading
          eyebrow="Témoignages"
          title="Ils transforment leur formation avec AKADIA"
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {temoignages.map((t, i) => (
            <Reveal key={t.nom} delay={i * 0.05}>
              <Card className="group h-full p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <LordIcon icon="coeur" size={22} trigger="loop-on-hover" target=".group" />
                </div>
                <p className="text-sm leading-relaxed">&ldquo;{t.texte}&rdquo;</p>
                <div className="mt-5">
                  <p className="font-semibold">{t.nom}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="mb-4 flex justify-center">
          <LordIcon icon="aide" size={44} trigger="loop" delay={3000} />
        </div>
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.03}>
              <details className="group rounded-xl border border-border bg-card p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between font-medium marker:content-none">
                  {item.q}
                  <span className="text-brand transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.r}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA FINAL */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl gradient-brand px-8 py-16 text-center text-white sm:px-16">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Prêt à transformer votre formation ?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Rejoignez les 320+ organisations qui forment leurs équipes avec
                AKADIA.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/inscription">Créer un compte gratuit</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/contact">Demander une démo</Link>
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
                {["Sans carte bancaire", "Conforme RGPD", "Support en français"].map(
                  (x) => (
                    <li key={x} className="flex items-center gap-1.5">
                      <LordIcon
                        icon="coche"
                        size={18}
                        trigger="loop"
                        delay={4000}
                        colors="primary:#ffffff"
                      />{" "}
                      {x}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Blog" };

const articles = [
  {
    titre: "Comment l'IA générative réinvente la formation professionnelle",
    cat: "IA Générative",
    date: "12 juin 2026",
    extrait:
      "Des capsules vidéo automatiques aux assistants pédagogiques, tour d'horizon des usages qui changent la donne.",
  },
  {
    titre: "RGPD et IA : ce que tout formateur doit savoir",
    cat: "Conformité",
    date: "3 juin 2026",
    extrait:
      "Concilier personnalisation par l'IA et protection des données : les bonnes pratiques.",
  },
  {
    titre: "Gamifier ses formations sans tomber dans le gadget",
    cat: "Pédagogie",
    date: "27 mai 2026",
    extrait:
      "XP, badges, classements : comment la mécanique de jeu booste réellement l'engagement.",
  },
  {
    titre: "Le présentiel augmenté : animer une session live avec AKADIA",
    cat: "Formateur",
    date: "19 mai 2026",
    extrait:
      "Quiz live, escape games, projection et tableau de bord temps réel : le présentiel nouvelle génération.",
  },
];

export default function BlogPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Blog"
        title="Idées & bonnes pratiques"
        subtitle="Nos réflexions sur l'apprentissage, l'IA et l'avenir de la formation."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {articles.map((a) => (
          <Link key={a.titre} href="/blog" className="group">
            <Card className="h-full overflow-hidden hover:shadow-md transition-all">
              <div className="h-36 gradient-brand opacity-90" />
              <div className="space-y-2 p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="brand">{a.cat}</Badge>
                  {a.date}
                </div>
                <h3 className="font-semibold group-hover:text-brand transition-colors">
                  {a.titre}
                </h3>
                <p className="text-sm text-muted-foreground">{a.extrait}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

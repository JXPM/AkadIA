import { aiEnabled, AKADIA_MODEL } from "@/lib/ai";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { titre } = await req.json();
  const t = String(titre ?? "Nouvelle formation").trim();

  if (!aiEnabled()) {
    const plan = {
      titre: t,
      objectifs: [
        `Comprendre les fondamentaux de « ${t} »`,
        `Appliquer les concepts de « ${t} » à des cas concrets`,
        `Maîtriser les bonnes pratiques et éviter les pièges courants`,
        `Mener un projet complet de bout en bout`,
      ],
      modules: [
        {
          titre: "Fondations",
          lecons: ["Introduction et enjeux", "Concepts clés", "Vocabulaire essentiel"],
          quiz: "Quiz : valider les fondations",
        },
        {
          titre: "Mise en pratique",
          lecons: ["Méthodes et outils", "Atelier guidé", "Étude de cas réelle"],
          quiz: "Quiz : mise en pratique",
        },
        {
          titre: "Aller plus loin",
          lecons: ["Bonnes pratiques avancées", "Pièges fréquents", "Tendances 2026"],
          quiz: "Quiz : niveau avancé",
        },
      ],
      projetFinal: `Réaliser un projet appliqué autour de « ${t} », évalué par grille de compétences.`,
      glossaire: ["Terme A : définition", "Terme B : définition", "Terme C : définition"],
      bibliographie: [
        "Ouvrage de référence (2025)",
        "Article académique (2024)",
        "Ressource en ligne officielle",
      ],
      _demo: true,
    };
    return Response.json(plan);
  }

  const { generateObject } = await import("ai");
  const { z } = await import("zod");
  const { object } = await generateObject({
    model: AKADIA_MODEL,
    schema: z.object({
      titre: z.string(),
      objectifs: z.array(z.string()),
      modules: z.array(
        z.object({
          titre: z.string(),
          lecons: z.array(z.string()),
          quiz: z.string(),
        })
      ),
      projetFinal: z.string(),
      glossaire: z.array(z.string()),
      bibliographie: z.array(z.string()),
    }),
    prompt: `Génère le plan pédagogique complet d'une formation professionnelle intitulée « ${t} » : objectifs, modules (avec leçons et un quiz par module), projet final, glossaire et bibliographie. En français.`,
  });
  return Response.json(object);
}

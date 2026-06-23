import { aiEnabled, AKADIA_MODEL } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const text: string = String(prompt ?? "");

  if (!aiEnabled()) {
    // Heuristique de démo : score basé sur la richesse du prompt.
    const hasRole = /tu es|agis comme|en tant que/i.test(text);
    const hasFormat = /format|tableau|liste|json|étapes|points/i.test(text);
    const hasConstraint = /\d|maximum|au moins|sans|précis|concis/i.test(text);
    const lengthScore = Math.min(30, Math.round(text.length / 12));
    const score = Math.min(
      100,
      35 + lengthScore + (hasRole ? 15 : 0) + (hasFormat ? 12 : 0) + (hasConstraint ? 10 : 0)
    );

    const axes: string[] = [];
    if (!hasRole) axes.push("Définir un rôle/persona (« Tu es expert-comptable… »).");
    if (!hasFormat) axes.push("Préciser le format de sortie attendu (tableau, liste, JSON…).");
    if (!hasConstraint) axes.push("Ajouter des contraintes mesurables (longueur, ton, chiffres).");
    if (text.length < 60) axes.push("Enrichir le contexte : objectif, audience, données d'entrée.");
    if (axes.length === 0) axes.push("Excellent prompt — testez des variantes pour comparer.");

    const optimized = `${hasRole ? "" : "Tu es un expert du domaine. "}${text.trim()}${
      hasFormat ? "" : "\n\nRéponds sous forme de liste structurée."
    }${hasConstraint ? "" : "\nSois précis, concret et limite-toi à l'essentiel."}`;

    return Response.json({ score, axes, optimized });
  }

  const { generateObject } = await import("ai");
  const { z } = await import("zod");
  const { object } = await generateObject({
    model: AKADIA_MODEL,
    schema: z.object({
      score: z.number().min(0).max(100),
      axes: z.array(z.string()),
      optimized: z.string(),
    }),
    prompt: `Évalue ce prompt sur 100 selon contexte, précision, contraintes et format attendu. Donne des axes d'amélioration et une version optimisée.\n\nPrompt:\n${text}`,
  });
  return Response.json(object);
}

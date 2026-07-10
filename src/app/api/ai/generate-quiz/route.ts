import { aiEnabled, AKADIA_MODEL } from "@/lib/ai";

export const maxDuration = 120;

// Quiz de démo : sert aussi de filet de sécurité si le gateway échoue.
function demoQuiz(sujet: string, nb: number) {
  const questions = Array.from({ length: Math.min(nb, 5) }, (_, i) => ({
    enonce: `Question ${i + 1} sur « ${sujet} » : quelle affirmation est correcte ?`,
    options: [
      `Réponse exacte sur ${sujet}`,
      "Affirmation plausible mais fausse",
      "Confusion fréquente",
      "Hors sujet",
    ],
    reponse: 0,
  }));
  return { titre: `Quiz : ${sujet}`, questions, _demo: true };
}

export async function POST(req: Request) {
  const { sujet, nb } = await req.json().catch(() => ({}));
  const s = String(sujet ?? "Culture générale").trim();
  const n = Math.min(Math.max(Number(nb) || 5, 2), 15);

  if (!aiEnabled()) {
    return Response.json(demoQuiz(s, n));
  }

  try {
    const { generateObject } = await import("ai");
    const { z } = await import("zod");
    const { object } = await generateObject({
      model: AKADIA_MODEL,
      schema: z.object({
        titre: z.string(),
        questions: z
          .array(
            z.object({
              enonce: z.string(),
              options: z.array(z.string()).length(4),
              reponse: z.number().int().min(0).max(3),
            })
          )
          .min(2),
      }),
      prompt: `Génère un quiz QCM de ${n} questions en français sur le sujet « ${s} », pour une session de formation professionnelle en direct (type Kahoot).
Chaque question : énoncé court et clair, exactement 4 options plausibles, index (0-3) de la bonne réponse dans "reponse". Varie la position de la bonne réponse. Niveau progressif.`,
    });
    return Response.json(object);
  } catch (e) {
    console.error("[ai] generate-quiz, repli démo :", e instanceof Error ? e.message : e);
    return Response.json(demoQuiz(s, n));
  }
}

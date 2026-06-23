import { aiEnabled, streamDemoText, AKA_SYSTEM_PROMPT, AKADIA_MODEL } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { message, context } = await req.json();

  if (!aiEnabled()) {
    const demo = `Bonne question ! Voici une explication claire.

${context ? `Dans le contexte de « ${context} » : ` : ""}En résumé, ${String(
      message ?? ""
    ).slice(0, 80)}… se comprend mieux avec une analogie : imagine un bibliothécaire qui connaît tous les livres et te résume l'essentiel à la demande.

Points clés :
1. Le concept de base et son utilité.
2. Un exemple concret tiré de la pratique.
3. Une erreur fréquente à éviter.

Souhaites-tu un quiz éclair ou une fiche mémo sur ce point ?`;
    return new Response(streamDemoText(demo), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Mode IA réel (AI Gateway) — activé dès qu'AI_GATEWAY_API_KEY est défini.
  const { streamText } = await import("ai");
  const result = streamText({
    model: AKADIA_MODEL,
    system: AKA_SYSTEM_PROMPT,
    prompt: `${context ? `Contexte de la leçon : ${context}\n\n` : ""}Question de l'apprenant : ${message}`,
  });
  return result.toTextStreamResponse();
}

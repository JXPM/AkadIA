// Couche IA partagée AKADIA (cf. wiki/pages/35 - IA intégrée partout).
// Par défaut : Claude via Vercel AI Gateway (modèles "provider/model").
// Sans clé AI_GATEWAY_API_KEY, les routes basculent en mode démo déterministe.

export const AKADIA_MODEL = "anthropic/claude-opus-4-8";

export function aiEnabled() {
  const key = process.env.AI_GATEWAY_API_KEY?.trim() ?? "";
  // Ignore les valeurs placeholder (« your-ai-gateway-key »…) : mieux vaut
  // le mode démo qu'un appel gateway garanti en échec.
  return key.length > 0 && !/^(your[-_]|changeme|xxx)/i.test(key);
}

export const AKA_SYSTEM_PROMPT = `Tu es AKA, l'assistant pédagogique d'AKADIA.
Tu aides les apprenants à comprendre des notions, exercices et études de cas.
Tu adaptes ton niveau (débutant, intermédiaire, avancé), tu donnes des exemples,
des analogies, des résumés et des fiches mémo. Réponds en français, de façon
claire, structurée et bienveillante.`;

// Stream texte simple (compatible avec un fetch + ReadableStream côté client).
export function streamDemoText(text: string) {
  const encoder = new TextEncoder();
  const tokens = text.split(/(\s+)/);
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const t of tokens) {
        controller.enqueue(encoder.encode(t));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.close();
    },
  });
}

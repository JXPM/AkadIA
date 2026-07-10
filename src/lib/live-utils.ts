// Fonctions pures des sessions live (testables, sans dépendance serveur).

export const QUESTION_DUREE_S = 30;

// Alphabet sans caractères ambigus (0/O, 1/I…).
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function genererCode(longueur = 6): string {
  let code = "";
  for (let i = 0; i < longueur; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export function normaliserCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^0-9A-Z]/g, "");
}

/** Points : 100 pour une bonne réponse + bonus de rapidité (jusqu'à 100). */
export function calculerPoints(correcte: boolean, elapsedMs: number): number {
  if (!correcte) return 0;
  const ratio = Math.min(1, Math.max(0, elapsedMs / (QUESTION_DUREE_S * 1000)));
  return 100 + Math.round(100 * (1 - ratio));
}

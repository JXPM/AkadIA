# AKADIA — Guide projet (logiciel)

> Ce fichier décrit le **logiciel** AKADIA. Le **wiki** (`wiki/CLAUDE.md`) décrit la base de connaissances / spec. Ne pas les confondre (cf. wiki §8).

## Quoi
LMS SaaS multi-tenant « Learning Operating System » avec IA générative intégrée partout. Voir `README.md` et `docs/`.

## Stack
Next.js 16 (App Router, RSC, Turbopack) · React 19 · TypeScript · Tailwind v4 · UI type shadcn (`src/components/ui`) · Framer Motion · Supabase (`@supabase/ssr`) · Vercel AI SDK / AI Gateway.

## Conventions
- **Français** dans l'UI et les libellés.
- Composants UI dans `src/components/ui` (style shadcn) ; ne pas réintroduire de lib UI tierce.
- Couleurs via tokens CSS de `src/app/globals.css` (`bg-brand`, `text-brand`, `gradient-brand`…). Ne pas coder de couleurs en dur hors design system.
- Données : en dev/démo, `src/lib/data.ts` (`NEXT_PUBLIC_DEMO_MODE=1`). En prod, Supabase via `src/lib/supabase/*` + schéma `supabase/migrations`.
- IA : passer par `src/lib/ai.ts` ; les routes `/api/ai/*` doivent garder le **fallback démo** (sans clé) fonctionnel.
- Multi-tenant : toute table métier porte `organization_id` + politique RLS.

## Commandes
`npm run dev` · `npm run build` · `npm run lint`.

## Garde-fous
- Lancer `npm run build` avant de considérer une tâche terminée.
- Ne pas committer sans demande explicite.
- Décisions par défaut (LLM Claude/AI Gateway, RLS multi-tenant, Stripe) : documentées dans `wiki/` — confirmer avant durcissement.

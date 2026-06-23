# AKADIA — Documentation technique

## Stack
- **Next.js 16** (App Router, RSC, Turbopack) · React 19 · TypeScript
- **Tailwind CSS v4** + composants type shadcn (`src/components/ui`)
- **Framer Motion** (animations)
- **Supabase** : Auth, PostgreSQL, Storage, Realtime (`@supabase/ssr`)
- **IA** : Vercel AI SDK via **AI Gateway** (modèles `provider/model`)

> La spec demandait Next.js 15 ; le scaffold installe la dernière LTS (16) — rétro-compatible App Router.

## Arborescence
```
src/
  app/
    (marketing)/      site public : accueil, catalogue, [slug], tarifs, à-propos, blog, contact, laboratoire
    (auth)/           connexion, inscription
    app/              espace apprenant (dashboard) — AppShell
    cours/[slug]/     lecteur de cours 3 colonnes (menu / contenu / AKA)
    admin/            back-office : vue d'ensemble, formations, générateur IA — AppShell
    formateur/        cockpit de session présentiel/live
    api/ai/           routes IA : chat (AKA), generate-formation, prompt-score
  components/
    ui/               primitives (button, card, badge, input, progress)
    layout/           site-header, site-footer, app-shell
    marketing/        section, reveal
    course/           aka-assistant
    brand/            logo
  lib/
    utils.ts, types.ts, data.ts (démo), ai.ts, supabase/{client,server}.ts
supabase/
  migrations/0001_init.sql   schéma complet + RLS
  seed.sql                   données de démo
docs/                        cette documentation
```

## Configuration
1. `cp .env.example .env.local` puis renseigner Supabase / AI Gateway.
2. `NEXT_PUBLIC_DEMO_MODE=1` → l'app tourne sur le jeu de données local (`src/lib/data.ts`), sans Supabase.
3. Sans `AI_GATEWAY_API_KEY`, les routes `/api/ai/*` répondent en **mode démo déterministe** ; avec la clé, elles utilisent Claude via l'AI Gateway.

## Commandes
```bash
npm run dev      # développement (http://localhost:3000)
npm run build    # build production
npm run start    # serveur production
npm run lint     # lint
```

## Base de données
- Schéma : `supabase/migrations/0001_init.sql` (25 tables, enums, index, triggers).
- **Multi-tenant** : colonne `organization_id` + **RLS** (`current_org()`, `is_admin()`).
- Identité : `profiles` référence `auth.users` (Supabase Auth).
- Appliquer : `supabase db reset` (CLI) ou exécuter le SQL dans l'éditeur Supabase, puis `seed.sql`.

## Couche IA (`src/lib/ai.ts`)
- `aiEnabled()` : bascule réel/démo selon la présence de la clé.
- `AKA_SYSTEM_PROMPT` : persona de l'assistant.
- Routes : `streamText` (chat) et `generateObject` + Zod (génération structurée).

## Sécurité & conformité
- RLS sur toutes les tables sensibles.
- Accessibilité : WCAG, mode clair/sombre (`next-themes`), focus visibles, responsive mobile-first.

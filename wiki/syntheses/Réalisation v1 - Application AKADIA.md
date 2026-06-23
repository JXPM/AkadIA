---
type: synthesis
tags: [akadia, realisation, code, build, lms]
created: 2026-06-23
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# Réalisation v1 — Application AKADIA

Première réalisation **runnable** de la plateforme à partir de la spec ([[2026-06-23 - Spec AKADIA - Plateforme LMS]]). Code dans `/home/johan/AkadIA` (à côté de `wiki/`). `npm run build` ✅ (32 routes). Dev : `npm run dev` → http://localhost:3001 (vérifié par captures).

## Stack livrée
Next.js 16 (App Router, Turbopack) · React 19 · TS · **Tailwind v4** + UI type shadcn maison · **Framer Motion** · **Supabase** (`@supabase/ssr`) · **Vercel AI SDK / AI Gateway**. Cf. [[02 - Stack technique & architecture]].
> Spec demandait Next 15 ; scaffold installe 16 (rétro-compatible). Build force le port 3001 si 3000 occupé.

## Ce qui est implémenté
| Domaine wiki | Réalisé |
|--------------|---------|
| [[03 - Design System]] | Tokens bleu nuit/bleu électrique, clair-sombre, `globals.css` + primitives `ui/` (capture `assets/2026-06-23 - AKADIA accueil.jpeg`) |
| [[20 - Site public & page d'accueil]] | Accueil (hero, chiffres, features, formations, témoignages, FAQ, CTA), catalogue+filtres, fiche formation, tarifs, à-propos, blog, contact |
| [[21 - Espace apprenant]] | Dashboard (KPIs, formations en cours, badges, activités) |
| [[22 - Page de cours]] | Lecteur **3 colonnes** menu/contenu/AKA (capture `...cours desktop 3 colonnes.jpeg`) |
| [[30 - Assistant IA pédagogique (AKA)]] | Composant chat streaming → `/api/ai/chat` |
| [[31 - Générateur de formations IA]] | `/admin/formations/nouvelle` → `/api/ai/generate-formation` (generateObject+Zod) |
| [[33 - Laboratoire IA]] + [[34 - Générateur & bibliothèque de prompts]] | `/laboratoire` (score /100, axes, version optimisée) + bibliothèque |
| [[23 - Mode formateur présentiel]] | `/formateur` cockpit live (pilotage, projection, timer, classement temps réel) |
| [[25 - Administration, rôles & permissions]] | `/admin` (vue d'ensemble, formations, générateur) |
| [[40 - Base de données Supabase]] | `supabase/migrations/0001_init.sql` : 25 tables + enums + index + **RLS** multi-tenant + `seed.sql` |
| [[42 - Accessibilité]] | Mode clair/sombre (`next-themes`), responsive mobile-first, focus visibles |
| [[50 - Livrables attendus]] | Docs `docs/01-04` (technique/admin/formateur/apprenant), README, CLAUDE.md racine |

## Décisions par défaut prises (à confirmer)
- **LLM = Claude via Vercel AI Gateway** (`src/lib/ai.ts`, `AKADIA_MODEL=anthropic/claude-opus-4-8`). Fallback **démo déterministe** sans clé → l'app tourne sans backend.
- **Multi-tenant = RLS par `organization_id`** (`current_org()`, `is_admin()`).
- **Paiements = Stripe** (tables `payments`/`subscriptions` + env, intégration à finaliser).
- **Mode démo** (`NEXT_PUBLIC_DEMO_MODE=1`) : données locales `src/lib/data.ts`, app fonctionnelle sans Supabase.

## Corrections en cours de build
- `Button asChild` réécrit (clone du child) : supprime le `<button><a>` invalide + la fuite de l'attribut `asChild` dans le DOM.

## Reste à faire (vers la prod)
- Brancher Supabase réel (auth + requêtes) en remplacement des données démo.
- Câbler les clés AI Gateway + Stripe ; finaliser paiement et génération capsules vidéo ([[32 - Générateur de capsules vidéo IA]] : pile TTS+slides+assemblage non implémentée).
- Génération PDF des [[13 - Certifications & attestations|attestations]] (QR + signature).
- Intégrations visio natives ([[24 - Classes virtuelles]]).
- Tests + CI + déploiement (Vercel).

## Références
- Code : `/home/johan/AkadIA` (`src/`, `supabase/`, `docs/`).
- Captures : `assets/2026-06-23 - AKADIA *.jpeg`.

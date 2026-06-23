---
type: log
tags: [akadia, log]
updated: 2026-06-23
---

# Journal — AkadIA

Append-only. Préfixe parsable : `## [AAAA-MM-JJ] <ingest|query|lint|setup|maintenance> | <titre>`.
`grep "^## \[" wiki/log.md | tail -5` → 5 dernières actions.

## [2026-06-23] setup | Initialisation du second cerveau AkadIA
- Création du vault `wiki/` selon le pattern LLM Wiki (template `fingec/wiki`).
- Fichiers : `CLAUDE.md` (schéma), `index.md`, `log.md`, `pages/00 - Index (MOC).md`.
- Dossiers : `sources/`, `pages/`, `syntheses/`, `assets/`.
- Commandes slash installées : `/ingest`, `/query`, `/save`, `/lint`.
- Config Obsidian (`.obsidian/`) : core plugins activés (graph, backlinks, properties, canvas, templates…).
- Boîte à outils documentée : [[Playwright]] (MCP, installé), [[uipro]] (CLI, installé), [[aura.build]], [[Awwwards]].
- En attente : confirmation du **domaine précis d'AkadIA** pour affiner nommage/tags + premier ingest réel.

## [2026-06-23] maintenance | Domaine confirmé : éducatif / académique
- Schéma `CLAUDE.md` §0 + MOC mis à jour : AkadIA = domaine **éducatif/académique** (academia + IA).

## [2026-06-23] ingest | aura.build — Composants « Section »
- Source web ingérée via **Playwright** (navigate + snapshot + screenshot full-page).
- Brut : `assets/2026-06-23 - aura.build components Section.jpeg`.
- Page source créée : [[2026-06-23 - aura.build - Composants Section]].
- Propagation : [[aura.build]] enrichie (catégories réelles + sections utiles éducation).
- Index mis à jour (1re entrée Sources).
- Takeaways : catalogue Tailwind (Hero/Section/Feature/Testimonial/Pricing…) ; sections directement pertinentes pour une landing éducative (Bootcamp/Course Hero, Curriculum grid). Triptyque [[aura.build]] → [[uipro]] ← [[Awwwards]].
- Questions ouvertes : landing publique prévue ? stack front (Next.js+Tailwind+shadcn) ?

## [2026-06-23] ingest | Spec AKADIA — Plateforme LMS intelligente (source fondatrice)
- Prompt projet complet ingéré. Brut immuable : `assets/2026-06-23 - Spec AKADIA (prompt complet).md`.
- Page source : [[2026-06-23 - Spec AKADIA - Plateforme LMS]].
- Réponses aux questions précédentes : OUI landing publique ([[20 - Site public & page d'accueil]]) ; stack confirmée Next.js 15 + React + TS + Tailwind + shadcn + Framer Motion + Supabase ([[02 - Stack technique & architecture]]).
- **25 pages créées** (familles 0x–5x) :
  - 0x : [[01 - Vue d'ensemble]], [[02 - Stack technique & architecture]], [[03 - Design System]]
  - 1x : [[10 - Gestion & structure des formations]], [[11 - Types de contenu]], [[12 - Quiz intelligents]], [[13 - Certifications & attestations]], [[14 - Gamification]], [[15 - Marketplace]]
  - 2x : [[20 - Site public & page d'accueil]], [[21 - Espace apprenant]], [[22 - Page de cours]], [[23 - Mode formateur présentiel]], [[24 - Classes virtuelles]], [[25 - Administration, rôles & permissions]]
  - 3x : [[30 - Assistant IA pédagogique (AKA)]], [[31 - Générateur de formations IA]], [[32 - Générateur de capsules vidéo IA]], [[33 - Laboratoire IA]], [[34 - Générateur & bibliothèque de prompts]], [[35 - IA intégrée partout]]
  - 4x : [[40 - Base de données Supabase]], [[41 - Analytics]], [[42 - Accessibilité]]
  - 5x : [[50 - Livrables attendus]]
- `index.md` reconstruit (catalogue complet par famille). MOC `00` réécrit (parcours de lecture).
- Contradictions : aucune (source fondatrice). Questions ouvertes flaguées via `> [!question]` : fournisseur LLM, stratégie multi-tenant (RLS vs schéma/tenant), paiements (Stripe ?), pile capsules vidéo (TTS+slides+assemblage), intégrations visio natives, table historique chat AKA manquante.

## [2026-06-23] build | Réalisation v1 de l'application AKADIA
- Code échafaudé dans `/home/johan/AkadIA` (Next.js 16 + React 19 + TS + Tailwind v4 + shadcn maison + Framer Motion + Supabase + AI SDK).
- 32 routes, `npm run build` ✅ ; dev vérifié sur http://localhost:3001 (toutes pages 200, APIs IA démo OK).
- Implémenté : site public complet, dashboard apprenant, lecteur de cours 3 colonnes + AKA (streaming), générateur de formations IA, laboratoire de prompts, mode formateur live, admin, schéma SQL Supabase (25 tables + RLS), docs (technique/admin/formateur/apprenant), README, CLAUDE.md racine.
- Décisions par défaut : LLM Claude via AI Gateway, multi-tenant RLS `organization_id`, Stripe (stub), mode démo sans backend.
- Captures dans `assets/2026-06-23 - AKADIA *.jpeg`. Synthèse : [[Réalisation v1 - Application AKADIA]].
- Bug corrigé : `Button asChild` (clone du child au lieu de `<button><a>`).

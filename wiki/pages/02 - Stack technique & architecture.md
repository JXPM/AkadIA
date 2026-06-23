---
type: system
tags: [akadia, architecture, stack, supabase, nextjs]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 02 — Stack technique & architecture

## Frontend
- **Next.js 15** (App Router) · **React** · **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (→ [[03 - Design System]], implémentation via [[uipro]])
- **Framer Motion** (animations douces)
- **Responsive Mobile First** ([[42 - Accessibilité]])

## Backend — Supabase
Supabase fournit tout le socle :
- **Authentification** (rôles → [[25 - Administration, rôles & permissions]])
- **Base de données** PostgreSQL ([[40 - Base de données Supabase]])
- **Stockage fichiers** (images, PDF, capsules vidéo, slides)
- **Temps réel** (Realtime) — clé pour le [[23 - Mode formateur présentiel]] (vue live, projection)
- **Analytics** ([[41 - Analytics]])

## Architecture
- **SaaS Multi-Tenant** — isolation des organisations. Hypothèse de travail : `organization_id` sur les tables + **policies RLS** Supabase (à confirmer vs schéma-par-tenant).
  > [!question] À trancher : multi-tenant par RLS (`organization_id`) vs schéma/DB par tenant. Impacte [[40 - Base de données Supabase]].
- **Scalable** · **Clean Architecture** (séparation domaine / app / infra) · **Mobile First**.

## Couche IA
La spec impose une **IA générative intégrée partout** ([[35 - IA intégrée partout]]) : générateurs de formations/capsules, assistant AKA, scoring de prompts. Nécessite un **fournisseur LLM** + orchestration.
> [!question] Fournisseur LLM non spécifié. Reco par défaut (cf. contexte plateforme) : **Claude via Vercel AI Gateway** (AI SDK), modèles `provider/model`. À valider avec Johan (coûts, quotas, RGPD/zero-retention).

## Hébergement / déploiement
Non spécifié. Front Next.js 15 → **Vercel** est le candidat naturel ; Supabase managé en backend. À documenter dans une future page `40-49` infra.

## Références croisées
[[01 - Vue d'ensemble]] · [[40 - Base de données Supabase]] · [[50 - Livrables attendus]]

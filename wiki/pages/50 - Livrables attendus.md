---
type: reference
tags: [akadia, livrables, roadmap]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 50 — Livrables attendus

Résultat **prêt pour mise en production SaaS professionnelle**. 13 livrables :

| # | Livrable | Page wiki liée |
|---|----------|----------------|
| 1 | Architecture complète | [[02 - Stack technique & architecture]] |
| 2 | Arborescence détaillée | (à produire) |
| 3 | Base de données complète | [[40 - Base de données Supabase]] |
| 4 | Schéma SQL Supabase | [[40 - Base de données Supabase]] |
| 5 | Toutes les pages | famille 2x ([[20 - Site public & page d'accueil]]…) |
| 6 | Tous les composants React | [[03 - Design System]] / [[uipro]] |
| 7 | Tous les endpoints API | (à produire) |
| 8 | Toutes les routes | (à produire) |
| 9 | Jeu de données de démonstration | (à produire) |
| 10 | Documentation technique | (à produire) |
| 11 | Documentation administrateur | [[25 - Administration, rôles & permissions]] |
| 12 | Documentation formateur | [[23 - Mode formateur présentiel]] |
| 13 | Documentation apprenant | [[21 - Espace apprenant]] |

> [!note] Ces livrables relèvent de la **construction du logiciel**, pas du wiki. Ce wiki en est la **spec vivante** : il documente le quoi/pourquoi ; le code (futur dépôt AKADIA) produira le comment. Voir garde-fous [[CLAUDE.md]] §8.

## Prochaines étapes suggérées
1. Trancher les `> [!question]` ouvertes (LLM provider, multi-tenant, paiements, pile capsules vidéo).
2. Figer le [[03 - Design System|design system]] (hex + tokens).
3. Détailler le [[40 - Base de données Supabase|schéma SQL]] + RLS.
4. Lancer le scaffolding front (`uipro init --ai claude`, Next.js 15).

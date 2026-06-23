---
type: system
tags: [akadia, analytics, reporting, kpi]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 41 — Analytics

Tableaux de bord complets avec **graphiques interactifs**.

## Mesures
Progression · temps passé · **taux de complétion** · réussite · engagement · activité.

## Sources de données
`attempts` ([[12 - Quiz intelligents]]), progression de cours ([[21 - Espace apprenant]], [[22 - Page de cours]]), sessions live ([[23 - Mode formateur présentiel]]), ventes ([[15 - Marketplace]]) → agrégées dans `analytics` ([[40 - Base de données Supabase]]).

## Audiences
- **Apprenant** : sa progression (dashboard, [[21 - Espace apprenant]]).
- **Formateur** : tableau de bord live ([[23 - Mode formateur présentiel]]).
- **Admin** : vue organisation/plateforme ([[25 - Administration, rôles & permissions]]).

> [!tip] Graphiques : librairie de charts compatible Next.js/React (Recharts/visx). Respecter [[42 - Accessibilité]] (contrastes, alternatives textuelles).

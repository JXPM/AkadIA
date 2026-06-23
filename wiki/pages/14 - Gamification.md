---
type: system
tags: [akadia, gamification, engagement]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 14 — Gamification

Levier d'engagement de l'[[21 - Espace apprenant]].

## Mécaniques
- **XP** · **Niveaux** · **Badges** · **Récompenses** · **Classements** · **Succès déblocables**.

## Badges (exemples)
Explorateur · **Prompt Master** · Analyste IA · Expert IA · Formateur IA.
> Ces exemples confirment le **fort accent IA/prompting** du catalogue (cf. [[33 - Laboratoire IA]], [[34 - Générateur & bibliothèque de prompts]]).

## Sources de points
- Complétion de leçons ([[10 - Gestion & structure des formations]]).
- Réussite aux [[12 - Quiz intelligents]].
- Score au [[33 - Laboratoire IA]] (prompts /100).
- Classements live en [[23 - Mode formateur présentiel|présentiel]].

## Données
Tables `badges`, `achievements` ([[40 - Base de données Supabase]]) ; XP/niveau probablement sur `users` ou table dédiée. Visible dans le dashboard ([[21 - Espace apprenant]]) et [[41 - Analytics]].

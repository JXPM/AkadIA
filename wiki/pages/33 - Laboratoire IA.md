---
type: system
tags: [akadia, ia, prompts, laboratoire, scoring]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 33 — Laboratoire IA

Zone **pratique** où l'utilisateur s'entraîne au prompting : tester des prompts, simuler des demandes, expérimenter.

## Analyse du prompt
Le système évalue : **contexte** · **précision** · **contraintes** · **format attendu**.

## Retour
- **Score /100**
- **Axes d'amélioration**
- **Version optimisée** du prompt

Les essais sont historisés (table `prompt_tests`, [[40 - Base de données Supabase]]) et nourrissent la [[14 - Gamification]] (badge « Prompt Master », XP).

## Liens
[[34 - Générateur & bibliothèque de prompts]] · [[30 - Assistant IA pédagogique (AKA)]] · [[35 - IA intégrée partout]].

> [!note] Le couple Laboratoire + Bibliothèque de prompts confirme un **segment de lancement orienté formations IA/prompting** (cf. badges de [[14 - Gamification]]).

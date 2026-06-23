---
type: system
tags: [akadia, quiz, evaluation, ia]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 12 — Quiz intelligents

Évaluation des apprenants, intégrée à la [[10 - Gestion & structure des formations|structure des formations]] et à la [[22 - Page de cours]].

## Types de questions
- **QCM**
- **Vrai/Faux**
- **Glisser-déposer**
- **Cas pratique**
- **Réponse libre** (correction assistée IA)

## Correction & feedback
- **Correction automatique**.
- **Feedback détaillé** + **explications pédagogiques** par question.

## IA
- Génération de quiz : [[31 - Générateur de formations IA]] et [[35 - IA intégrée partout]].
- Explications/aide : [[30 - Assistant IA pédagogique (AKA)|AKA]].

## Données
Tables `quizzes`, `questions`, `attempts` ([[40 - Base de données Supabase]]). Les tentatives alimentent [[41 - Analytics]], la [[14 - Gamification]] (XP) et les [[13 - Certifications & attestations|attestations de réussite]] (score minimum).

## Présentiel
Les quiz se lancent en live (ouvrir un quiz, vue temps réel des réponses) → [[23 - Mode formateur présentiel]].

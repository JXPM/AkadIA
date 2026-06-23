---
type: system
tags: [akadia, ia, generation, formations]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 31 — Générateur de formations IA

**Fonction critique** du produit. L'administrateur saisit un **titre** (ex. « Protection des données et IA ») et AKADIA génère une formation complète.

## Sortie générée (éditable)
Objectifs pédagogiques · Modules · Plan détaillé · Leçons · Quiz · Exercices · Cas pratiques · Projet final · **Glossaire** · **Bibliographie**.

Le contenu **reste éditable** → il alimente la structure de [[10 - Gestion & structure des formations]] (Formation→Modules→Chapitres→Leçons + [[12 - Quiz intelligents]]).

## Enchaînement
Génération formation → par leçon, [[32 - Générateur de capsules vidéo IA]] → publication ([[15 - Marketplace]]).

## Technique
Génération **structurée** (objets imbriqués). Idéal pour *structured output* / outils de l'AI SDK.
> [!tip] Reco : sorties structurées (schéma Zod) via **Claude (AI Gateway)**. Découper en étapes (plan → modules → leçons → quiz) pour la fiabilité et l'édition.

## Liens
[[35 - IA intégrée partout]] · [[30 - Assistant IA pédagogique (AKA)]] · [[02 - Stack technique & architecture]].

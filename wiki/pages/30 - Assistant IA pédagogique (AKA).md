---
type: entity
tags: [akadia, ia, assistant, aka]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 30 — Assistant IA pédagogique (AKA)

**AKA** est l'assistant IA conversationnel d'AKADIA, présent en colonne droite de la [[22 - Page de cours]].

## Fonctions
- **Répondre** aux questions des apprenants.
- **Expliquer** : notions · exercices · études de cas.
- **Adapter son niveau** : débutant · intermédiaire · avancé.
- **Générer** : exemples · analogies · résumés · **fiches mémo**.

## Place dans le produit
Brique du **moteur IA pédagogique** ([[01 - Vue d'ensemble|espace #5]]), déclinaison contextuelle de l'[[35 - IA intégrée partout]]. S'appuie sur le contenu de la leçon courante ([[11 - Types de contenu]]) pour des réponses ancrées.

## Technique
Nécessite un LLM + contexte de cours (RAG/contexte de page). Fournisseur à arrêter ([[02 - Stack technique & architecture]]).
> [!tip] Reco par défaut : **Claude via AI Gateway** (AI SDK, streaming) pour le chat. Garder l'historique de conversation (table dédiée, hors liste actuelle).

## Liens
[[31 - Générateur de formations IA]] · [[33 - Laboratoire IA]] · [[14 - Gamification|badges IA]].

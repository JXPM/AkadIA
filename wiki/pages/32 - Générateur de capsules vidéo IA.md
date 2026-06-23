---
type: system
tags: [akadia, ia, video, capsule, generation]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 32 — Générateur de capsules vidéo IA

Disponible **pour chaque leçon** ([[10 - Gestion & structure des formations]]). L'admin clique « **Générer une capsule vidéo** ».

## Pipeline (5 étapes)
1. **Script pédagogique**
2. **Slides illustrés**
3. **Voix off**
4. **Sous-titres**
5. **Capsule vidéo** (assemblage)

## Caractéristiques
- Durée : **60–120 s**.
- Objectif : expliquer un concept rapidement (ex. « Qu'est-ce qu'un LLM ? », « Qu'est-ce que le RGPD ? », « Comment fonctionne un prompt ? »).
- **Intégration automatique** dans le cours ([[22 - Page de cours]], type « Capsule vidéo » de [[11 - Types de contenu]]). Stockage `videos` ([[40 - Base de données Supabase]]) + Storage Supabase.

## Technique (à arrêter)
> [!question] Pile non spécifiée — combine : LLM (script) + génération d'images/slides + **TTS** (voix off) + génération de sous-titres + **assemblage vidéo**. Décider : services managés vs FFmpeg/Remotion. Coût et latence à évaluer. Voir [[02 - Stack technique & architecture]].

## Liens
[[31 - Générateur de formations IA]] · [[35 - IA intégrée partout]].

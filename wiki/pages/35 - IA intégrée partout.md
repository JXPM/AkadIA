---
type: concept
tags: [akadia, ia, transversal]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 35 — IA intégrée partout

Principe transversal : l'IA générative est **disponible dans toute la plateforme**, pas cantonnée à un écran.

## Capacités exposées partout
Résumer · reformuler · générer · expliquer · créer des **quiz** · créer des **exercices** · créer des **cas pratiques** · créer des **slides** · créer des **capsules vidéo** · créer des **fiches de révision**.

## Déclinaisons concrètes
- Conversationnel pour l'apprenant → [[30 - Assistant IA pédagogique (AKA)]]
- Création de cours → [[31 - Générateur de formations IA]]
- Vidéo → [[32 - Générateur de capsules vidéo IA]]
- Prompting → [[33 - Laboratoire IA]], [[34 - Générateur & bibliothèque de prompts]]
- Quiz → [[12 - Quiz intelligents]]

## Implication technique
Besoin d'une **couche IA partagée** (provider, prompts système, quotas, observabilité) — cf. [[02 - Stack technique & architecture]].
> [!tip] Mutualiser via une couche unique (AI SDK + AI Gateway) : un seul point pour modèles, coûts, fallback, logs.

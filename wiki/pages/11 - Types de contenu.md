---
type: concept
tags: [akadia, formations, contenu]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 11 — Types de contenu

Une leçon ([[10 - Gestion & structure des formations]]) peut prendre **14 formats** :

| Type | Note |
|------|------|
| Leçon texte | texte enrichi (images, schémas, tableaux) |
| Leçon interactive | composants interactifs |
| Présentation | slides |
| PDF | document affiché/téléchargeable |
| Fichier téléchargeable | ressource jointe |
| Étude de cas | scénario appliqué |
| Quiz | → [[12 - Quiz intelligents]] |
| Atelier | exercice guidé (utilisable en [[23 - Mode formateur présentiel|présentiel]]) |
| Challenge | défi chronométré (présentiel) |
| Escape Game | jeu d'évasion pédagogique (présentiel) |
| Simulation | mise en situation |
| Classe virtuelle | → [[24 - Classes virtuelles]] |
| Capsule vidéo | générée par IA → [[32 - Générateur de capsules vidéo IA]] |
| Webinaire | session diffusée |

La [[22 - Page de cours]] doit rendre tous ces types (texte enrichi, images, schémas, tableaux, PDF, vidéos, exercices). Stockés via `lessons` / `documents` / `videos` ([[40 - Base de données Supabase]]).

> [!note] Plusieurs types (Atelier, Challenge, Escape Game, Simulation) sont surtout activés en **mode présentiel/live** → forte synergie avec [[23 - Mode formateur présentiel]].

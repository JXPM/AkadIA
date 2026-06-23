---
type: system
tags: [akadia, formations, contenu, metier]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 10 — Gestion & structure des formations

Cœur métier d'AKADIA. Un administrateur ([[25 - Administration, rôles & permissions]]) crée un nombre **illimité** de formations.

## Attributs d'une formation
Titre · Description · Image · **Auteur** · **Catégorie** · **Difficulté** · **Durée** · **Prix** · **Tags** · **Objectifs pédagogiques**.

## Statuts (cycle de vie)
`Brouillon` → `Publiée` → `Archivée`. (Mappe sur un champ `status` de la table `formations`, cf. [[40 - Base de données Supabase]].)

## Hiérarchie de contenu
```
Formation
 └─ Modules
     └─ Chapitres
         └─ Leçons
             ├─ Exercices
             ├─ Quiz            → [[12 - Quiz intelligents]]
             ├─ Études de cas
             └─ Projet final
```
Chaque niveau est **modifiable via interface** (éditeur CRUD). Mappe sur les tables `formations / modules / chapitres / lessons` + `quizzes`.

## Contenu d'une leçon
Voir [[11 - Types de contenu]] (14 types : texte, interactif, PDF, vidéo, atelier, escape game, simulation…).

## IA appliquée
- Création accélérée : [[31 - Générateur de formations IA]] génère plan, modules, leçons, quiz, projet, glossaire, biblio (éditable).
- Par leçon : [[32 - Générateur de capsules vidéo IA]].
- Partout : [[35 - IA intégrée partout]] (résumer, reformuler, générer exercices…).

## Liens
[[01 - Vue d'ensemble]] · [[15 - Marketplace]] (publication/vente) · [[13 - Certifications & attestations]] · [[41 - Analytics]] (suivi de complétion).

---
type: system
tags: [akadia, produit, vision, lms]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 01 — Vue d'ensemble

**AKADIA** est un **LMS SaaS multi-tenant** — un « *Learning Operating System* » — pour **créer, gérer, vendre, animer et suivre** des formations professionnelles. Ce n'est **pas** une plateforme mono-formation : elle héberge un nombre **illimité** de formations sur tout sujet (IA générative, RGPD, Excel, Power BI, audit, comptabilité, fiscalité, cybersécurité, data, dév, management…).

## Positionnement
Rivaliser avec **Coursera, OpenClassrooms, DataCamp, Udemy Business, Moodle moderne, 360Learning**. Différenciateur : l'**IA générative intégrée partout** ([[35 - IA intégrée partout]]) — génération de formations complètes, capsules vidéo, assistant pédagogique [[30 - Assistant IA pédagogique (AKA)|AKA]], laboratoire de prompts — **plus** un mode présentiel/hybride live ([[23 - Mode formateur présentiel]]).

## Les 6 espaces
1. **Site public** — vitrine + catalogue → [[20 - Site public & page d'accueil]]
2. **Portail apprenant** → [[21 - Espace apprenant]] · [[22 - Page de cours]]
3. **Portail formateur** → [[23 - Mode formateur présentiel]] · [[24 - Classes virtuelles]]
4. **Portail administrateur** → [[25 - Administration, rôles & permissions]] · [[10 - Gestion & structure des formations]]
5. **Moteur IA pédagogique** → famille 3x ([[31 - Générateur de formations IA]], [[32 - Générateur de capsules vidéo IA]], [[33 - Laboratoire IA]], [[34 - Générateur & bibliothèque de prompts]])
6. **Marketplace** → [[15 - Marketplace]]

## Public & modèle
SaaS **B2B** (organisations/cabinets) avec rôles Super Admin / Administrateur / Formateur / Apprenant ([[25 - Administration, rôles & permissions]]). Monétisation : abonnements + vente de formations via [[15 - Marketplace]].

## Piliers techniques
- Stack & archi : [[02 - Stack technique & architecture]]
- Identité visuelle : [[03 - Design System]]
- Données : [[40 - Base de données Supabase]]
- Accessibilité : [[42 - Accessibilité]]

> [!note] Cette page deviendra le point d'entrée « métier » du wiki. Tenir à jour la liste des espaces et différenciateurs à mesure que la spec se précise.

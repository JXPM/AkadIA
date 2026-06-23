---
type: system
tags: [akadia, formateur, presentiel, live, realtime]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 23 — Mode formateur présentiel

Espace dédié aux formations **en salle ou hybrides** — différenciateur fort d'AKADIA. Repose sur le **Realtime Supabase** ([[02 - Stack technique & architecture]]).

## Pilotage de session
Lancer une session · ouvrir un quiz · lancer un **atelier** / **challenge** / **escape game** ([[11 - Types de contenu]]).

## Vue temps réel
Participants connectés · progression · scores · réponses · questions.

## Gestion des groupes
Création auto d'**équipes**, **groupes de travail**, **ateliers** ; suivi individuel **et** collectif. (Tables `sessions`, `groups` — [[40 - Base de données Supabase]].)

## Timer intelligent
Chronomètre · compte à rebours · alertes.

## Mode projection
Affichage **plein écran** : slides · quiz · résultats · classements ([[14 - Gamification]]).

## Tableau de bord live
Le formateur voit : apprenants **bloqués** · taux de réussite · progression moyenne · **sujets difficiles**.

## Liens
[[24 - Classes virtuelles]] (distanciel synchrone) · [[12 - Quiz intelligents]] · [[41 - Analytics]] · [[25 - Administration, rôles & permissions|rôle Formateur]].

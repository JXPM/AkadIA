---
type: system
tags: [akadia, supabase, base-de-donnees, schema, rls]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 40 — Base de données Supabase

Schéma PostgreSQL complet (Supabase) avec **relations, contraintes, index et policies RLS** ([[02 - Stack technique & architecture]]).

## Tables (25 spécifiées)
| Table | Domaine |
|-------|---------|
| `users` | comptes (rôle, XP) — [[25 - Administration, rôles & permissions]] |
| `organizations` | tenants (multi-tenant) |
| `formations` | formations — [[10 - Gestion & structure des formations]] |
| `modules` | modules d'une formation |
| `chapitres` | chapitres d'un module |
| `lessons` | leçons — [[11 - Types de contenu]] |
| `videos` | capsules vidéo — [[32 - Générateur de capsules vidéo IA]] |
| `documents` | PDF / fichiers |
| `quizzes` | quiz — [[12 - Quiz intelligents]] |
| `questions` | questions de quiz |
| `attempts` | tentatives / réponses |
| `badges` | badges — [[14 - Gamification]] |
| `achievements` | succès déblocables |
| `certificates` | certifications — [[13 - Certifications & attestations]] |
| `attestations` | attestations suivi/réussite |
| `sessions` | sessions live — [[23 - Mode formateur présentiel]] / [[24 - Classes virtuelles]] |
| `groups` | équipes/groupes de travail |
| `prompt_library` | bibliothèque — [[34 - Générateur & bibliothèque de prompts]] |
| `prompt_tests` | essais labo — [[33 - Laboratoire IA]] |
| `analytics` | mesures — [[41 - Analytics]] |
| `notifications` | rappels/alertes — [[24 - Classes virtuelles]] |
| `payments` | paiements — [[15 - Marketplace]] |
| `subscriptions` | abonnements |
| `roles` | rôles RBAC |
| `permissions` | permissions RBAC |

## À produire (livrable)
- **Schéma SQL Supabase** complet ([[50 - Livrables attendus]] #4).
- **Relations** (FK), **contraintes**, **index**, **policies RLS** (cloisonnement par `organization_id`).

> [!question] Multi-tenant : RLS par `organization_id` (recommandé) vs schéma par tenant. Hiérarchie contenu : `attempts` lié à `users`+`quizzes`(+`questions`). Historique de chat AKA non listé → table à ajouter ? ([[30 - Assistant IA pédagogique (AKA)]])

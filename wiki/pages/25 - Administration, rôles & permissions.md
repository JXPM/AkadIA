---
type: system
tags: [akadia, admin, roles, permissions, rbac]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 25 — Administration, rôles & permissions

Portail admin + modèle d'autorisation (RBAC) du SaaS multi-tenant ([[02 - Stack technique & architecture]]).

## Périmètre d'administration
Gestion de : utilisateurs · formations · contenus · quiz · badges · attestations · statistiques.

## Rôles
| Rôle | Portée |
|------|--------|
| **Super Admin** | plateforme entière (tous tenants) |
| **Administrateur** | une organisation/tenant |
| **Formateur** | animer/créer, sessions live ([[23 - Mode formateur présentiel]]) |
| **Apprenant** | suivre les formations ([[21 - Espace apprenant]]) |

## Permissions
Modèle `roles` / `permissions` ([[40 - Base de données Supabase]]) appliqué via **RLS Supabase** + auth. Multi-tenant : cloisonnement par `organization_id`.

## Liens
[[10 - Gestion & structure des formations]] · [[15 - Marketplace]] · [[41 - Analytics]] · [[01 - Vue d'ensemble]].

> [!question] Granularité des permissions : rôles fixes ou permissions fines paramétrables par tenant ?

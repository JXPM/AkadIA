---
type: system
tags: [akadia, marketplace, vente, paiement]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 15 — Marketplace

Espace de **vente/distribution** des formations ([[01 - Vue d'ensemble|espace #6]]).

## Catalogue
Liste des formations publiées ([[10 - Gestion & structure des formations|statut Publiée]]) avec **filtres** : catégorie · prix · difficulté · durée. (Le catalogue public est aussi exposé côté [[20 - Site public & page d'accueil]].)

## Pages détaillées
Fiche par formation : objectifs, plan, auteur, prix, avis (potentiels), CTA d'achat/inscription.

## Paiement
**Paiement intégré**.
> [!question] Prestataire non spécifié → **Stripe** candidat. Modèle : achat à l'unité **et/ou** abonnement B2B ? Tables `payments`, `subscriptions` ([[40 - Base de données Supabase]]).

## Liens
[[20 - Site public & page d'accueil|Catalogue public]] · [[41 - Analytics]] (ventes/conversion) · [[25 - Administration, rôles & permissions]].

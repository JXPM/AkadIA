---
type: system
tags: [akadia, certification, attestation, pdf]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 13 — Certifications & attestations

Deux niveaux de reconnaissance en fin de parcours ([[10 - Gestion & structure des formations]]).

| Niveau | Condition |
|--------|-----------|
| **Attestation de suivi** | progression minimum atteinte |
| **Attestation de réussite** | **score minimum configurable** (via [[12 - Quiz intelligents]]) |

## Génération PDF automatique
Le PDF inclut : **Nom**, **Formation**, **Date**, **QR Code**, **Signature numérique**.

## Données
Tables `certificates` et `attestations` ([[40 - Base de données Supabase]]). Affichées dans le [[21 - Espace apprenant|dashboard apprenant]] (« Certifications obtenues »).

> [!question] QR Code = vérification publique d'authenticité ? Signature numérique = clé de l'organisation ([[25 - Administration, rôles & permissions|tenant]]) ? À spécifier.

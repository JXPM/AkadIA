---
type: system
tags: [akadia, classe-virtuelle, visio, integrations]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 24 — Classes virtuelles

Sessions synchrones à distance, via intégrations visio.

## Intégrations
**Teams** · **Zoom** · **Google Meet**.

## Planification
Date · heure · durée. **Rappels automatiques** (→ table `notifications`, [[40 - Base de données Supabase]]).

Type de contenu associé : « Classe virtuelle » / « Webinaire » ([[11 - Types de contenu]]). Complémentaire au présentiel ([[23 - Mode formateur présentiel]]).

> [!question] Intégration native (API/OAuth Teams/Zoom/Meet) ou simples liens de réunion planifiés ? Impacte l'effort et le modèle de données (`sessions`).

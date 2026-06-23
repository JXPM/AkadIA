---
type: reference
tags: [akadia, outils, reference]
updated: 2026-06-23
---

# Boîte à outils AkadIA

Outils **standing** du projet : à garder installés et à mobiliser selon le besoin (cf. [[CLAUDE.md]] §7).

| Outil | Type | Rôle dans le wiki | Statut |
|-------|------|-------------------|--------|
| [[Playwright]] | MCP / navigateur | Ingérer sources web JS, screenshots dans `assets/` | ✅ installé (MCP) |
| [[uipro]] | CLI (`uipro init --ai claude`) | Scaffolding de composants UI assisté IA | ✅ installé (`~/.nvm/.../bin/uipro`) |
| [[aura.build]] | Site / bibliothèque | Sections & composants UI, inspiration patterns | 🔗 référence |
| [[Awwwards]] | Site / vitrine | Sites primés (parallax…), références design | 🔗 référence |
| Obsidian | App | IDE de lecture, graph view, Web Clipper, Dataview, Marp | ✅ AppImage 1.12.7 |

> [!tip] Workflow type
> Source web → **Playwright** pour naviguer/capturer → `assets/` → `/ingest`. Pour le volet design d'AkadIA, **uipro** scaffolde, **aura.build** / **awwwards** inspirent les patterns.

---
type: reference
tags: [akadia, outils, playwright, ingest]
updated: 2026-06-23
sources: ["https://github.com/microsoft/playwright"]
---

# Playwright

Framework d'automatisation de navigateur (Microsoft). Dans AkadIA, c'est l'outil d'**ingest des sources web** : sites JS/interactifs que `WebFetch` ne rend pas bien, et capture d'écran filée dans `assets/`.

- **Accès** : serveur MCP `mcp__plugin_playwright_playwright__*` (navigate, click, snapshot, take_screenshot, evaluate, fill_form…).
- **Repo** : `https://github.com/microsoft/playwright`.

## Usage dans le workflow d'ingest
1. `browser_navigate` vers l'URL source.
2. `browser_snapshot` (texte structuré, accessible) pour lire le contenu.
3. `browser_take_screenshot` → enregistrer dans `wiki/assets/AAAA-MM-JJ - <titre>.png`.
4. Continuer le `/ingest` normal (résumé dans `sources/`, propagation).

> [!tip] À privilégier sur WebFetch pour : sites avec rendu client (React/Vue), galeries (aura.build, awwwards), contenus derrière interaction (scroll/clic).

Voir [[Boîte à outils AkadIA]].
